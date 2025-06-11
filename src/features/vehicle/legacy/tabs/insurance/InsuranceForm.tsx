import React from 'react';
import { Controller, useForm } from "react-hook-form";
import FormInputField from "../../form/FormInputField";
import FormSelectField from "../../form/FormSelectField";
import FormDateField from "../../form/FormDateField";
import { InsuranceType, InsuranceCompany, Currency } from './utils/mappers';

// Form değerleri tipi
interface InsuranceFormValues {
  insurance_type_id: number | string | null;
  insurance_company_id: string | null;
  agency_id: string | null;
  policy_number: string;
  tramer: string | null;
  start_date: string | null;
  end_date: string | null;
  policy_date: string | null;
  agency_number: string | null;
  amount: string | null;
  tax_rate: string | null;
  tax_amount: string | null;
  total_amount: string | null;
  currency: string | null;
  installment_count: string | null;
  payment_type_id: string | null;
  payment_account_id: string | null;
  create_payment_record: boolean;
  description: string | null;
}

// Backend'e gönderilecek veri tipi
interface InsurancePayload {
  insurance_type_id: number | null;
  insurance_company_id: number | null;
  agency_id: number | null;
  policy_number: string;
  tramer: string | null;
  start_date: string | null;
  end_date: string | null;
  policy_date: string | null;
  agency_number: string | null;
  amount: number | null;
  tax_rate: number | null;
  tax_amount: number | null;
  total_amount: number | null;
  currency: string | null;
  installment_count: number | null;
  payment_type_id: number | null;
  payment_account_id: number | null;
  create_payment_record: boolean;
  description: string | null;
  vehicle_id: number;
}

interface InsuranceFormProps {
  vehicleId: number;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  insuranceTypes?: InsuranceType[];
  loadingInsuranceTypes?: boolean;
  insuranceCompanies?: InsuranceCompany[];
  loadingCompanies?: boolean;
  currencies?: Currency[];
  loadingCurrencies?: boolean;
}

/**
 * Poliçe ekleme formu bileşeni
 */
const InsuranceForm: React.FC<InsuranceFormProps> = ({
  vehicleId,
  onSubmit,
  onCancel,
  insuranceTypes = [],
  loadingInsuranceTypes = false,
  insuranceCompanies = [],
  loadingCompanies = false,
  currencies = [],
  loadingCurrencies = false,
}) => {
  // Form yönetimi
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InsuranceFormValues>({
    defaultValues: {
      insurance_type_id: 1,
      insurance_company_id: '',
      agency_id: '',
      policy_number: '',
      tramer: '',
      start_date: '',
      end_date: '',
      policy_date: '',
      agency_number: '',
      amount: '',
      tax_rate: '',
      tax_amount: '',
      total_amount: '',
      currency: '1',
      installment_count: '',
      payment_type_id: '',
      payment_account_id: '',
      create_payment_record: false,
      description: '',
    },
  });

  // Form gönderimi - backend formatına dönüştür
  const submitForm = async (data: InsuranceFormValues) => {
    try {
      // Form verilerini backend için hazırla
      const preparedData = {
        // Boş string kontrolü ile sayısal alanlara dönüştürme
        insurance_type_id: data.insurance_type_id && String(data.insurance_type_id).trim() !== "" 
          ? Number(data.insurance_type_id) 
          : null,
          
        insurance_company_id: data.insurance_company_id && String(data.insurance_company_id).trim() !== "" 
          ? Number(data.insurance_company_id) 
          : null,
          
        agency_id: data.agency_id && String(data.agency_id).trim() !== "" 
          ? Number(data.agency_id) 
          : null,
        
        // Metinsel alanlar
        policy_number: data.policy_number || "",
        tramer: data.tramer || null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        policy_date: data.policy_date || null,
        agency_number: data.agency_number || null,
        
        // Sayısal alanlar
        amount: data.amount && String(data.amount).trim() !== "" 
          ? Number(data.amount) 
          : null,
          
        tax_rate: data.tax_rate && String(data.tax_rate).trim() !== "" 
          ? Number(data.tax_rate) 
          : null,
          
        tax_amount: data.tax_amount && String(data.tax_amount).trim() !== "" 
          ? Number(data.tax_amount) 
          : null,
          
        total_amount: data.total_amount && String(data.total_amount).trim() !== "" 
          ? Number(data.total_amount) 
          : null,
          
        installment_count: data.installment_count && String(data.installment_count).trim() !== "" 
          ? Number(data.installment_count) 
          : null,
          
        payment_type_id: data.payment_type_id && String(data.payment_type_id).trim() !== "" 
          ? Number(data.payment_type_id) 
          : null,
          
        payment_account_id: data.payment_account_id && String(data.payment_account_id).trim() !== "" 
          ? Number(data.payment_account_id) 
          : null,
        
        // "undefined" değeri ile gönderme, null kullan
        currency: data.currency && data.currency !== "undefined" 
          ? data.currency 
          : null,
          
        // Boolean
        create_payment_record: Boolean(data.create_payment_record),
        
        // Diğer alanlar
        description: data.description || null,
      };
      
      // Form verisini gönder - vehicleId InsuranceTab tarafında eklenecek
      await onSubmit(preparedData);
    } catch (error) {
      console.error("Form gönderim hatası:", error);
    }
  };

  return (
    <div className="border p-4 rounded bg-card">
      {/* Form grupları */}
      <div className="mb-8">
        <h3 className="text-base font-medium mb-4 pb-2 border-b">Poliçe Genel Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Controller
            control={control}
            name="insurance_type_id"
            render={({ field }) => (
              <FormSelectField
                {...field}
                label="Poliçe Türü"
                options={
                  insuranceTypes?.map((type) => ({ value: type.id, label: type.name })) || []
                }
                error={errors.insurance_type_id}
                placeholder={loadingInsuranceTypes ? "Yükleniyor..." : "Seçiniz"}
                disabled={loadingInsuranceTypes}
              />
            )}
          />
          <Controller
            control={control}
            name="insurance_company_id"
            render={({ field }) => (
              <FormSelectField
                {...field}
                label="Sigorta Şirketi"
                options={
                  insuranceCompanies?.map((company) => ({ value: company.id, label: company.name })) || []
                }
                error={errors.insurance_company_id}
                placeholder={loadingCompanies ? "Yükleniyor..." : "Seçiniz"}
                disabled={loadingCompanies}
              />
            )}
          />
          <Controller
            control={control}
            name="policy_number"
            render={({ field }) => (
              <FormInputField
                {...field}
                label="Poliçe No"
                error={errors.policy_number}
                placeholder="Poliçe numarası"
              />
            )}
          />
          <Controller
            control={control}
            name="policy_date"
            render={({ field }) => (
              <FormDateField
                {...field}
                label="Poliçe Tarihi"
                error={errors.policy_date}
                placeholder="Poliçe tarihi"
              />
            )}
          />
          <Controller
            control={control}
            name="start_date"
            render={({ field }) => (
              <FormDateField
                {...field}
                label="Başlangıç Tarihi"
                error={errors.start_date}
                placeholder="Başlangıç"
              />
            )}
          />
          <Controller
            control={control}
            name="end_date"
            render={({ field }) => (
              <FormDateField
                {...field}
                label="Bitiş Tarihi"
                error={errors.end_date}
                placeholder="Bitiş"
              />
            )}
          />
        </div>
      </div>

      {/* Acente Bilgileri */}
      <div className="mb-8">
        <h3 className="text-base font-medium mb-4 pb-2 border-b">Acente Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Controller
            control={control}
            name="agency_id"
            render={({ field }) => (
              <FormSelectField
                {...field}
                label="Acente"
                options={[
                  { value: "1", label: "Merkez Acente" },
                  { value: "2", label: "İstanbul Acente" }
                ]}
                error={errors.agency_id}
                placeholder="Acente seçiniz"
              />
            )}
          />
          <Controller
            control={control}
            name="agency_number"
            render={({ field }) => (
              <FormInputField
                {...field}
                label="Acente Numarası"
                error={errors.agency_number}
                placeholder="Acente numarası"
              />
            )}
          />
        </div>
      </div>

      {/* Ödeme Bilgileri */}
      <div className="mb-8">
        <h3 className="text-base font-medium mb-4 pb-2 border-b">Ödeme Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Controller
            control={control}
            name="amount"
            render={({ field }) => (
              <FormInputField
                {...field}
                label="Tutar"
                type="number"
                error={errors.amount}
                placeholder="Tutar"
              />
            )}
          />
          <Controller
            control={control}
            name="tax_rate"
            render={({ field }) => (
              <FormInputField
                {...field}
                label="Vergi Oranı (%)"
                type="number"
                error={errors.tax_rate}
                placeholder="Vergi oranı"
              />
            )}
          />
          <Controller
            control={control}
            name="tax_amount"
            render={({ field }) => (
              <FormInputField
                {...field}
                label="Vergi Tutarı"
                type="number"
                error={errors.tax_amount}
                placeholder="Vergi tutarı"
              />
            )}
          />
          <Controller
            control={control}
            name="total_amount"
            render={({ field }) => (
              <FormInputField
                {...field}
                label="Toplam Tutar"
                type="number"
                error={errors.total_amount}
                placeholder="Toplam tutar"
              />
            )}
          />
          <Controller
            control={control}
            name="currency"
            render={({ field }) => (
              <FormSelectField
                {...field}
                label="Para Birimi"
                options={
                  currencies?.map((curr) => ({ value: String(curr.id), label: curr.code || curr.name })) || []
                }
                error={errors.currency}
                placeholder={loadingCurrencies ? "Yükleniyor..." : "Seçiniz"}
                disabled={loadingCurrencies}
              />
            )}
          />
        </div>
      </div>

      {/* Ödeme Detayları */}
      <div className="mb-8">
        <h3 className="text-base font-medium mb-4 pb-2 border-b">Ödeme Detayları</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Controller
            control={control}
            name="installment_count"
            render={({ field }) => (
              <FormInputField
                {...field}
                label="Taksit Sayısı"
                type="number"
                error={errors.installment_count}
                placeholder="Taksit sayısı"
              />
            )}
          />
          <Controller
            control={control}
            name="payment_type_id"
            render={({ field }) => (
              <FormSelectField
                {...field}
                label="Ödeme Tipi"
                options={[
                  { value: "1", label: "Nakit" },
                  { value: "2", label: "Kredi Kartı" },
                  { value: "3", label: "Havale/EFT" }
                ]}
                error={errors.payment_type_id}
                placeholder="Ödeme tipi seçiniz"
              />
            )}
          />
          <Controller
            control={control}
            name="payment_account_id"
            render={({ field }) => (
              <FormSelectField
                {...field}
                label="Ödeme Hesabı"
                options={[
                  { value: "1", label: "Ana Hesap" },
                  { value: "2", label: "Taşıt Hesabı" }
                ]}
                error={errors.payment_account_id}
                placeholder="Hesap seçiniz"
              />
            )}
          />
          <div className="flex items-center mt-2">
            <Controller
              control={control}
              name="create_payment_record"
              render={({ field: { onChange, value, ...field } }) => (
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    {...field}
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span>Ödeme Kaydı Oluştur</span>
                </label>
              )}
            />
          </div>
        </div>
      </div>

      {/* Diğer Bilgiler */}
      <div className="mb-8">
        <h3 className="text-base font-medium mb-4 pb-2 border-b">Diğer Bilgiler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Controller
            control={control}
            name="tramer"
            render={({ field }) => (
              <FormInputField
                {...field}
                label="Tramer"
                error={errors.tramer}
                placeholder="Tramer kaydı"
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <FormInputField
                {...field}
                label="Açıklama"
                error={errors.description}
                placeholder="Açıklama"
              />
            )}
          />
        </div>
      </div>

      {/* Form butonları */}
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
        <button
          type="button"
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90"
          onClick={handleSubmit(submitForm)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <button
          type="button"
          className="bg-muted text-foreground px-6 py-2 rounded hover:bg-muted/70"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          İptal
        </button>
      </div>
    </div>
  );
};

export default InsuranceForm;
