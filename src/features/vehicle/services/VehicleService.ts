/**
 * Araç modülü için servis fonksiyonları
 */
import { apiRequest } from '@/lib/api-client';
import { ApiResponse } from '../types/vehicle-form-context.types';
import { transformFormToAPI } from '../utils/data-transformers';
import { VehicleFormValues } from '../schemas';

/**
 * Araç verileri için API servisi
 */
/**
 * Belirtilen ID'ye sahip aracı tüm ilişkili verileriyle birlikte getirir.
 * Sunucu tarafı bileşenlerinde (örneğin, VehicleEditPage) veri çekmek için kullanılır.
 * @param id - Araç ID'si
 * @returns Araç verilerini içeren bir Promise.
 */
export const getVehicle = async (id: number) => {
  try {
    const response = await VehicleService.fetchVehicleWithRelated(id);
    // API yanıtından sadece 'data' kısmını (ana araç verileri) döndür
    return response.data;
  } catch (error) {

    // Hata durumunda null döndürerek sayfanın çökmesini engelle
    return null;
  }
};

export class VehicleService {
  /**
   * Araç verilerini tüm ilişkili verilerle birlikte çeker
   * @param id - Araç ID
   * @returns API yanıtı
   */
  static async fetchVehicleWithRelated(id: number): Promise<ApiResponse> {
    try {
      const response = await apiRequest({
        url: `/api/vehicles/${id}/with-related`,
        method: 'GET',
        requiresAuth: true
      }) as ApiResponse;
      
      return response;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Araç ve ilişkili verilerini kaydeder veya günceller
   * @param vehicleData - Araç verileri
   * @param relatedData - İlişkili modül verileri 
   * @param editMode - Düzenleme modu (true) veya oluşturma modu (false)
   * @param vehicleId - Düzenleme modunda aracın ID'si
   * @returns API yanıtı
   */
  static async submitWithRelated(
    formData: VehicleFormValues,
    editMode: boolean = false,
    vehicleId?: number
  ): Promise<ApiResponse> {
    try {
      // Tüm form verisini tek bir fonksiyonla API'nin beklediği formata dönüştür.
      // Bu fonksiyon tarihleri ISO string'e çevirir ve payload'ı doğru yapılandırır.
      const finalPayload = transformFormToAPI(formData);

      // API endpoint'i belirleme
      const url = editMode && vehicleId 
        ? `/api/vehicles/${vehicleId}/with-related` 
        : '/api/vehicles/with-related';
      
      // API isteği yap
      const response = await apiRequest({
        url,
        method: editMode ? 'PUT' : 'POST',
        body: finalPayload,
        requiresAuth: true
      }) as ApiResponse;
      
      return response;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Toplu olarak araçları siler (soft delete).
   * @param ids Silinecek araç ID'lerinin dizisi.
   */
  static async bulkDeleteVehicles(ids: (string | number)[]) {
    return await apiRequest({
      url: '/api/vehicles/bulk-delete',
      method: 'POST',
      body: { ids },
      requiresAuth: true,
    });
  }

  /**
   * Toplu olarak silinmiş araçları geri yükler.
   * @param ids Geri yüklenecek araç ID'lerinin dizisi.
   */
  static async bulkRestoreVehicles(ids: (string | number)[]) {
    return await apiRequest({
      url: '/api/vehicles/bulk-restore',
      method: 'POST',
      body: { ids },
      requiresAuth: true,
    });
  }
}
