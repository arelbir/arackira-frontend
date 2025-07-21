/**
 * Araç modülü için servis fonksiyonları
 */
import { apiRequest } from '@/lib/api-client';
import { ApiResponse } from '../types/vehicle-form-context.types';
import { VehicleCreateValues } from '@/features/vehicle/create/create-tabs/schema';
import { convertEmptyDatesToNull, convertStringIdsToNumbers } from '../utils/form-helpers';


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
    console.error(`Error fetching vehicle with ID ${id}:`, error);
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
        url: `vehicles/${id}/complete`,
        method: 'GET',
        requiresAuth: true
      }) as ApiResponse;
      
      return response;
    } catch (error) {
      console.error('fetchVehicleWithRelated error:', error);
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
    vehicleData: VehicleCreateValues, 
    relatedData: {
      insurances: any[],
      inspections: any[],
      utts: any[],
      hgs: any[],
      services: any[]
    },
    editMode: boolean = false,
    vehicleId?: number
  ): Promise<ApiResponse> {
    try {
      // DEBUG: Veri dönüşümü öncesi formdan gelen ID değerlerini görüntüle
      console.log('Form submit değerleri (dönüşüm öncesi):', {
        brand_id: vehicleData.brand_id,
        model_id: vehicleData.model_id,
        vehicle_type_id: vehicleData.vehicle_type_id,
        fuel_type_id: vehicleData.fuel_type_id,
        color_id: vehicleData.color_id,
        branch_id: vehicleData.branch_id,
        vehicle_status_id: vehicleData.vehicle_status_id,
        supplier_id: vehicleData.supplier_id,
        transmission_id: vehicleData.transmission_id,
        tipKontrol: {
          brand_id_type: typeof vehicleData.brand_id,
          model_id_type: typeof vehicleData.model_id,
          vehicle_type_id_type: typeof vehicleData.vehicle_type_id,
          supplier_id_type: typeof vehicleData.supplier_id
        }
      });
      
      // Veri dönüşümleri - boş tarih alanları ve string ID'leri işle
      let processedVehicleData = convertEmptyDatesToNull(vehicleData);
      
      // DEBUG: tarih dönüşümü sonrası
      console.log('convertEmptyDatesToNull sonrası:', {
        brand_id: processedVehicleData.brand_id,
        model_id: processedVehicleData.model_id,
        vehicle_type_id: processedVehicleData.vehicle_type_id,
        fuel_type_id: processedVehicleData.fuel_type_id,
        tipKontrol: {
          brand_id_type: typeof processedVehicleData.brand_id,
          model_id_type: typeof processedVehicleData.model_id,
          vehicle_type_id_type: typeof processedVehicleData.vehicle_type_id
        }
      });
      
      // ID alanlarını string'den number'a dönüştür
      processedVehicleData = convertStringIdsToNumbers(processedVehicleData);
      
      // DEBUG: ID dönüşümü sonrası
      console.log('convertStringIdsToNumbers sonrası:', {
        brand_id: processedVehicleData.brand_id,
        model_id: processedVehicleData.model_id,
        vehicle_type_id: processedVehicleData.vehicle_type_id,
        fuel_type_id: processedVehicleData.fuel_type_id,
        color_id: processedVehicleData.color_id,
        branch_id: processedVehicleData.branch_id,
        vehicle_status_id: processedVehicleData.vehicle_status_id,
        supplier_id: processedVehicleData.supplier_id,
        transmission_id: processedVehicleData.transmission_id,
        tipKontrol: {
          brand_id_type: typeof processedVehicleData.brand_id,
          model_id_type: typeof processedVehicleData.model_id,
          vehicle_type_id_type: typeof processedVehicleData.vehicle_type_id,
          supplier_id_type: typeof processedVehicleData.supplier_id
        }
      });
      
      const { insurances, inspections, utts, hgs, services } = relatedData;
      
      // Tüm verileri birleştir ve ID alanlarını dönüştür
      const payload = {
        vehicle: processedVehicleData,
        insurances: insurances.map(insurance => convertStringIdsToNumbers(convertEmptyDatesToNull(insurance))),
        inspections: inspections.map(inspection => convertStringIdsToNumbers(convertEmptyDatesToNull(inspection))),
        utts: utts.map(utt => convertStringIdsToNumbers(convertEmptyDatesToNull(utt))),
        hgs: hgs.map(hgsItem => convertStringIdsToNumbers(convertEmptyDatesToNull(hgsItem))),
        services: services.map(service => convertStringIdsToNumbers(convertEmptyDatesToNull(service)))
      };

      // API endpoint'i belirleme
      const url = editMode && vehicleId 
        ? `vehicles/${vehicleId}/with-related` 
        : 'vehicles/with-related';
      
      // API isteği yap
      const response = await apiRequest({
        url,
        method: editMode ? 'PUT' : 'POST',
        body: payload,
        requiresAuth: true
      }) as ApiResponse;
      
      return response;
    } catch (error) {
      console.error('submitWithRelated error:', error);
      throw error;
    }
  }
}
