import useSWR from 'swr';
import { apiFetcher } from '@/lib/api';

// Müşteri veri tipi tanımı
export interface ClientCompany {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  tax_office?: string;
  tax_number?: string;
  address?: string;
  client_type_id?: number;
  parent_company_id?: number | null;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

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
  const { data, error, isLoading, mutate } = useSWR<ClientCompany>(
    id ? `/api/clients/${id}` : null,
    apiFetcher
  );

  return {
    client: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}
