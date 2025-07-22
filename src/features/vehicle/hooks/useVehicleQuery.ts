import useSWR from 'swr';
import { apiRequest } from '@/lib/api-client';
import { vehicleApiResponseSchema } from '../schemas';
import { parseApiDataToFormValues } from '../utils/data-transformers';


// Veri çekme, doğrulama ve dönüştürme işlemlerini yapan merkezi fetcher fonksiyonu
const vehicleFetcher = async (url: string) => {
  const response = await apiRequest({ url, method: 'GET' });

  // Gelen veriyi Zod şeması ile parse et
  const validatedData = vehicleApiResponseSchema.parse(response);
  // Veriyi formun kullanabileceği formata dönüştür
  return parseApiDataToFormValues(validatedData);
};

export const useVehicleQuery = (vehicleId?: number) => {
  // SWR, key olarak null aldığında isteği yapmaz. Bu, koşullu veri çekme için idealdir.
  const swrKey = vehicleId ? `/api/vehicles/${vehicleId}/with-related` : null;

  const { data, error, isLoading } = useSWR(swrKey, vehicleFetcher);

  return {
    vehicleData: data, // `data` zaten dönüştürülmüş veriyi içerir
    error,
    isLoading,
  };
};
