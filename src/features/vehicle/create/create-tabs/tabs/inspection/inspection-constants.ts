"use client";

// Field names constant for consistent naming
export const INSPECTION_FIELDS = {
  BASE: "inspections",
  INSPECTION_DATE: "inspection_date",
  EXPIRY_DATE: "expiry_date",
  INSPECTION_COMPANY_ID: "inspection_company_id",
  RESULT: "result",
  COST: "cost",
  DESCRIPTION: "description",
};

// UI messages
export const INSPECTION_MESSAGES = {
  SUCCESS: "Muayene kaydı başarıyla kaydedildi",
  ERROR: "Muayene kaydı oluşturulurken bir hata oluştu",
  NEW: "Yeni Muayene Kaydı",
  EDIT: "Muayene Kaydını Düzenle",
  DELETE_SUCCESS: "Muayene kaydı başarıyla silindi",
  DELETE_CONFIRM_TITLE: "Muayeneyi Sil",
  DELETE_CONFIRM_DESCRIPTION: "Bu muayene kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
};

// Lookup data types
export interface InspectionLookupData {
  // Add any lookup types if needed in the future, e.g., inspection stations
}

// Inspection record interface
export interface Inspection {
  id?: string;
  [INSPECTION_FIELDS.INSPECTION_DATE]?: string;
  [INSPECTION_FIELDS.EXPIRY_DATE]?: string;
  inspection_company_id?: number;
  inspection_company_name?: string; // Bu alan API'den gelir, formda doğrudan kullanılmaz ama tabloda gösterilebilir
  [INSPECTION_FIELDS.RESULT]?: string;
  [INSPECTION_FIELDS.COST]?: number;
  [INSPECTION_FIELDS.DESCRIPTION]?: string;
}

// Type for the form data
export type InspectionFormData = Inspection;

// Status calculation for inspection expiry
export interface InspectionStatus {
  status: "expired" | "warning" | "active" | "inactive";
  label: string;
}

export const getInspectionStatus = (expiryDate: string): InspectionStatus => {
  if (!expiryDate) return { status: "inactive", label: "Belirsiz" };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(expiryDate);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { status: "expired", label: "Süresi Doldu" };
  } else if (diffDays <= 30) {
    return { status: "warning", label: `${diffDays} gün kaldı` };
  } else {
    return { status: "active", label: "Geçerli" };
  }
};
