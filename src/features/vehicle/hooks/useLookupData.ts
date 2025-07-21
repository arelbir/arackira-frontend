import useSWR from 'swr';
import { apiRequest } from '@/lib/api-client';

// Seçenek tipini tanımlama (eğer kullanılmıyorsa kaldırılabilir)

/**
 * Tüm lookup verilerini (sigorta tipleri, şirketler, para birimleri vb.) tek bir hook içinde toplar.
 * useSWR kütüphanesini kullanarak veri çekme, önbellekleme ve yeniden doğrulama sağlar.
 * @returns Çeşitli lookup veri listeleri ve yükleme durumu
 */
export function useLookupData(brandId?: string | null) {
  /**
   * SWR için veri çekme fonksiyonu.
   * @param url - API endpoint URL'si
   * @returns API'den dönen herhangi bir dizi
   */
  const lookupFetcher = async (url: string): Promise<any[]> => {
    const response = await apiRequest({ url });

    // API'den gelen yanıtın { data: [...] } yapısında olup olmadığını kontrol et
    if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
      return response.data;
    }

    // Yanıtın doğrudan bir dizi olup olmadığını kontrol et
    if (Array.isArray(response)) {
      return response;
    }

    // Beklenmeyen bir format gelirse boş dizi döndür
    return [];
  };

  // API çağrıları
  const { data: insuranceTypes, isLoading: isLoadingInsuranceTypes } = useSWR("/api/insurance-types", lookupFetcher);
  const { data: insuranceCompanies, isLoading: isLoadingInsuranceCompanies } = useSWR("/api/insurance-companies", lookupFetcher);
  const { data: agencies, isLoading: isLoadingAgencies } = useSWR("/api/agencies", lookupFetcher);
  const { data: currencies, isLoading: isLoadingCurrencies } = useSWR("/api/currencies", lookupFetcher);
  const { data: paymentTypes, isLoading: isLoadingPaymentTypes } = useSWR("/api/payment-types", lookupFetcher);
  const { data: paymentAccounts, isLoading: isLoadingPaymentAccounts } = useSWR("/api/payment-accounts", lookupFetcher);
  const { data: inspectionCompanies, isLoading: isLoadingInspectionCompanies } = useSWR("/api/inspection-companies", lookupFetcher);
  const { data: brands, isLoading: isLoadingBrands } = useSWR("/api/brands", lookupFetcher);
  // Marka ID'si varsa, o markaya ait modelleri getir. Yoksa, istek yapma (SWR'a null key gönder).
  const { data: models, isLoading: isLoadingModels } = useSWR(brandId ? `/api/models?brand_id=${brandId}` : null, lookupFetcher);
  const { data: suppliers, isLoading: isLoadingSuppliers } = useSWR("/api/suppliers", lookupFetcher);
  const { data: colors, isLoading: isLoadingColors } = useSWR("/api/colors", lookupFetcher);
  const { data: branches, isLoading: isLoadingBranches } = useSWR("/api/branches", lookupFetcher);
  const { data: vehicleTypes, isLoading: isLoadingVehicleTypes } = useSWR("/api/vehicle-types", lookupFetcher);
  const { data: fuelTypes, isLoading: isLoadingFuelTypes } = useSWR("/api/fuel-types", lookupFetcher);
  const { data: vehicleStatuses, isLoading: isLoadingVehicleStatuses } = useSWR("/api/vehicle-statuses", lookupFetcher);


  // Tüm lookup verilerinin yüklenip yüklenmediğini kontrol eden genel bir yükleme durumu
  const isLoading = isLoadingInsuranceTypes || isLoadingInsuranceCompanies || isLoadingAgencies || 
                     isLoadingCurrencies || isLoadingPaymentTypes || isLoadingPaymentAccounts || isLoadingInspectionCompanies || isLoadingBrands || isLoadingModels || isLoadingSuppliers || isLoadingColors || isLoadingBranches || isLoadingVehicleTypes || isLoadingFuelTypes || isLoadingVehicleStatuses;

  // Tüm lookup verilerini orijinal formatında ve undefined yerine boş dizi ile döndür
  return {
    insuranceTypes: (insuranceTypes ?? []) as { id: string; name: string; }[],
    insuranceCompanies: (insuranceCompanies ?? []) as { id: string; name: string; }[],
    agencies: (agencies ?? []) as { id: string; name: string; }[],
    // Para birimlerini { id, code } yerine { id, name: code } formatına dönüştür
    currencies: (currencies ?? []).map((c: { id: string; code: string }) => ({ ...c, name: c.code })) as { id: string; name: string; }[],
    paymentTypes: (paymentTypes ?? []) as { id: string; name: string; }[],
    paymentAccounts: (paymentAccounts ?? []) as { id: string; name: string; }[],
    inspectionCompanies: (inspectionCompanies ?? []) as { id: string; name: string; }[],
    brands: (brands ?? []) as { id: string; name: string; }[],
    models: (models ?? []) as { id: string; name: string; }[],
    suppliers: (suppliers ?? []) as { id: string; name: string; }[],
    colors: (colors ?? []) as { id: string; name: string; }[],
    branches: (branches ?? []) as { id: string; name: string; }[],
    vehicleTypes: (vehicleTypes ?? []) as { id: string; name: string; }[],
    fuelTypes: (fuelTypes ?? []) as { id: string; name: string; }[],
    vehicleStatuses: (vehicleStatuses ?? []) as { id: string; name: string; }[],
    isLoading, // Tüm verilerin yüklenip yüklenmediğini gösteren tek bir bayrak
    isLoadingModels
  };
}
