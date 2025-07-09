/**
 * Araç modülü için servis fonksiyonları
 */
import { apiRequest } from '@/lib/api-client';
import { VehicleCreateValues } from '../../vehicle/create/create-tabs/schema';
import { convertEmptyDatesToNull } from '../utils/form-helpers';
import { ApiResponse } from '../types/vehicle-form-context.types';

/**
 * Araç verileri için API servisi
 */
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
      // Veri dönüşümleri
      const processedVehicleData = convertEmptyDatesToNull(vehicleData);
      const { insurances, inspections, utts, hgs, services } = relatedData;
      
      // Tüm verileri birleştir
      const payload = {
        vehicle: processedVehicleData,
        insurances: insurances.map(insurance => convertEmptyDatesToNull(insurance)),
        inspections: inspections.map(inspection => convertEmptyDatesToNull(inspection)),
        utts: utts.map(utt => convertEmptyDatesToNull(utt)),
        hgs: hgs.map(hgsItem => convertEmptyDatesToNull(hgsItem)),
        services: services.map(service => convertEmptyDatesToNull(service))
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
