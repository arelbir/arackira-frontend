// Ortak tanım hook'ları merkezi export dosyası
import { useQuery } from '@tanstack/react-query';

// Models merkezi servis hook'ları (React Query tabanlı)
import { getAllModels, getModelById, useModelsByBrand as useModelsByBrandService } from '../models/model-service';
import type { Model } from '../models/model-schema';

// Geri uyumluluk için tüm modellere erişim hook'u
export const useModel = () => {
  const query = getAllModels();
  
  return {
    // Eski arayüz uyumluluğu için
    models: query.data || [],
    isLoading: query.isLoading || false,
    isFetching: query.isFetching || false,
    status: query.status || 'idle',
    isError: query.isError || false, 
    error: query.error,
    refetch: query.refetch,

    // Yeni arayüz için (gelecekte buna geçiş için)
    data: query.data || [],
    query
  };
};

// Belirli bir markanın modellerini yüklemek için hook (merkezi hook'u kullanan wrapper)
export const useModelsByBrand = (brandId?: number) => {
  const query = useModelsByBrandService(brandId ? brandId : null);
  return {
    models: query.data || [],
    isLoading: query.isLoading,
    isFetching: query.isFetching || false,
    // Eski API uyumluluğu için basit yanıtlar
    status: 'success',
    error: null,
    isError: false
  };
};

export { useAllAgencies, useAgencyMutations } from '../agencies/use-agencies'; //Sigorta Firmaları
export * from '../brands/BrandContext';
console.log('BrandContext hook loaded'); // Araç Markaları
// Artık ModelContext yerine useModel hook'u kullanılıyor (yukarıda tanımlandı)
console.log('Models using React Query hooks'); // Araç Modelleri
export { useClientType } from '../client-types/useClientType'; // Müşteri Tipleri
export * from '../colors/ColorContext';
console.log('ColorContext hook loaded'); // Renkler
export { useCurrency } from '../currencies/useCurrency'; // Para Birimleri
export { useFuelType } from '../fuel-types/useFuelType'; // Yakıt Türü
export { useInsuranceCompany } from '../insurance-companies/useInsuranceCompany'; // Sigorta Firmaları
export { useInsuranceType } from '../insurance-types/useInsuranceType'; // Sigorta Türü
export { usePackagesByModel } from '../packages/usePackagesByModel'; // Model bazlı paketler
export { usePaymentAccount } from '../payment-accounts/usePaymentAccount'; // Ödeme Hesapları
export { usePaymentType } from '../payment-types/usePaymentType'; // Ödeme Türü
export { useServiceCompany } from '../service-companies/useServiceCompany'; // Servis Firmaları
export { useServiceType } from '../service-types/useServiceType'; // Servis Türü
export { useSupplierCategory } from '../supplier-categories/useSupplierCategory'; // Tedarikçi Kategoriler
export { useSupplier } from '../suppliers/useSupplier'; // Tedarikçiler
export { useTireBrand } from '../tire-brands/useTireBrand'; // Tekerlek Markaları
export { useTireCondition } from '../tire-conditions/useTireCondition'; // Tekerlek Durumları
export { useTireModel } from '../tire-models/useTireModel'; // Tekerlek Modelleri
export { useTirePosition } from '../tire-positions/useTirePosition'; // Tekerlek Konumları
export { useTireType } from '../tire-types/useTireType'; // Tekerlek Türü
export { useTransmission } from '../transmissions/useTransmission'; // Vites Türü
export { useTyreSupplier } from '../tyre-suppliers/useTyreSupplier'; // Tekerlek Tedarikçileri
export { useVehicleType } from '../vehicle-types/useVehicleType'; // Araç Tipi
export { useVehicleStatuses } from '../vehicle-statuses/useVehicleStatuses'; // Araç Statüleri
export * from '../branches/BranchContext';
console.log('BranchContext hook loaded'); // Şubeler
