/**
 * Araç modülü merkezi veri dönüşüm katmanı (Zod tabanlı)
 * Bu dosya, API ve form arasındaki veri dönüşümlerini yönetir.
 * Zod şemalarını tek doğruluk kaynağı olarak kullanarak manuel eşleştirmeyi ortadan kaldırır.
 */

import { vehicleApiResponseSchema, VehicleFormValues } from '../schemas/vehicle.schemas';

/**
 * API'dan gelen veriyi Zod şeması ile parse ederek forma uygun hale getirir.
 * Bu fonksiyon, Zod'un `coerce` yeteneklerini kullanarak string'leri otomatik olarak
 * Date, number gibi doğru tiplere dönüştürür.
 * @param apiData - API'dan gelen ham veri.
 * @returns Forma `reset` ile basılabilecek, tipleri düzgün `VehicleFormValues` nesnesi.
 */
export const parseApiDataToFormValues = (apiData: any): Partial<VehicleFormValues> => {
  try {
    const parsed = vehicleApiResponseSchema.parse(apiData);
    // Zod şeması, tüm tipleri (string -> Date, string -> number) zaten dönüştürdü.
    // Şimdi sadece `data` ve `included` alanlarını formun beklediği düz yapıya getiriyoruz.
    return {
      ...parsed.data,
      ...(parsed.included || {}),
    };
  } catch (error) {
    // Hata durumunda formu boş döndürerek çökmesini engelle.
    // Gerçek bir uygulamada burada daha gelişmiş bir hata yönetimi (örn: Sentry'ye loglama) yapılabilir.
    return {};
  }
};

/**
 * Form verisindeki Date nesnelerini API'nin beklediği ISO 8601 string formatına dönüştürür.
 * Bu fonksiyon, nesne veya dizi içindeki tüm tarihleri özyinelemeli (recursive) olarak bulur ve formatlar.
 * @param data - Formatlanacak veri (nesne, dizi veya ilkel tip).
 * @returns Tarihleri formatlanmış yeni veri.
 */
function deepFormatDatesForAPI(data: any): any {
  if (data instanceof Date) {
    return data.toISOString();
  }

  if (Array.isArray(data)) {
    return data.map(deepFormatDatesForAPI);
  }

  if (typeof data === 'object' && data !== null) {
    const newData: { [key: string]: any } = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        newData[key] = deepFormatDatesForAPI(data[key]);
      }
    }
    return newData;
  }

  return data;
}

/**
 * Form verilerini API'ye gönderilecek son payload yapısına dönüştürür.
 * @param formValues - `react-hook-form`'dan gelen tam form verisi.
 * @returns Backend'in beklediği `{ vehicle: {...}, insurances: [...], ... }` yapısında payload.
 */
export const transformFormToAPI = (formValues: VehicleFormValues): any => {
  // 1. Formdaki tüm Date nesnelerini ISO string'e çevir.
  const formattedValues = deepFormatDatesForAPI(formValues);

  // 2. Ana araç verilerini ve ilişkili modülleri ayır.
  const {
    insurances,
    inspections,
    utts,
    hgs,
    gps,
    services,
    ...vehicleData
  } = formattedValues;

  // 3. Backend'in beklediği son payload yapısını oluştur.
  const finalPayload = {
    vehicle: vehicleData,
    insurances: insurances || [],
    inspections: inspections || [],
    utts: utts || [],
    hgs: hgs || [],
    gps: gps || [],
    services: services || [],
  };

  return finalPayload;
};
