// Ortak tanım hook'ları merkezi export dosyası
export { useAgency } from '../agencies/useAgency'; //Sigorta Firmaları
export * from '../brands/BrandContext';
console.log('BrandContext hook loaded'); // Araç Markaları
export { useClientType } from '../client-types/useClientType'; // Müşteri Tipleri
export * from '../colors/ColorContext';
console.log('ColorContext hook loaded'); // Renkler
export { useCurrency } from '../currencies/useCurrency'; // Para Birimleri
export { useFuelType } from '../fuel-types/useFuelType'; // Yakıt Türü
export { useInsuranceCompany } from '../insurance-companies/useInsuranceCompany'; // Sigorta Firmaları
export { useInsuranceType } from '../insurance-types/useInsuranceType'; // Sigorta Türü
export * from '../models/ModelContext';
console.log('ModelContext hook loaded'); // Araç Modelleri
export { useModelsByBrand } from '../models/useModelsByBrand'; // Belirli bir markanın modelleri
export { usePackagesByModel } from '../packages/usePackagesByModel'; // Model bazlı paketler
export { usePaymentAccount } from '../payment-accounts/usePaymentAccount'; // Ödeme Hesapları
export { usePaymentType } from '../payment-types/usePaymentType'; // Ödeme Türü
export { useServiceCompany } from '../service-companies/useServiceCompany'; // Servis Firmaları
export { useServiceType } from '../service-types/useServiceType'; // Servis Türü
export { useSupplierCategory } from '../supplier-categories/useSupplierCategory'; // Tedarikçi Kategoriler
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
