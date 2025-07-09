/**
 * Araç formu yardımcı fonksiyonları
 */
import { VehicleCreateValues, vehicleCreateSchema } from '../../vehicle/create/create-tabs/schema';
import { ValidationResult } from '../types/vehicle-form-context.types';
import { REQUIRED_FIELDS } from './validation-constants';

/**
 * API'dan gelen verileri form şemasına uygun hale getiren yardımcı fonksiyon
 * @param apiData - API'dan gelen veri objesi
 * @returns Form şemasına uygun dönüştürülmüş veriler
 */
export const mapApiDataToFormValues = (apiData: any): Partial<VehicleCreateValues> => {
  // Schema ile uyumlu sadece geçerli alanları al
  const formValues: Partial<VehicleCreateValues> = {};
  
  // Numerik ID alanlarını sayı olarak dönüştür
  const numericFields = [
    'branch_id', 'vehicle_group_id', 'vehicle_type_id', 'brand_id', 
    'model_id', 'model_year', 'fuel_type_id', 'transmission_id', 
    'vehicle_status_id', 'color_id', 'vehicle_responsible_id', 
    'vehicle_km', 'supplier_id'
  ];
  
  // Schema'da tanımlı tüm alanlar için dönüşüm
  Object.keys(vehicleCreateSchema.shape).forEach(key => {
    if (key in apiData) {
      const typedKey = key as keyof VehicleCreateValues;
      if (numericFields.includes(key) && apiData[key] !== null && apiData[key] !== '') {
        // Sayısal alan ve değer varsa Number'a dönüştür
        formValues[typedKey] = Number(apiData[key]) as any;
      } else {
        // Diğer türdeki değerleri olduğu gibi al
        formValues[typedKey] = apiData[key] as any;
      }
    }
  });
  
  return formValues;
};

/**
 * Tarih alanlarındaki boş stringleri null'a çeviren yardımcı fonksiyon
 * @param obj - Dönüştürülecek nesne
 * @returns Dönüştürülmüş nesne
 */
export const convertEmptyDatesToNull = (obj: Record<string, any>): Record<string, any> => {
  // Tarih alanları için kontrol edilecek patternler
  const dateFieldPatterns = [
    /_date$/,       // *_date ile biten alanlar
    /Date$/,        // *Date ile biten alanlar
    /^date/         // date* ile başlayan alanlar
  ];
  
  // Dönüştürülmüş nesneyi oluştur
  const result: Record<string, any> = {};
  
  // Her alan için kontrol et
  for (const [key, value] of Object.entries(obj)) {
    // Nesne içinde nesne varsa recursive işlem yap
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = convertEmptyDatesToNull(value);
    } 
    // Tarih alanı ve boş string kontrolü
    else if (
      dateFieldPatterns.some(pattern => pattern.test(key)) && 
      (value === '' || value === undefined)
    ) {
      result[key] = null;
    } 
    // Diğer alanları olduğu gibi kopyala
    else {
      result[key] = value;
    }
  }
  
  return result;
};

/**
 * Zorunlu alanların varlığını kontrol eden yardımcı fonksiyon
 * @param formValues - Form değerleri
 * @param modulesData - İlişkili modül verileri
 * @returns Validasyon sonucu ve hata mesajları
 */
export const validateRequiredFields = (
  formValues: Partial<VehicleCreateValues>,
  modulesData: {
    inspections: any[];
    utts: any[];
    hgs: any[];
    services: any[];
  }
): ValidationResult => {
  const errors: Record<string, string[]> = {};
  let valid = true;
  
  // Araç için zorunlu alan kontrolü
  REQUIRED_FIELDS.vehicle.forEach(field => {
    if (!formValues[field as keyof VehicleCreateValues]) {
      if (!errors.vehicle) errors.vehicle = [];
      errors.vehicle.push(`${field} alanı zorunludur`);
      valid = false;
    }
  });
  
  const { inspections, utts, hgs, services } = modulesData;
  
  // İnspection için zorunlu alan kontrolü (varsa)
  if (inspections.length > 0) {
    inspections.forEach((inspection, index) => {
      REQUIRED_FIELDS.inspections.forEach(field => {
        if (!inspection[field]) {
          if (!errors.inspections) errors.inspections = [];
          errors.inspections.push(`Muayene #${index + 1}: ${field} alanı zorunludur`);
          valid = false;
        }
      });
    });
  }
  
  // UTTS için zorunlu alan kontrolü (varsa)
  if (utts.length > 0) {
    utts.forEach((utt, index) => {
      REQUIRED_FIELDS.utts.forEach(field => {
        if (!utt[field]) {
          if (!errors.utts) errors.utts = [];
          errors.utts.push(`UTTS #${index + 1}: ${field} alanı zorunludur`);
          valid = false;
        }
      });
    });
  }
  
  // HGS için zorunlu alan kontrolü (varsa)
  if (hgs.length > 0) {
    hgs.forEach((hgsItem, index) => {
      REQUIRED_FIELDS.hgs.forEach(field => {
        if (!hgsItem[field]) {
          if (!errors.hgs) errors.hgs = [];
          errors.hgs.push(`HGS #${index + 1}: ${field} alanı zorunludur`);
          valid = false;
        }
      });
    });
  }
  
  // Services için zorunlu alan kontrolü (varsa)
  if (services.length > 0) {
    services.forEach((service, index) => {
      REQUIRED_FIELDS.services.forEach(field => {
        if (!service[field] && service[field] !== null) { // vat_group_id null olabilir
          if (!errors.services) errors.services = [];
          errors.services.push(`Servis #${index + 1}: ${field} alanı zorunludur`);
          valid = false;
        }
      });
    });
  }
  
  return { valid, errors };
};
