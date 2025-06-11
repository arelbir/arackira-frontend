import { VehicleFormValues } from "../vehicle-schema";

/**
 * Form değerlerini backend'e göndermek için hazırlar
 */
export function preparePayloadForSave(data: VehicleFormValues, isDraft: boolean = false) {
  // Veriyi kopyala
  const result: any = { ...data, is_draft: isDraft };
  
  // İlişkisel (foreign key) alanları
  const dropdownFields = [
    'branch_id', 'vehicle_type_id', 'brand_id', 'model_id', 'vehicle_status_id',
    'vehicle_group_id', 'fuel_type_id', 'transmission_id', 'color_id',
    'vehicle_responsible_id', 'current_client_company_id'
  ];
  
  // Tüm alanları işle
  Object.keys(result).forEach(key => {
    // Boş string ve undefined değerleri null yap
    if (result[key] === '' || result[key] === undefined) {
      result[key] = null;
    }
    
    // İlişkisel alanları sayıya dönüştür
    if (dropdownFields.includes(key) && result[key] !== null) {
      const num = Number(result[key]);
      result[key] = isNaN(num) ? null : num;
    }
  });
  
  // Zorunlu alanları kontrol et ve varsayılan değerler ata
  // Not: vehicle_status_id database constraint olduğu için her zaman dolu olmalı
  if (!result.vehicle_status_id) {
    result.vehicle_status_id = 1; // Varsayılan araç durumu: Aktif
  }
  
  // Eğer taslak ise, sadece temel kontroller yap
  if (isDraft) {
    // Taslak için sadece temel alanlar kontrol edilir
    return result;
  }
  
  // Taslak değilse, gerekli diğer alanları da kontrol et
  // Bu noktada daha fazla zorunlu alan eklenebilir
  
  return result;
}
