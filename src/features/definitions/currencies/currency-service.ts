// Para birimleri servisi - React Query ile entegre edilmiş
import { createDefinitionService } from '@/lib/definition-service-factory';
import { CurrencySchema, Currency } from './currency-schema';
import { z } from 'zod';

/**
 * Para Birimi Servisi
 * Merkezi definitionService fabrikası kullanılarak oluşturulmuştur
 * Tüm servis işlemleri artık hook tabanlı (use- prefix ile)
 */
export const currencyService = createDefinitionService<Currency>('currencies', CurrencySchema);

// Tüm servis hook'larını dışa aktar
export const useGetAllCurrencies = currencyService.useGetAll;
export const useGetCurrencyById = currencyService.useGetById;
export const useCreateCurrency = currencyService.useCreate;
export const useUpdateCurrency = currencyService.useUpdate;
export const useDeleteCurrency = currencyService.useDelete;
export const useCurrencyUtils = currencyService.useUtils;

// Kolay kullanım için kısaltmalar (sayfa komponentinin kolay geçişi için)
// Hook kurallarına uygun olarak bunları fonksiyon sarmalayıcıları olarak tanımlıyoruz
export const getAllCurrencies = () => {
  const hook = useGetAllCurrencies();
  return hook;
};

export const getCurrencyById = (id: string | number | null) => {
  const hook = useGetCurrencyById(id);
  return hook;
};

export const createCurrency = (data: Omit<Currency, 'id' | 'created_at'>) => {
  const hook = useCreateCurrency();
  return hook.mutateAsync(data);
};

export const updateCurrency = (id: string | number, data: Partial<Currency>) => {
  const hook = useUpdateCurrency();
  return hook.mutateAsync({ id, data });
};

export const deleteCurrency = (id: string | number) => {
  const hook = useDeleteCurrency();
  return hook.mutateAsync(id);
};
