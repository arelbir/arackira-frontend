// InsuranceTab için sabitler ve yardımcı işlevler

// Field names constant - Tutarlı alan isimlendirmesi için
export const INSURANCE_FIELD = {
  BASE: "insurances",
  INSURANCE_TYPE_ID: "insurance_type_id",
  INSURANCE_COMPANY_ID: "insurance_company_id",
  AGENCY_ID: "agency_id",

  POLICY_NUMBER: "policy_number",
  POLICY_DATE: "policy_date",
  START_DATE: "start_date",
  END_DATE: "end_date",
  AMOUNT: "amount",
  TAX_RATE: "tax_rate", 
  TAX_AMOUNT: "tax_amount",
  TOTAL_AMOUNT: "total_amount",
  CURRENCY_ID: "currency_id",
  INSTALLMENT_COUNT: "installment_count",
  PAYMENT_TYPE: "payment_type_id",
  PAYMENT_ACCOUNT: "payment_account_id",
  CREATE_PAYMENT: "create_payment_record",
  DESCRIPTION: "description",
  TRAMER: "tramer",
  AGENCY_NUMBER: "agency_number"
};

// Form tutarlılığı için alanları tek bir yerde topla
export const INSURANCE_FIELDS = INSURANCE_FIELD;

// UI mesajları için sabitler
export const INSURANCE_MESSAGES = {
  SUCCESS: "Sigorta kaydı başarıyla kaydedildi",
  ERROR: "Sigorta kaydı oluşturulurken bir hata oluştu",
  NEW: "Yeni Sigorta Kaydı",
  EDIT: "Sigorta Kaydını Düzenle",
  DELETE: "Sigorta kaydı silindi",
  DELETE_CONFIRM: "Bu sigorta kaydını silmek istediğinizden emin misiniz?",
  RENEW: "Sigorta kaydı yenilendi",
};

// Lookup veri tipleri
export interface InsuranceLookupData {
  insuranceTypes: Array<{id: string, name: string}>;
  insuranceCompanies: Array<{id: string, name: string}>;
  agencies: Array<{id: string, name: string}>;
  currencies: Array<{id: string, name: string}>;
  paymentTypes: Array<{id: string, name: string}>;
  paymentAccounts: Array<{id: string, name: string}>;
}

// Sigorta formu için tip
export type InsuranceFormData = InsuranceRecord;

// Sigorta kaydı için interface
export interface InsuranceRecord {
  id?: string;
  [INSURANCE_FIELD.INSURANCE_TYPE_ID]?: string;
  [INSURANCE_FIELD.INSURANCE_COMPANY_ID]?: string;
  [INSURANCE_FIELD.AGENCY_ID]?: string;
  [INSURANCE_FIELD.POLICY_NUMBER]?: string;
  [INSURANCE_FIELD.POLICY_DATE]?: string;
  [INSURANCE_FIELD.START_DATE]?: string;
  [INSURANCE_FIELD.END_DATE]?: string;
  [INSURANCE_FIELD.AMOUNT]?: number;
  [INSURANCE_FIELD.TAX_RATE]?: number;
  [INSURANCE_FIELD.TAX_AMOUNT]?: number;
  [INSURANCE_FIELD.TOTAL_AMOUNT]?: number;
  [INSURANCE_FIELD.CURRENCY_ID]?: string;
  [INSURANCE_FIELD.INSTALLMENT_COUNT]?: number;
  [INSURANCE_FIELD.PAYMENT_TYPE]?: string;
  [INSURANCE_FIELD.PAYMENT_ACCOUNT]?: string;
  [INSURANCE_FIELD.CREATE_PAYMENT]?: boolean;
  [INSURANCE_FIELD.DESCRIPTION]?: string;
  [INSURANCE_FIELD.TRAMER]?: string;
  [INSURANCE_FIELD.AGENCY_NUMBER]?: string;
}

// Tarih işlemleri için yardımcı işlevler
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getDateAfter = (dateStr: string, months: number): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0];
};

// Sigorta bitiş tarihine göre durumu hesaplama
export interface InsuranceStatus {
  status: "expired" | "warning" | "active" | "inactive";
  label: string;
}

export const getInsuranceStatus = (endDate: string): InsuranceStatus => {
  if (!endDate) return { status: "inactive", label: "Belirsiz" };
  
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { status: "expired", label: "Süresi Doldu" };
  } else if (diffDays <= 30) {
    return { status: "warning", label: `${diffDays} gün kaldı` };
  } else {
    return { status: "active", label: "Aktif" };
  }
};
