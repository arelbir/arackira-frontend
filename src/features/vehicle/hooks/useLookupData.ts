import useSWR from 'swr';
import { apiFetcher } from '@/lib/api';

// Seçenek tipini tanımlama
interface Option {
  value: string;
  label: string;
}

// Tüm lookup verilerini tek bir hook içinde toplar
export function useLookupData() {
  // API çağrıları
  const { data: insuranceTypes } = useSWR("/api/insurance-types", apiFetcher);
  const { data: insuranceCompanies } = useSWR("/api/insurance-companies", apiFetcher);
  const { data: agencies } = useSWR("/api/agencies", apiFetcher);
  const { data: currencies } = useSWR("/api/currencies", apiFetcher);
  const { data: paymentTypes } = useSWR("/api/payment-types", apiFetcher);
  const { data: paymentAccounts } = useSWR("/api/payment-accounts", apiFetcher);

  // Verileri seçenek formatına dönüştüren yardımcı fonksiyon
  const formatOptions = (data: any[] = [], labelKey = 'name', valueKey = 'id'): Option[] => {
    return data.map((x: any) => ({
      value: String(x[valueKey]),
      label: x[labelKey] || x.code || x.title || String(x[valueKey])
    }));
  };

  // Tüm lookup verilerini formatlanmış olarak döndür
  return {
    insuranceTypes: formatOptions(insuranceTypes || []),
    insuranceCompanies: formatOptions(insuranceCompanies || []),
    agencies: formatOptions(agencies || []),
    currencies: formatOptions(currencies || [], 'code'),
    paymentTypes: formatOptions(paymentTypes || []),
    paymentAccounts: formatOptions(paymentAccounts || []),
    // API'den dönen veriler hazır olduğunda
    isLoading: !insuranceTypes || !insuranceCompanies || !agencies || !currencies || !paymentTypes || !paymentAccounts
  };
}
