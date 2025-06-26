"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSelect, FormSelectField } from "@/components/ui/form-select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Calendar } from "lucide-react";
import { useEffect } from "react";

interface InsuranceFormProps {
  control: any;
  index: number;
  initialData?: any;
  lookups: {
    insuranceTypes: any[];
    insuranceCompanies: any[];
    agencies: any[];
    currencies: any[];
    paymentTypes: any[];
    paymentAccounts: any[];
  };
  onClose: () => void;
  onSave: () => void;
}

export function InsuranceForm({
  control,
  index,
  initialData,
  lookups,
  onClose,
  onSave
}: InsuranceFormProps) {
  // Form gönderildiğinde çağrılan fonksiyon
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };
  
  // Bu bileşenle ilgili sorunlar olduğu için useEffect'i deaktif edelim
  /* useEffect(() => {
    // Eğer initialData varsa ve düzenleme modundaysak
    if (initialData && initialData.insurance_type_id) {
      try {
        // Form validation hatalarını temizle
        if (control && typeof control.clearErrors === 'function') {
          control.clearErrors(`insurances.${index}`);
        }
      } catch (err) {
        console.error('Form hatalarını temizlerken sorun oluştu:', err);
      }
    }
    
    // Not: form değerlerinin ayarlanması artık parent bileşenden yapılıyor
  }, [control, index, initialData]); */

  // Bugünün tarihini döndüren yardımcı fonksiyon
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Belirli bir tarihten sonraki tarihi hesaplayan yardımcı fonksiyon
  const getDateAfter = (dateStr: string, months: number) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  };

  // Tarih alanları için hızlı butonlar
  const DateButtons = ({ fieldName, label }: { fieldName: string, label: string }) => {
    // React Hook Form'un register ile kaydedilmiş alanı doğrudan bulalım
    const handleDateChange = (newValue: string) => {
      // Form alanını doğrudan DOM üzerinden güncelle
      const inputElement = document.querySelector(
        `input[name="insurances.${index}.${fieldName}"]`
      ) as HTMLInputElement;
      
      if (inputElement) {
        // Input değerini güncelle
        inputElement.value = newValue;
        
        // Input için değişim olayını tetikle (React Hook Form otomatik yakalar)
        const event = new Event('input', { bubbles: true });
        inputElement.dispatchEvent(event);
        
        // Gerekirse blur olayını da tetikle
        const blurEvent = new Event('blur', { bubbles: true });
        inputElement.dispatchEvent(blurEvent);
      }
    };
    
    return (
      <div className="flex gap-1 text-xs mt-1">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="h-6 px-2 text-xs"
          onClick={() => handleDateChange(getCurrentDate())}
        >
          Bugün
        </Button>
        {fieldName === "end_date" && (
          <>
            <Button 
              type="button" 
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => {
                const startDateElement = document.querySelector(
                  `input[name="insurances.${index}.start_date"]`
                ) as HTMLInputElement;
                
                if (startDateElement && startDateElement.value) {
                  handleDateChange(getDateAfter(startDateElement.value, 12));
                }
              }}
            >
              +1 Yıl
            </Button>
            <Button 
              type="button" 
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => {
                const startDateElement = document.querySelector(
                  `input[name="insurances.${index}.start_date"]`
                ) as HTMLInputElement;
                
                if (startDateElement && startDateElement.value) {
                  handleDateChange(getDateAfter(startDateElement.value, 6));
                }
              }}
            >
              +6 Ay
            </Button>
          </>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 h-full overflow-auto w-full max-w-[1200px] mx-auto">
      <Tabs defaultValue="basic">
        <TabsList className="w-full">
          <TabsTrigger value="basic" className="flex-1">Temel Bilgiler</TabsTrigger>
          <TabsTrigger value="details" className="flex-1">Detaylar</TabsTrigger>
          <TabsTrigger value="payment" className="flex-1">Ödeme</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <FormSelectField
              control={control}
              name={`insurances.${index}.insurance_type_id`}
              label="Sigorta Türü *"
              options={lookups.insuranceTypes}
              required
            />
            <div>
              <FormInput
                control={control}
                name={`insurances.${index}.start_date`}
                label="Başlangıç Tarihi *"
                type="date"
                required
              />
              <DateButtons fieldName="start_date" label="Başlangıç Tarihi" />
            </div>
            <div>
              <FormInput
                control={control}
                name={`insurances.${index}.policy_date`}
                label="Poliçe Tarihi *"
                type="date"
                required
              />
              <DateButtons fieldName="policy_date" label="Poliçe Tarihi" />
            </div>
            <div>
              <FormInput
                control={control}
                name={`insurances.${index}.end_date`}
                label="Bitiş Tarihi *"
                type="date"
                required
              />
              <DateButtons fieldName="end_date" label="Bitiş Tarihi" />
            </div>
            <FormSelectField
              control={control}
              name={`insurances.${index}.insurance_company_id`}
              label="Sigorta Şirketi"
              options={lookups.insuranceCompanies}
            />
            <FormSelectField
              control={control}
              name={`insurances.${index}.agency_id`}
              label="Acenta"
              options={lookups.agencies}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              control={control}
              name={`insurances.${index}.policy_number`}
              label="Poliçe No"
            />
            <FormInput
              control={control}
              name={`insurances.${index}.tramer`}
              label="Tramer"
            />
            <FormInput
              control={control}
              name={`insurances.${index}.agency_number`}
              label="Acenta No"
            />
            <div className="col-span-2">
              <FormInput
                control={control}
                name={`insurances.${index}.description`}
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
              name={`insurances.${index}.amount`}
              label="Tutar"
              type="number"
              step="0.01"
            />
            <FormInput
              control={control}
              name={`insurances.${index}.tax_rate`}
              label="Vergi Oranı (%)"
              type="number"
              step="0.01"
            />
            <FormInput
              control={control}
              name={`insurances.${index}.tax_amount`}
              label="Vergi Tutarı"
              type="number"
              step="0.01"
            />
            <FormInput
              control={control}
              name={`insurances.${index}.total_amount`}
              label="Toplam Tutar"
              type="number"
              step="0.01"
            />
            <FormSelectField
              control={control}
              name={`insurances.${index}.currency`}
              label="Para Birimi"
              options={lookups.currencies}
            />
            <FormInput
              control={control}
              name={`insurances.${index}.installment_count`}
              label="Taksit Sayısı"
              type="number"
            />
            <FormSelectField
              control={control}
              name={`insurances.${index}.payment_type_id`}
              label="Ödeme Türü"
              options={lookups.paymentTypes}
            />
            <FormSelectField
              control={control}
              name={`insurances.${index}.payment_account_id`}
              label="Ödeme Hesabı"
              options={lookups.paymentAccounts}
            />
            <div className="col-span-2 flex items-center gap-2">
              <input 
                type="checkbox" 
                {...control.register(`insurances.${index}.create_payment_record`)} 
                id={`create_payment_record_${index}`} 
              />
              <label htmlFor={`create_payment_record_${index}`}>Ödeme Kaydı Oluştur</label>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Form alt butonları header'a taşındı */}
    </form>
  );
}
