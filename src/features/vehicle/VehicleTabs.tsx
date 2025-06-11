import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import VehicleGeneralInfoTab from "./tabs/VehicleGeneralInfoTab";
import VehicleOtherInfoTab from "./tabs/VehicleOtherInfoTab";
import InsuranceTab from "./tabs/insurance/InsuranceTab"; // Modüler yapıyı kullan
import { UseFormReturn } from "react-hook-form";
import { VehicleFormValues } from "./vehicle-schema";

interface VehicleTabsProps {
  form: UseFormReturn<VehicleFormValues>;
  mode: "create" | "edit";
  onSubmit: (values: VehicleFormValues) => void;
  onPlateChange?: (plateNumber: string) => void;
  onAutoSave?: (values: VehicleFormValues) => Promise<any>; // Otomatik kaydetme callback'i
  loading?: boolean;
  submitText?: string;
}

const tabList = [
  { value: "genel", label: "Genel Bilgiler" },
  { value: "diger-bilgiler", label: "Diğer Bilgiler" },
  { value: "insurance-kasko", label: "Sigorta & Kasko" },
  // Diğer tablar eklenebilir
];

const VehicleTabs: React.FC<VehicleTabsProps> = ({ form, mode, onSubmit, onPlateChange, onAutoSave, loading, submitText }) => {
  const [activeTab, setActiveTab] = useState<string>("genel");
  const [isPlateValid, setIsPlateValid] = useState<boolean>(false);
  const [showPlateWarning, setShowPlateWarning] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Son işlenen plaka için bir referans tutalım
  const lastProcessedPlate = React.useRef("");
  
  // Plaka değerini izle
  useEffect(() => {
    // Form değerlerini dinle
    const subscription = form.watch((value, { name }) => {
      // Sadece plate_number değiştiğinde işlem yap
      if (name === "plate_number" || !name) {
        const plateNumber = value.plate_number || "";
        
        // Aynı plakayı tekrar işleme
        if (plateNumber === lastProcessedPlate.current) {
          return;
        }
        
        // Yeni plakayı referans olarak kaydet
        lastProcessedPlate.current = plateNumber;
        
        // Plaka geçerliliğini kontrol et
        const isValid = !!plateNumber && plateNumber.trim().length >= 5; // Minimum geçerli plaka uzunluğu
        setIsPlateValid(isValid);
        
        // Plaka geçersizken başka sekmeye geçilmeye çalışılırsa genel sekmeye geri dön
        if (!isValid && activeTab !== "genel") {
          setActiveTab("genel");
        }

        // Plaka geçerli ve callback sağlanmışsa çağır (tekrar tekrar çağırmamak için)
        if (isValid && plateNumber && onPlateChange) {
          onPlateChange(plateNumber);
        }
      }
    });
    
    // Initial check - ilk yüklemede bir kez yapılır
    const plateNumber = form.getValues("plate_number") || "";
    if (plateNumber && plateNumber !== lastProcessedPlate.current) {
      lastProcessedPlate.current = plateNumber;
      const isValid = plateNumber.trim().length >= 5;
      setIsPlateValid(isValid);
      
      // Geçerli plaka ile yüklenirse hemen callback'i çağır
      if (isValid && onPlateChange) {
        onPlateChange(plateNumber);
      }
    }
    
    // Cleanup
    return () => subscription.unsubscribe();
  }, [form, activeTab, onPlateChange]);
  
  // Tab değişikliği yönetimi
  const handleTabChange = async (value: string) => {
    // Aynı tab'a tıklandıysa bir şey yapma
    if (value === activeTab) return;
    
    // Eğer Genel sekmeden ayrılıyorsa ve plaka geçerli değilse uyarı göster
    if (value !== "genel" && !isPlateValid) {
      setShowPlateWarning(true);
      // 3 saniye sonra uyarıyı kaldır
      setTimeout(() => setShowPlateWarning(false), 3000);
      return;
    }
    
    // Önce plaka geçerliliğini kontrol et, geçerliyse otomatik kaydetmeyi dene
    // Otomatik kaydetme varsa ve plaka geçerliyse
    if (onAutoSave && isPlateValid) {
      try {
        setIsSaving(true);
        setSaveError(null);
        
        // Form verilerini al ve kaydet
        const values = form.getValues();
        await onAutoSave(values);
        
        // Kayıt başarılı, sekmeyi değiştir
        setActiveTab(value);
        setShowPlateWarning(false);
      } catch (error) {
        console.error("Tab değişimi sırasında kaydetme hatası:", error);
        setSaveError(error instanceof Error ? error.message : "Kaydetme sırasında bir hata oluştu");
        setTimeout(() => setSaveError(null), 5000);
      } finally {
        setIsSaving(false);
      }
    } else {
      // AutoSave yoksa direkt değiştir
      setActiveTab(value);
      setShowPlateWarning(false);
    }
  };
  
  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex w-full justify-center mt-6">
          {(showPlateWarning || saveError) && (
            <div className={`p-2 mb-4 rounded text-sm text-center ${saveError 
              ? "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200"
              : "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200"
            }`}>
              {saveError || "Diğer sekmelere geçmek için önce araç plakası girmelisiniz!"}
            </div>
          )}
          <TabsList className="text-muted-foreground h-9 w-fit items-center justify-center mb-4 bg-muted rounded-lg p-1 flex gap-2 shadow-sm">
            {tabList.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                disabled={(tab.value !== "genel" && !isPlateValid) || isSaving}
                className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tab.label}
                {isSaving && activeTab === tab.value && (
                  <span className="ml-2 animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="genel">
          <VehicleGeneralInfoTab form={form} />
        </TabsContent>
        <TabsContent value="diger-bilgiler">
          <VehicleOtherInfoTab form={form} />
        </TabsContent>
        <TabsContent value="insurance-kasko">
          <InsuranceTab form={form} vehicleId={form.getValues('id') || 0} />
        </TabsContent>
        {/* Diğer TabsContent'ler eklenebilir */}
        {/* Kaydet butonu kaldırıldı, sekme geçişlerinde otomatik kayıt yapılıyor */}
      </Tabs>
    </div>
  );
};

export default VehicleTabs;
