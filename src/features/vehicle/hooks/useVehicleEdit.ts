/**
 * Araç düzenleme için custom hook
 */
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { VehicleCreateValues } from "../../vehicle/create/create-tabs/schema";
import { apiRequest } from "@/lib/api-client";
import { useNotification } from "@/components/ui/notification";
import { mapApiDataToFormValues } from "../utils/form-helpers";

interface UseVehicleEditProps {
  /**
   * Araç düzenleme formu
   */
  form: UseFormReturn<VehicleCreateValues>;
  
  /**
   * Düzenleme modu aktif mi
   */
  editMode: boolean;
  
  /**
   * Araç ID'sini güncelleyen callback
   */
  setVehicleId: (id: number) => void;
  
  /**
   * Mevcut araç ID'si
   */
  vehicleId: number | null;
}

interface UseVehicleEditResult {
  /**
   * Araç verilerini getiren fonksiyon
   */
  fetchVehicleData: (id: number) => Promise<any>;
  
  /**
   * Yükleniyor durumu
   */
  isLoading: boolean;
  
  /**
   * Hata durumu
   */
  error: string | null;
  
  /**
   * İlişkili modülleri ayarlayan fonksiyon
   */
  setRelatedModules?: (data: any) => void;
}

/**
 * Araç düzenleme işlemleri için custom hook
 */
export const useVehicleEdit = ({
  form,
  editMode,
  setVehicleId,
  vehicleId: currentVehicleId
}: UseVehicleEditProps): UseVehicleEditResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useNotification();
  
  /**
   * Araç verilerini getiren fonksiyon
   */
  const fetchVehicleData = async (id: number) => {
    setIsLoading(true);
    try {
      // API'dan veri çek
      const response = await apiRequest({
        url: `vehicles/${id}/complete`,
        method: 'GET',
        requiresAuth: true
      }) as { data?: any };
      
      if (!response || typeof response !== 'object' || !('data' in response)) {
        throw new Error('API yanıtı geçersiz format');
      }

      // Form verilerini resetle
      const formValues = mapApiDataToFormValues(response.data);
      form.reset(formValues);
      
      // Araç ID'sini güncelle
      setVehicleId(id);
      setError(null);
      
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Beklenmeyen bir hata oluştu';
      setError(errorMsg);
      showError(errorMsg, "Araç Verisi Çekilemedi");
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Başlangıçta vehicleId varsa, verileri otomatik yükle
  useEffect(() => {
    if (editMode && currentVehicleId && !isLoading) {
      fetchVehicleData(currentVehicleId);
    }
  }, [editMode, currentVehicleId]);
  
  return {
    fetchVehicleData,
    isLoading,
    error
  };
};
