import useSWR from 'swr';
import { apiRequest } from '@/lib/api-client';

// Seçenek tipini tanımlama (eğer kullanılmıyorsa kaldırılabilir)
interface Option {
  value: string;
  label: string;
}

/**
 * Tüm lookup verilerini (sigorta tipleri, şirketler, para birimleri vb.) tek bir hook içinde toplar.
 * useSWR kütüphanesini kullanarak veri çekme, önbellekleme ve yeniden doğrulama sağlar.
 * @returns Çeşitli lookup veri listeleri ve yükleme durumu
 */
export function useLookupData() {
  /**
   * SWR için veri çekme fonksiyonu.
   * @param url - API endpoint URL'si
   * @returns API'den dönen herhangi bir dizi
   */
  const fetcher = async (url: string): Promise<any[]> => {
    return await apiRequest({ url }) as any[];
  };

  // API çağrıları
  const { data: insuranceTypes, isLoading: isLoadingInsuranceTypes } = useSWR("/api/insurance-types", fetcher);
  const { data: insuranceCompanies, isLoading: isLoadingInsuranceCompanies } = useSWR("/api/insurance-companies", fetcher);
  const { data: agencies, isLoading: isLoadingAgencies } = useSWR("/api/agencies", fetcher);
  const { data: currencies, isLoading: isLoadingCurrencies } = useSWR("/api/currencies", fetcher);
  const { data: paymentTypes, isLoading: isLoadingPaymentTypes } = useSWR("/api/payment-types", fetcher);
  const { data: paymentAccounts, isLoading: isLoadingPaymentAccounts } = useSWR("/api/payment-accounts", fetcher);

  // Tüm lookup verilerinin yüklenip yüklenmediğini kontrol eden genel bir yükleme durumu
  const isLoading = isLoadingInsuranceTypes || isLoadingInsuranceCompanies || isLoadingAgencies || 
                     isLoadingCurrencies || isLoadingPaymentTypes || isLoadingPaymentAccounts;

  // Tüm lookup verilerini orijinal formatında ve undefined yerine boş dizi ile döndür
  return {
    insuranceTypes: (insuranceTypes ?? []) as { id: string; name: string; }[],
    insuranceCompanies: (insuranceCompanies ?? []) as { id: string; name: string; }[],
    agencies: (agencies ?? []) as { id: string; name: string; }[],
    // Para birimlerini { id, code } yerine { id, name: code } formatına dönüştür
    currencies: (currencies ?? []).map((c: { id: string; code: string }) => ({ ...c, name: c.code })) as { id: string; name: string; }[],
    paymentTypes: (paymentTypes ?? []) as { id: string; name: string; }[],
    paymentAccounts: (paymentAccounts ?? []) as { id: string; name: string; }[],
    isLoading // Tüm verilerin yüklenip yüklenmediğini gösteren tek bir bayrak
  };
}
