import useSWR from 'swr';
import { StrictVehicle } from './useVehicleTable';
import { apiRequest } from '@/lib/api-client';

/**
 * Araç listesini API'den çekmek için custom hook.
 * useSWR kütüphanesini kullanarak veri çekme, önbellekleme ve yeniden doğrulama sağlar.
 * @returns vehicles: Araç listesi, loading: Yükleme durumu, error: Hata nesnesi
 */
export function useVehicles() {
  /**
   * SWR için veri çekme fonksiyonu.
   * @param url - API endpoint URL'si
   * @returns StrictVehicle[] tipinde araç listesi
   */
  const fetcher = async (url: string): Promise<StrictVehicle[]> => {
    const response = await apiRequest({ url });
    return response as StrictVehicle[]; // API yanıtının StrictVehicle[] tipinde olduğunu varsayıyoruz
  };

  // useSWR hook'u ile veri çekme
  const { data, error, isLoading } = useSWR('/api/vehicles', fetcher);

  return {
    vehicles: data ?? [], // Veri yoksa boş dizi döndür
    loading: isLoading,   // Yükleme durumu
    error,                // Hata nesnesi
  };
}
