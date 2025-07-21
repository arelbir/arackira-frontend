"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSelectField } from "@/components/ui/form-select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import { useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
import { InsuranceLookupData, InsuranceFormData, INSURANCE_FIELDS } from "./insurance-constants";

interface InsuranceFormProps {
  index: number;
  initialData?: InsuranceFormData;
  lookups: InsuranceLookupData;
  onClose: () => void;
  onSave: () => void;
}

export function InsuranceForm({
  index,
  initialData,
  lookups,
  onClose,
  onSave
}: InsuranceFormProps) {
  // React Hook Form context kullan
  const { control, setValue, clearErrors, formState } = useFormContext();
  
  // Form gönderildiğinde çağrılan fonksiyon
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };
  
  // Form validation ve state senkronizasyonu için useEffect
  useEffect(() => {
    // Eğer initialData varsa (düzenleme veya kopyalama durumunda)
    if (initialData) {
      try {
        // Form validation hatalarını temizle
        clearErrors(`${INSURANCE_FIELDS.BASE}.${index}`);
        
        // Daha güvenilir bir şekilde tüm form alanlarını sıfırlayıp yeniden dolduralım
        const formValues: Record<string, any> = {};
        
        // Tüm initialData alanlarını hazırlayalım
        Object.entries(initialData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formValues[`${INSURANCE_FIELDS.BASE}.${index}.${key}`] = value;
          }
        });
        
        // Form değerlerini toplu olarak güncelleyelim
        Object.entries(formValues).forEach(([fieldPath, fieldValue]) => {
          setValue(fieldPath, fieldValue, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: true
          });
        });
        
        // Tarih alanları için özel kontrol
        const dateFields = [INSURANCE_FIELDS.POLICY_DATE, INSURANCE_FIELDS.START_DATE, INSURANCE_FIELDS.END_DATE];
        dateFields.forEach(dateField => {
          const dateValue = initialData[dateField];
          if (dateValue) {
            setValue(`${INSURANCE_FIELDS.BASE}.${index}.${dateField}`, dateValue, {
              shouldValidate: true
            });
          }
        });
        
        console.log(`Form verileri yüklendi: index=${index}, tür=${initialData.insurance_type_id}`);
      } catch (err) {
        console.error('Form verilerini yüklerken hata:', err);
      }
    }
  }, [initialData, index, clearErrors, setValue]);

  // Başlangıç tarihini izle
  const startDate = useWatch({
    control,
    name: `${INSURANCE_FIELDS.BASE}.${index}.${INSURANCE_FIELDS.START_DATE}`
  });

  // Bugünün tarihini döndüren yardımcı fonksiyon
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Belirli bir tarihten sonraki tarihi hesaplayan yardımcı fonksiyon
  const getDateAfter = (dateStr: string | undefined, months: number) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  };

  // Tarih alanları için butonlar - burada DRY prensibi uygulanıyor
  const DateButtons = ({ fieldName, label }: { fieldName: string, label: string }) => {
    const { control, setValue } = useFormContext();
    
    return (
      <div className="flex space-x-1 mt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-[10px] h-5 px-1"
          onClick={() => {
            setValue(`${INSURANCE_FIELDS.BASE}.${index}.${fieldName}`, getCurrentDate());
          }}
        >
          Bugün
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-[10px] h-5 px-1"
          onClick={() => {
            setValue(`${INSURANCE_FIELDS.BASE}.${index}.${fieldName}`, getDateAfter(getCurrentDate(), 6));
          }}
        >
          6 Ay Sonra
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-[10px] h-5 px-1"
          onClick={() => {
            setValue(`${INSURANCE_FIELDS.BASE}.${index}.${fieldName}`, getDateAfter(getCurrentDate(), 12));
          }}
        >
          1 Yıl Sonra
        </Button>
      </div>
    )
  };

  const getFieldName = (field: string) => `${INSURANCE_FIELDS.BASE}.${index}.${field}`;

  return (
    <form className="space-y-6" onSubmit={handleSubmit} id={`insurance-form-${index}`}>
      <Tabs defaultValue="main" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="main" className="flex-1">Genel Bilgiler</TabsTrigger>
          <TabsTrigger value="details" className="flex-1">Poliçe Detayları</TabsTrigger>
          <TabsTrigger value="payment" className="flex-1">Ödeme Bilgileri</TabsTrigger>
        </TabsList>
        
        <TabsContent value="main" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelectField
              control={control}
              name={getFieldName(INSURANCE_FIELDS.INSURANCE_TYPE_ID)}
              label="Sigorta Türü *"
              options={lookups.insuranceTypes}
              required
            />
            <div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Poliçe Tarihi *</label>
                <Controller
                  control={control}
                  name={getFieldName(INSURANCE_FIELDS.POLICY_DATE)}
                  render={({ field }) => (
                    <DatePicker
                      date={field.value ? new Date(field.value as string) : undefined}
                      onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                      placeholder="Poliçe Tarihi Seç"
                      format="dd.MM.yyyy"
                    />
                  )}
                />
                <DateButtons fieldName={INSURANCE_FIELDS.POLICY_DATE} label="Poliçe Tarihi" />
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Başlangıç Tarihi *</label>
                <Controller
                  control={control}
                  name={getFieldName(INSURANCE_FIELDS.START_DATE)}
                  render={({ field }) => (
                    <DatePicker
                      date={field.value ? new Date(field.value as string) : undefined}
                      onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                      placeholder="Başlangıç Tarihi Seç"
                      format="dd.MM.yyyy"
                    />
                  )}
                />
                <DateButtons fieldName={INSURANCE_FIELDS.START_DATE} label="Başlangıç Tarihi" />
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Bitiş Tarihi *</label>
                <Controller
                  control={control}
                  name={getFieldName(INSURANCE_FIELDS.END_DATE)}
                  render={({ field }) => (
                    <DatePicker
                      date={field.value ? new Date(field.value as string) : undefined}
                      onChange={(date) => field.onChange(date?.toISOString().split('T')[0])}
                      placeholder="Bitiş Tarihi Seç"
                      format="dd.MM.yyyy"
                    />
                  )}
                />
                <DateButtons fieldName={INSURANCE_FIELDS.END_DATE} label="Bitiş Tarihi" />
              </div>
            </div>
            <FormSelectField
              control={control}
              name={getFieldName(INSURANCE_FIELDS.INSURANCE_COMPANY_ID)}
              label="Sigorta Şirketi"
              options={lookups.insuranceCompanies}
            />
            <FormSelectField
              control={control}
              name={getFieldName(INSURANCE_FIELDS.AGENCY_ID)}
              label="Acenta"
              options={lookups.agencies}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              control={control}
              name={getFieldName(INSURANCE_FIELDS.POLICY_NUMBER)}
              label="Poliçe No"
            />
            <FormInput
              control={control}
              name={getFieldName(INSURANCE_FIELDS.TRAMER)}
              label="Tramer"
            />
            <FormInput
              control={control}
              name={getFieldName(INSURANCE_FIELDS.AGENCY_NUMBER)}
              label="Acenta No"
            />
            <div className="col-span-2">
              <FormInput
                control={control}
                name={getFieldName(INSURANCE_FIELDS.DESCRIPTION)}
                label="Açıklama"
                type="text"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="payment" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              control={control}
              name={getFieldName(INSURANCE_FIELDS.AMOUNT)}
              label="Tutar"
              type="number"
              step="0.01"
            />
            <FormInput
              control={control}
              name={getFieldName(INSURANCE_FIELDS.TAX_RATE)}
              label="Vergi Oranı (%)"
              type="number"
              step="0.01"
            />
            <FormInput
              control={control}
              name={getFieldName(INSURANCE_FIELDS.TAX_AMOUNT)}
              label="Vergi Tutarı"
              type="number"
              step="0.01"
            />
            <FormInput
              control={control}
              name={getFieldName(INSURANCE_FIELDS.TOTAL_AMOUNT)}
              label="Toplam Tutar"
              type="number"
              step="0.01"
            />
            <FormSelectField
              control={control}
              name={getFieldName(INSURANCE_FIELDS.CURRENCY_ID)}
              label="Para Birimi"
              options={lookups.currencies}
            />
            <FormInput
              control={control}
              name={getFieldName(INSURANCE_FIELDS.INSTALLMENT_COUNT)}
              label="Taksit Sayısı"
              type="number"
            />
            <FormSelectField
              control={control}
              name={getFieldName(INSURANCE_FIELDS.PAYMENT_TYPE)}
              label="Ödeme Türü"
              options={lookups.paymentTypes}
            />
            <FormSelectField
              control={control}
              name={getFieldName(INSURANCE_FIELDS.PAYMENT_ACCOUNT)}
              label="Ödeme Hesabı"
              options={lookups.paymentAccounts}
            />
            <div className="col-span-2 flex items-center gap-2">
              <input 
                type="checkbox"
                id={`create_payment_record_${index}`}
                {...control.register(getFieldName(INSURANCE_FIELDS.CREATE_PAYMENT))}
              />
              <label htmlFor={`create_payment_record_${index}`}>Ödeme Kaydı Oluştur</label>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
}
