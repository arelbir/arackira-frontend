"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import type { HGSFormValues } from "@/features/definitions/hgs/hgs-schema";
type HGSFormWithId = HGSFormValues & { id?: number };
import { useRef } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { CheckIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { useVehicleForm } from "./context/VehicleCreateProvider";
import { notifySuccess, notifyError } from "./sonner-util";
import { zodResolver } from "@hookform/resolvers/zod";
import { basicInfoSchema, purchaseSchema, gpsDetailsSchema, datesSchema, insuranceSchema, vehicleCreateSchema } from "./schema";
import { useVehicleCreate } from "../useVehicleCreate";
import { useRouter } from "next/navigation";
import { useInsuranceCreate } from "./useInsuranceCreate";
import { useHGSMutations } from "@/features/definitions/hgs/use-hgs";

const tabDefs = [
  { id: "purchase", label: "Genel Bilgiler", icon: "📝", schema: purchaseSchema },
  { id: "insurance", label: "Sigorta", icon: "🛡️", schema: insuranceSchema },
  { id: "dates", label: "Muayne", icon: "📅", schema: datesSchema },
  { id: "basic", label: "HGS", icon: "💳", schema: basicInfoSchema },
  { id: "gps", label: "Uydu Takip", icon: "📡", schema: gpsDetailsSchema },
  { id: "review", label: "Özet", icon: "✅", schema: null },
] as const;

export const TabNavigator: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [active, setActive] = useState<string>("purchase");
  const { form, vehicleId, setVehicleId } = useVehicleForm();
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Yeni state'ler
  const [isChassisValid, setIsChassisValid] = useState(false);
  const [showChassisWarning, setShowChassisWarning] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Şasi numarasını reaktif izle
  const chassisNumber = form.control ? (require('react-hook-form').useWatch({ control: form.control, name: "chassis_number" }) || "") : "";

  // Şasi kontrolü (her değişimde validasyon)
  useEffect(() => {
    const valid = !!chassisNumber && chassisNumber.trim().length >= 5;
    setIsChassisValid(valid);
    // Eğer aktif tab purchase değilse ve şasi geçersizse warning göster
    setShowChassisWarning(!valid && active !== "purchase");
    // Eğer tab değişiminde şasi geçersizse purchase'a zorla
    if (!valid && active !== "purchase") {
      setActive("purchase");
    }
  }, [chassisNumber, active]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tab değişiminde otomatik scroll to top
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [active]);

  // Dinamik tamamlanma oranı: sadece zorunlu alanlar
  const requiredFields: { name: string; label: string }[] = [
    { name: "plate_number", label: "Plaka" },
    { name: "branch_id", label: "Ruhsat Sahibi Firma" },
    { name: "vehicle_type_id", label: "Araç Tipi" },
    { name: "brand_id", label: "Marka" },
    { name: "model_id", label: "Model" },
    { name: "model_year", label: "Model Yılı" },
    { name: "chassis_number", label: "Şasi No" },
    { name: "supplier_id", label: "Satın Alınan Firma" },
    { name: "purchase_price", label: "Satınalma Bedeli" },
    { name: "invoice_date", label: "Fatura Tarihi" },
    { name: "gps_tracking_status", label: "GPS Takip Cihazı" },
  ];

  const getCompletion = () => {
    const values = form.getValues();
    let filled = 0;
    requiredFields.forEach(field => {
      const v = (values as any)[field.name];
      if (v !== undefined && v !== null && v !== "") filled++;
    });
    return requiredFields.length === 0 ? 0 : Math.round((filled / requiredFields.length) * 100);
  };
  const completion = getCompletion();

  // Yeni API uyumlu state
  const { createDraft, updateVehicle } = useVehicleCreate();
  const { createInsurances } = useInsuranceCreate();
  const { addMutation: createHGS, updateMutation: updateHGS } = useHGSMutations();
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Taslak kaydetme fonksiyonu
  const onDraftSave = async () => {
    const chassis_number = form.getValues('chassis_number');
    if (!chassis_number || chassis_number.trim().length < 5) {
      notifyError('Şasi numarası zorunlu ve en az 5 karakter olmalı!');
      return;
    }
    setIsSaving(true);
    try {
      const result = await createDraft({ chassis_number });
      setVehicleId(result.id);
      
    } catch (err) {
      notifyError('Taslak kaydedilemedi.');
    } finally {
      setIsSaving(false);
    }
  };

  // Tam kaydetme fonksiyonu
  const onSave = async () => {
    if (!vehicleId) {
      notifyError('Önce taslak oluşturmalısınız.');
      return;
    }
    const values = form.getValues();
    setIsSaving(true);
    try {
      // HGS ve insurances ayrı gönderilecek, araç PUT'undan çıkar
      const { hgsList = [], insurances = [], ...vehicleFields } = values;
// 0 olan tüm id alanlarını null'a çeviren yardımcı fonksiyon (component dışı)
const zeroToNull = <T extends Record<string, any>>(obj: T): T => {
  const newObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key.endsWith('_id') && (value === 0 || value === '0' || typeof value === 'undefined')) {
      newObj[key] = null;
    } else {
      newObj[key] = value;
    }
  }
  return newObj as T;
}

      const safeValues = zeroToNull({
        ...vehicleFields,
        is_draft: false,
        model_year: vehicleFields.model_year ?? 1900,
      }) as import("../schema").VehicleCreateInput;
      // 1. Aracı güncelle
      await updateVehicle(vehicleId, safeValues);
      // 2. Sigorta kayıtları: varsa güncelle, yoksa oluştur. Hiç kayıt yoksa API'ye gitme.
      if (Array.isArray(insurances) && insurances.length > 0) {
        type InsuranceWithId = typeof insurances[number] & { id?: number };
        const toCreate = (insurances as InsuranceWithId[]).filter((i) => !i.id);
        const toUpdate = (insurances as InsuranceWithId[]).filter((i) => i.id);
        if (toCreate.length > 0) {
          await createInsurances({ vehicle_id: vehicleId, insurances: toCreate });
        }
        if (toUpdate.length > 0) {
          for (const insurance of toUpdate) {
            // PUT /api/insurance/:id
            await fetch(`/api/insurance/${insurance.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...insurance, vehicle_id: vehicleId }),
            });
          }
        }
      }
      // 3. HGS kayıtlarını oluştur/güncelle
      if (Array.isArray(hgsList) && hgsList.length > 0) {
        for (const hgs of hgsList as HGSFormWithId[]) {
          if (typeof hgs.id !== "undefined" && hgs.id !== null) {
            await updateHGS.mutateAsync({ id: hgs.id, data: { ...hgs, vehicle_id: vehicleId } });
          } else {
            await createHGS.mutateAsync({ ...hgs, vehicle_id: vehicleId });
          }
        }
      }
      notifySuccess('Araç ve ilişkili kayıtlar başarıyla kaydedildi!');
      router.push('/dashboard/vehicles');
    } catch (err) {
      notifyError('Kayıt sırasında bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Tabs value={active} onValueChange={setActive}>
      {/* Ortak header: progress ve kaydet barı, sekme barı ve uyarı */}
      <div className="sticky top-0 z-30 bg-card dark:bg-card border border-card dark:border-card shadow rounded-b-lg px-2 pt-2 pb-0 mb-6 flex flex-col items-center">
        {/* Progress Bar + Eksik Alanlar + Kaydet: Yatay hizalama */}
        <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-6 mb-4 px-2 w-full">

                    {/* Eksik Alanlar Banner */}
                    {completion < 100 && (
            <div className="flex-1 flex items-center bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100 px-3 py-2 rounded text-xs md:text-sm min-w-0 overflow-x-auto whitespace-nowrap md:mr-4">
              <span className="font-bold text-yellow-700 dark:text-yellow-200 mr-2">!</span>
              <span className="truncate">
                Eksik alanlar: {requiredFields.filter(field => {
                  const v = (form.getValues() as any)[field.name];
                  return v === undefined || v === null || v === "";
                }).map(field => field.label).join(", ")}
              </span>
            </div>
          )}

          
          {/* Progress Bar */}
          <span className="text-xs text-gray-700 dark:text-gray-300 min-w-[70px] text-center">{completion}% tamamlandı</span>
          <div className="flex flex-col md:flex-row gap-2 md:gap-2 w-full md:w-auto">
            <button
              type="button"
              className={`px-4 py-1 rounded bg-muted text-muted-foreground border border-border text-sm font-semibold disabled:bg-gray-400 disabled:text-gray-200 transition-all w-full md:w-auto`}
              disabled={isSaving}
              onClick={onDraftSave}
            >
              {isSaving ? "Kaydediliyor..." : "Taslak Kaydet"}
            </button>
            <button
              type="button"
              className={`px-4 py-1 rounded bg-blue-600 text-white text-sm font-semibold disabled:bg-gray-400 disabled:text-gray-200 transition-all w-full md:w-auto`}
              disabled={completion < 100 || isSaving}
              onClick={onSave}
            >
              {isSaving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>

        </div>
        {(showChassisWarning || saveError) && (
          <div className={clsx(
            "p-2 mb-2 rounded text-sm text-center w-full max-w-2xl",
            saveError
              ? "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200"
              : "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200"
          )}>
            {saveError || "Diğer sekmelere geçmek için önce araç şasi numarası girmelisiniz!"}
          </div>
        )}
        <TabsList className="flex gap-2 w-fit bg-muted rounded-lg p-1 shadow-sm mt-2">
          {tabDefs.map(tab => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              disabled={(tab.id !== "purchase" && !isChassisValid) || isSaving}
              className={clsx(
                "px-4 py-2 rounded font-medium text-sm transition",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground"
              )}
            >
              {tab.label}
              {isSaving && active === tab.id && (
                <span className="ml-2 animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mb-5" />
      </div>

      {/* Tab içerikleri ortalı ve card içinde */}
      {tabDefs.map(tab => (
        <TabsContent key={tab.id} value={tab.id}>
           <div ref={active === tab.id ? contentRef : undefined} className="w-full">
            <Card className="p-6 mt-2 mb-10 shadow-lg w-full max-w-[95vw] md:max-w-screen-3xl mx-auto bg-card dark:bg-card border border-card dark:border-card">
              {active === tab.id && children}
            </Card>
          </div>
        </TabsContent>
      ))}

    </Tabs>
  );
};

// Helper to scope tab content
export const CreateTabContent = TabsContent;
