import { useAllVehicleStatuses } from '@/features/definitions/vehicle-statuses/use-vehicle-statuses';
import { VehicleStatus } from '@/features/definitions/vehicle-statuses/vehicle-status-service';

export function useVehicleStatuses() {
  // React Query hook'unu kullan
  const {
    data: statuses = [],
    isLoading: loading,
    error,
    refetch
  } = useAllVehicleStatuses();

  // Geriye uyumluluk için aynı arayüzü sağlıyoruz
  // Ancak kullanımı opsiyonel olarak geliştirilmiş bir nesne içeren bir nesne döndürüyoruz

  return { statuses, loading, error };
}
