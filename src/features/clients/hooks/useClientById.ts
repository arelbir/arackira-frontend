import useSWR from 'swr';
import { getClientById } from '../services/client.service';
import type { ClientCompany } from '../types';

interface UseClientByIdResult {
  client: ClientCompany | undefined;
  isLoading: boolean;
  isError: boolean;
  mutate: () => void;
}

/**
 * Belirli bir ID'ye sahip müşteri verilerini getiren hook
 * @param id - Müşteri ID'si
 * @returns Müşteri verisi, yükleme durumu ve hata durumu
 */
export function useClientById(id: string): UseClientByIdResult {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/clients/${id}` : null,
    () => getClientById(id)
  );

  return {
    client: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}
