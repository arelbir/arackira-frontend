/**
 * Araç modülü merkezi veri dönüşüm katmanı
 * API'dan gelen verileri frontend form ve gösterim formatına dönüştürür
 * Frontend form verilerini API gönderim formatına dönüştürür
 */

import { formatDateForForm, formatDateForAPI } from '@/lib/date-utils';
import { VehicleCreateValues } from '../create/create-tabs/schema';
import { mapApiDataToFormValues } from './form-helpers';

/**
 * Ortak dönüşüm yardımcı fonksiyonları
 */
const toSafeNumber = (value: any): number | undefined => {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  const num = Number(value);
  return isNaN(num) ? undefined : num;
};

const toBooleanFromAPI = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return Boolean(value);
};

const toBooleanForAPI = (value: any): boolean => {
  return Boolean(value);
};

// GPS özel dönüşümü için, eğer string 'true'/'false' ise boolean'a çevir
const transformGpsStatusToForm = (value: any): string => {
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return String(value);
};

const transformGpsStatusToAPI = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return Boolean(value);
};

/**
 * API yanıtından dönüştürülen sigorta veri tipi (Frontend Form Tipi)
 */
export interface TransformedInsurance {
  id?: number;
  vehicle_id?: number;
  insurance_type_id: number;
  insurance_company_id: number;
  policy_number: string;
  tramer?: string;
  start_date?: string; // Formatted date string
  end_date?: string; // Formatted date string
  total_amount?: string; // Stored as string for currency
  currency_id?: string;
  description?: string;
  created_at?: string;
}

/**
 * API yanıtından dönüştürülen muayene veri tipi (Frontend Form Tipi)
 */
export interface TransformedInspection {
  id?: number;
  vehicle_id?: number;
  inspection_date?: string; // Formatted date string
  expiry_date?: string; // Formatted date string
  inspection_company_id?: number;
  inspection_company_name?: string;
  result?: string;
  description?: string;
  cost?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * API yanıtından dönüştürülen UTTS veri tipi (Frontend Form Tipi)
 */
export interface TransformedUtts {
  id?: number;
  vehicle_id?: number;
  purchase_date?: string; // Formatted date string
  installation_date?: string; // Formatted date string
  utts_code?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * API yanıtından dönüştürülen HGS veri tipi (Frontend Form Tipi)
 */
export interface TransformedHgs {
  id?: number;
  vehicle_id?: number;
  hgs_place?: string;
  hgs_tag_no?: string;
  hgs_vehicle_class?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * API yanıtından dönüştürülen GPS veri tipi (Frontend Form Tipi)
 */
export interface TransformedGps {
  id?: number;
  vehicle_id?: number;
  gps_tracking_status?: string; // Could be 'true'/'false' string or boolean
  brand?: string;
  device_model?: string;
  installation_date?: string; // Formatted date string
  sim_number?: string;
  device_serial_number?: string;
  service_provider?: string;
  subscription_start?: string; // Formatted date string
  subscription_end?: string; // Formatted date string
  installation_location?: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * API yanıtından dönüştürülen servis veri tipi (Frontend Form Tipi)
 */
export interface TransformedService {
  id?: number;
  vehicle_id?: number;
  service_date?: string;
  description?: string;
  cost?: string;
  currency_id?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Dönüştürülen ilişkili modül verileri tipi
 */
export interface TransformedIncludedData {
  insurances: TransformedInsurance[];
  inspections: TransformedInspection[];
  utts: TransformedUtts[];
  hgs: TransformedHgs[];
  gps: TransformedGps[];
  services: TransformedService[];
}

/**
 * API yanıtından dönüştürülen tüm veriler tipi
 */
export interface TransformedAPIResponse {
  vehicleData: Partial<VehicleCreateValues>;
  included: TransformedIncludedData;
}

/**
 * API'den gelen veriler için arayüzler (API'nin ham formatını temsil eder)
 * Not: Bu arayüzler, API'nin gerçek dönüş tiplerine göre ayarlanmalıdır.
 * Varsayılan olarak, form tiplerine benzer ancak tarih ve boolean gibi alanlar ham olabilir.
 */
interface ApiInsurance {
  id?: number;
  vehicle_id?: number;
  insurance_type_id: string | number;
  insurance_company_id: string | number;
  policy_number: string;
  tramer?: string;
  start_date?: string; // Raw date string from API
  end_date?: string; // Raw date string from API
  total_amount?: string | number;
  currency?: string; // API might use 'currency'
  description?: string;
  created_at?: string;
}

interface ApiInspection {
  id?: number;
  vehicle_id?: number;
  inspection_date?: string;
  expiry_date?: string;
  inspection_company_id?: number;
  inspection_company_name?: string;
  result?: string;
  description?: string;
  cost?: string | number; // Raw cost from API
  created_at?: string;
  updated_at?: string;
}

interface ApiUtts {
  id?: number;
  vehicle_id?: number;
  purchase_date?: string; // Raw date string from API
  installation_date?: string; // Raw date string from API
  utts_code?: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiHgs {
  id?: number;
  vehicle_id?: number;
  hgs_place?: string;
  hgs_tag_no?: string;
  hgs_vehicle_class?: string;
  is_active?: boolean | string; // API might send as string 'true'/'false'
  created_at?: string;
  updated_at?: string;
}

interface ApiGps {
  id?: number;
  vehicle_id?: number;
  gps_tracking_status?: string | boolean; // API might send as string or boolean
  brand?: string;
  device_model?: string;
  installation_date?: string; // Raw date string from API
  sim_number?: string;
  device_serial_number?: string;
  service_provider?: string;
  subscription_start?: string; // Raw date string from API
  subscription_end?: string; // Raw date string from API
  installation_location?: string;
  description?: string;
  is_active?: boolean | string; // API might send as string 'true'/'false'
  created_at?: string;
  updated_at?: string;
}

interface ApiService {
  id?: number;
  vehicle_id?: number;
  service_date?: string; // Raw date string from API
  description?: string;
  cost?: string | number; // Raw cost from API
  currency_id?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Jenerik eşleyici oluşturucu fonksiyonu
 * @param config API alanları ile form alanları arasındaki eşleşmeleri ve dönüşüm mantığını tanımlayan konfigürasyon dizisi
 */
interface FieldMappingConfig<ApiType extends object, FormType extends object> {
  apiField: keyof ApiType;
  formField: keyof FormType;
  toForm?: (value: any) => any; // API'den forma dönüşüm fonksiyonu
  toAPI?: (value: any) => any; // Formdan API'ye dönüşüm fonksiyonu
}

function createMapper<ApiType extends object, FormType extends object>(
  config: FieldMappingConfig<ApiType, FormType>[]
) {
  const mapToForm = (apiData: ApiType): FormType => {
    const formData: Partial<FormType> = {};
    config.forEach(({ apiField, formField, toForm }) => {
      const value = apiData[apiField];
      (formData as any)[formField] = toForm ? toForm(value) : value;
    });
    return formData as FormType;
  };

  const mapToAPI = (formData: FormType): ApiType => {
    const apiData: Partial<ApiType> = {};
    config.forEach(({ apiField, formField, toAPI }) => {
      const value = formData[formField];
      (apiData as any)[apiField] = toAPI ? toAPI(value) : value;
    });
    return apiData as ApiType;
  };

  return { mapToForm, mapToAPI };
}

/**
 * Modül bazında eşleme konfigürasyonları
 */

// Sigorta Eşleme Konfigürasyonu
const insuranceMappingConfig: FieldMappingConfig<ApiInsurance, TransformedInsurance>[] = [
  { apiField: 'id', formField: 'id' },
  { apiField: 'vehicle_id', formField: 'vehicle_id' },
  { apiField: 'insurance_type_id', formField: 'insurance_type_id', toForm: toSafeNumber, toAPI: String },
  { apiField: 'insurance_company_id', formField: 'insurance_company_id', toForm: toSafeNumber, toAPI: String },
  { apiField: 'policy_number', formField: 'policy_number' },
  { apiField: 'tramer', formField: 'tramer' },
  { apiField: 'start_date', formField: 'start_date', toForm: formatDateForForm, toAPI: formatDateForAPI },
  { apiField: 'end_date', formField: 'end_date', toForm: formatDateForForm, toAPI: formatDateForAPI },
  { apiField: 'total_amount', formField: 'total_amount', toForm: String, toAPI: String }, // Keep as string for currency
  { apiField: 'currency', formField: 'currency_id', toForm: (val) => val, toAPI: (val) => val }, // Map currency to currency_id and vice-versa
  { apiField: 'description', formField: 'description' },
  { apiField: 'created_at', formField: 'created_at' },
];
const { mapToForm: mapInsurances, mapToAPI: mapInsurancesToAPI } = createMapper(insuranceMappingConfig);

// Muayene Eşleme Konfigürasyonu
const inspectionMappingConfig: FieldMappingConfig<ApiInspection, TransformedInspection>[] = [
  { apiField: 'id', formField: 'id' },
  { apiField: 'vehicle_id', formField: 'vehicle_id' },
  { apiField: 'inspection_date', formField: 'inspection_date', toForm: formatDateForForm, toAPI: formatDateForAPI },
  { apiField: 'expiry_date', formField: 'expiry_date', toForm: formatDateForForm, toAPI: formatDateForAPI },
  { apiField: 'inspection_company_id', formField: 'inspection_company_id' },
  { apiField: 'inspection_company_name', formField: 'inspection_company_name' },
  { apiField: 'result', formField: 'result' },
  { apiField: 'description', formField: 'description' },
  { apiField: 'cost', formField: 'cost', toForm: toSafeNumber, toAPI: String },
  { apiField: 'created_at', formField: 'created_at' },
  { apiField: 'updated_at', formField: 'updated_at' },
];
const { mapToForm: mapInspections, mapToAPI: mapInspectionsToAPI } = createMapper(inspectionMappingConfig);

// UTTS Eşleme Konfigürasyonu
const uttsMappingConfig: FieldMappingConfig<ApiUtts, TransformedUtts>[] = [
  { apiField: 'id', formField: 'id' },
  { apiField: 'vehicle_id', formField: 'vehicle_id' },
  { apiField: 'purchase_date', formField: 'purchase_date', toForm: formatDateForForm, toAPI: formatDateForAPI },
  { apiField: 'installation_date', formField: 'installation_date', toForm: formatDateForForm, toAPI: formatDateForAPI },
  { apiField: 'utts_code', formField: 'utts_code' },
  { apiField: 'created_at', formField: 'created_at' },
  { apiField: 'updated_at', formField: 'updated_at' },
];
const { mapToForm: mapUtts, mapToAPI: mapUttsToAPI } = createMapper(uttsMappingConfig);

// HGS Eşleme Konfigürasyonu
const hgsMappingConfig: FieldMappingConfig<ApiHgs, TransformedHgs>[] = [
  { apiField: 'id', formField: 'id' },
  { apiField: 'vehicle_id', formField: 'vehicle_id' },
  { apiField: 'hgs_place', formField: 'hgs_place' },
  { apiField: 'hgs_tag_no', formField: 'hgs_tag_no' },
  { apiField: 'hgs_vehicle_class', formField: 'hgs_vehicle_class' },
  { apiField: 'is_active', formField: 'is_active', toForm: toBooleanFromAPI, toAPI: toBooleanForAPI },
  { apiField: 'created_at', formField: 'created_at' },
  { apiField: 'updated_at', formField: 'updated_at' },
];
const { mapToForm: mapHgs, mapToAPI: mapHgsToAPI } = createMapper(hgsMappingConfig);

// GPS Eşleme Konfigürasyonu
const gpsMappingConfig: FieldMappingConfig<ApiGps, TransformedGps>[] = [
  { apiField: 'id', formField: 'id' },
  { apiField: 'vehicle_id', formField: 'vehicle_id' },
  { apiField: 'gps_tracking_status', formField: 'gps_tracking_status', toForm: transformGpsStatusToForm, toAPI: transformGpsStatusToAPI },
  { apiField: 'brand', formField: 'brand' },
  { apiField: 'device_model', formField: 'device_model' },
  { apiField: 'installation_date', formField: 'installation_date', toForm: formatDateForForm, toAPI: formatDateForAPI },
  { apiField: 'sim_number', formField: 'sim_number' },
  { apiField: 'device_serial_number', formField: 'device_serial_number' },
  { apiField: 'service_provider', formField: 'service_provider' },
  { apiField: 'subscription_start', formField: 'subscription_start', toForm: formatDateForForm, toAPI: formatDateForAPI },
  { apiField: 'subscription_end', formField: 'subscription_end', toForm: formatDateForForm, toAPI: formatDateForAPI },
  { apiField: 'installation_location', formField: 'installation_location' },
  { apiField: 'description', formField: 'description' },
  { apiField: 'is_active', formField: 'is_active', toForm: toBooleanFromAPI, toAPI: toBooleanForAPI },
  { apiField: 'created_at', formField: 'created_at' },
  { apiField: 'updated_at', formField: 'updated_at' },
];
const { mapToForm: mapGps, mapToAPI: mapGpsToAPI } = createMapper(gpsMappingConfig);

// Servis Eşleme Konfigürasyonu
const serviceMappingConfig: FieldMappingConfig<ApiService, TransformedService>[] = [
  { apiField: 'id', formField: 'id' },
  { apiField: 'vehicle_id', formField: 'vehicle_id' },
  { apiField: 'service_date', formField: 'service_date', toForm: formatDateForForm, toAPI: formatDateForAPI },
  { apiField: 'description', formField: 'description' },
  { apiField: 'cost', formField: 'cost', toForm: String, toAPI: String }, // Keep as string for currency
  { apiField: 'currency_id', formField: 'currency_id' },
  { apiField: 'created_at', formField: 'created_at' },
  { apiField: 'updated_at', formField: 'updated_at' },
];
const { mapToForm: mapServices, mapToAPI: mapServicesToAPI } = createMapper(serviceMappingConfig);


/**
 * `/api/vehicles/[id]/complete` API yanıtını frontend'de kullanılabilir formata dönüştürür
 * Ana araç verileri ve ilişkili alt modülleri (sigorta, muayene, UTTS, HGS, GPS, Servis) işler
 * @param response API yanıtı
 * @returns Frontend için dönüştürülmüş veriler
 */
export const transformAPIResponse = (response: any): TransformedAPIResponse => {
  if (!response) {
    console.warn("API yanıtı boş veya tanımsız. Varsayılan boş değerler döndürülüyor.");
    return {
      vehicleData: {},
      included: {
        insurances: [],
        inspections: [],
        utts: [],
        hgs: [],
        gps: [],
        services: []
      }
    };
  }

  const { data, included } = response;

  // Ana araç verilerini dönüştür
  const vehicleData = mapApiDataToFormValues(data);

  // İlişkili verileri dönüştür
  const transformedIncluded: TransformedIncludedData = {
    insurances: Array.isArray(included?.insurances) ? included.insurances.map(mapInsurances) : [],
    inspections: Array.isArray(included?.inspections) ? included.inspections.map(mapInspections) : [],
    utts: Array.isArray(included?.utts) ? included.utts.map(mapUtts) : [],
    hgs: Array.isArray(included?.hgs) ? included.hgs.map(mapHgs) : [],
    gps: Array.isArray(included?.gps) ? included.gps.map(mapGps) : [],
    services: Array.isArray(included?.services) ? included.services.map(mapServices) : []
  };

  return { vehicleData, included: transformedIncluded };
};

/**
 * Form değerlerini API formatına dönüştürür (gönderim öncesi)
 * @param formValues Ana araç formu değerleri
 * @param relatedModules İlişkili modül verileri (sigorta, muayene vb.)
 * @returns API için dönüştürülmüş veriler
 */
export const transformFormToAPI = (formValues: any, relatedModules: any) => {
  // Tarih alanlarını API formatına dönüştür
  const apiData = {
    ...formValues,
    invoice_date: formatDateForAPI(formValues.invoice_date)
  };

  // İlişkili modül verilerini API formatına dönüştür
  const apiRelatedModules = {
    insurances: Array.isArray(relatedModules.insurances) ? relatedModules.insurances.map(mapInsurancesToAPI) : [],
    inspections: Array.isArray(relatedModules.inspections) ? relatedModules.inspections.map(mapInspectionsToAPI) : [],
    utts: Array.isArray(relatedModules.utts) ? relatedModules.utts.map(mapUttsToAPI) : [],
    hgs: Array.isArray(relatedModules.hgs) ? relatedModules.hgs.map(mapHgsToAPI) : [],
    gps: Array.isArray(relatedModules.gps) ? relatedModules.gps.map(mapGpsToAPI) : [],
    services: Array.isArray(relatedModules.services) ? relatedModules.services.map(mapServicesToAPI) : [],
  };

  return { data: apiData, included: apiRelatedModules };
};

/**
 * Context'teki GPS verilerini forma uygun hale getirir.
 * Özellikle string 'true'/'false' değerlerini boolean'a çevirir.
 * @param gps Context'ten gelen GPS verileri
 * @returns Frontend form formatına dönüştürülmüş GPS verileri
 */
export const transformGpsDataForForm = (gps: TransformedGps[] | undefined): any[] => {
  if (!gps) return [];
  return gps.map(gpsItem => ({
    ...gpsItem,
    // gps_tracking_status zaten mapGps içinde dönüştürüldüğü için burada tekrar dönüştürmeye gerek yok.
    // Ancak, eğer bu fonksiyon doğrudan API'den gelen ham veriyi alıyorsa, bu dönüşüm burada kalmalı.
    // Mevcut durumda, TransformedGps[] aldığı için gps_tracking_status zaten string olmalı.
    gps_tracking_status: gpsItem.gps_tracking_status,
    is_active: toBooleanFromAPI(gpsItem.is_active), // toBooleanFromAPI kullanıldı
    // Tarih alanlarının zaten doğru formatta olduğu varsayılır (mapGps tarafından)
  }));
};
