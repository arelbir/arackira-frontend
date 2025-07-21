import { useState, useEffect, useCallback, useRef } from "react";
import { useNotification } from "@/components/ui/notification";
import { VehicleFormValues } from "../schemas";
import { parseApiDataToFormValues } from "../utils/data-transformers";
import { apiRequest } from "@/lib/api-client";

// API'den gelen ham yanıtın yapısını tanımlar
interface VehicleCompleteApiResponse {
  data: any;
  included: any;
}

// Bu interface, hook'umuzun alacağı props'ları tanımlar.
// State'i yukarıya, yani parent bileşene taşımak için callback'ler alır.
interface UseVehicleEditProps {

  vehicleId?: number | object | null;
  setVehicleId: (id: number | null) => void;
  onFetchSuccess: (data: Partial<VehicleFormValues>) => void; // Çekilen veriyi yukarıya iletmek için callback
}

// Hook sadece yüklenme ve hata durumlarını döndürecek.
// Veri state'i parent tarafından yönetilecek.
interface UseVehicleEditResult {
  isLoading: boolean;
  error: string | null;
}

/**
 * Düzenleme modunda tam araç verilerini çeken hook.
 * Çekilen veriyi kendi içinde tutmaz, çağıran bileşene yukarı taşır.
 */
export const useVehicleEdit = ({

  vehicleId: vehicleIdProp,
  onFetchSuccess,
}: UseVehicleEditProps): UseVehicleEditResult => {
  // Prop olarak gelen vehicleId'yi gereksiz render'lardan kaçınmak için kontrol et.
  const vehicleId = typeof vehicleIdProp === 'object' && vehicleIdProp !== null && 'id' in vehicleIdProp ? (vehicleIdProp as any).id : vehicleIdProp;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);
  const { success, error: showError } = useNotification();

  const fetchVehicleData = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest<VehicleCompleteApiResponse>({ url: `/vehicles/${id}/complete`, method: 'GET' });
      if (!response || !response.data) {
        throw new Error('API yanıtı geçersiz veya boş.');
      }

      const allData = parseApiDataToFormValues(response);
      onFetchSuccess(allData); // Ana veriyi Provider'a iletiyoruz.

      success("Araç verileri başarıyla yüklendi.");
      return allData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu';
      setError(errorMessage);
      showError(`Veri yüklenirken hata: ${errorMessage}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [onFetchSuccess, showError, success]);

  useEffect(() => {
    // Sadece vehicleId varsa ve daha önce veri çekilmemişse işlemi başlat.
    if (vehicleId && !hasFetched.current) {
      fetchVehicleData(vehicleId as number);
      hasFetched.current = true; // Veri çekme denemesinin yapıldığını işaretle.
    }
  }, [vehicleId, fetchVehicleData]);

  return {
    isLoading,
    error,
  };
};
