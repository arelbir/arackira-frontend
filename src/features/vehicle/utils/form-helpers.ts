/**
 * Araç formu yardımcı fonksiyonları
 */
import { VehicleCreateValues, vehicleCreateSchema } from '../../vehicle/create/create-tabs/schema';
import { ValidationResult } from '../types/vehicle-form-context.types';
import { REQUIRED_FIELDS } from './validation-constants';
import { TransformedInspection, TransformedUtts, TransformedHgs, TransformedService } from './data-transformers'; // İlişkili modül tipleri eklendi

/**
 * API'dan gelen verileri form şemasına uygun hale getiren yardımcı fonksiyon
 * @param apiData - API'dan gelen veri objesi
 * @returns Form şemasına uygun dönüştürülmüş veriler
 */
export const mapApiDataToFormValues = (apiData: Record<string, any>): Partial<VehicleCreateValues> => {
  const formValues: Partial<VehicleCreateValues> = {};
  
  const numericFields = [
    'branch_id', 'vehicle_group_id', 'vehicle_type_id', 'brand_id', 
    'model_id', 'model_year', 'fuel_type_id', 'transmission_id', 
    'vehicle_status_id', 'color_id', 'vehicle_responsible_id', 
    'vehicle_km', 'supplier_id'
  ];
  
  Object.keys(vehicleCreateSchema.shape).forEach(key => {
    if (key in apiData) {
      const typedKey = key as keyof VehicleCreateValues;
      if (numericFields.includes(key) && apiData[key] !== null && apiData[key] !== '') {
        formValues[typedKey] = Number(apiData[key]) as any; // Number dönüşümü
      } else {
        formValues[typedKey] = apiData[key] as any; // Diğer türdeki değerleri olduğu gibi al
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
  const dateFieldPatterns = [
    /_date$/,
    /Date$/,
    /^date/
  ];
  
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = convertEmptyDatesToNull(value);
    } 
    else if (
      dateFieldPatterns.some(pattern => pattern.test(key)) && 
      (value === '' || value === undefined)
    ) {
      result[key] = null;
    } 
    else {
      result[key] = value;
    }
  }
  
  return result;
};

/**
 * ID alanlarını string'den number tipine dönüştüren utility fonksiyon
 * Bu fonksiyon, formdan alınan ve backend'e gönderilecek veriyi işler
 * * @param obj - Dönüştürülecek form verisi nesnesi
 * @returns ID alanları number tipine dönüştürülmüş nesne
 */
export const convertStringIdsToNumbers = (obj: Record<string, any>): Record<string, any> => {
  const idFieldPatterns = [
    /_id$/,
    /Id$/,
  ];

  const knownIdFields = [
    'brand_id', 'model_id', 'color_id', 'supplier_id', 'vehicle_type_id', 
    'fuel_type_id', 'branch_id', 'vehicle_status_id', 'transmission_id',
    'vehicle_responsible_id', 'vehicle_group_id'
  ];
  
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = convertStringIdsToNumbers(value);
    }
    else if (Array.isArray(value)) {
      result[key] = value.map(item => 
        typeof item === 'object' && item !== null 
          ? convertStringIdsToNumbers(item)
          : item
      );
    }
    else if (knownIdFields.includes(key) && value !== null && value !== undefined && value !== '') {
      const numValue = Number(value);
      result[key] = !isNaN(numValue) ? numValue : value;
    }
    else if (
      idFieldPatterns.some(pattern => pattern.test(key)) && 
      (typeof value === 'string' || typeof value === 'number') &&
      value !== '' && value !== null && value !== undefined &&
      !isNaN(Number(value))
    ) {
      result[key] = Number(value);
    }
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
    inspections: TransformedInspection[]; // Tip güncellendi
    utts: TransformedUtts[];             // Tip güncellendi
    hgs: TransformedHgs[];               // Tip güncellendi
    services: TransformedService[];      // Tip güncellendi
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
  
  // Muayene için zorunlu alan kontrolü (varsa)
  if (inspections.length > 0) {
    inspections.forEach((inspection, index) => {
      REQUIRED_FIELDS.inspections.forEach(field => {
        // inspection[field] null veya undefined ise hata ver
        if (inspection[field as keyof TransformedInspection] === null || inspection[field as keyof TransformedInspection] === undefined || inspection[field as keyof TransformedInspection] === '') {
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
        if (utt[field as keyof TransformedUtts] === null || utt[field as keyof TransformedUtts] === undefined || utt[field as keyof TransformedUtts] === '') {
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
        if (hgsItem[field as keyof TransformedHgs] === null || hgsItem[field as keyof TransformedHgs] === undefined || hgsItem[field as keyof TransformedHgs] === '') {
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
        // service[field] null veya undefined ise hata ver
        if (service[field as keyof TransformedService] === null || service[field as keyof TransformedService] === undefined || service[field as keyof TransformedService] === '') {
          if (!errors.services) errors.services = [];
          errors.services.push(`Servis #${index + 1}: ${field} alanı zorunludur`);
          valid = false;
        }
      });
    });
  }
  
  return { valid, errors };
};
