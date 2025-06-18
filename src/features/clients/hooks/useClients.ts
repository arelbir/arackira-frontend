'use client';
import useSWR from 'swr';

export interface ClientAddress {
  id: number;
  client_id: number;
  type: string;
  address: string;
  city?: string;
  country?: string;
  postal_code?: string;
  tax_number?: string;
  created_at?: string;
}

export interface ClientCompany {
  id: number;
  company_name: string;
  contact_person?: string;
  email: string;
  phone?: string;
  parent_company_id?: number | null;
  client_type_id?: number | null;
  addresses?: ClientAddress[];
  created_at?: string;
}

export interface ClientsResponse {
  data: ClientCompany[];
  total: number;
}

import { apiFetcher } from '@/lib/api';

export function useClients(params?: Record<string, any>) {
  // Debug log for SWR data and error
  
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  const { data, error, isLoading, mutate } = useSWR(`/api/clients${query}`, apiFetcher);
  // Hem array hem object response destekle
  const clients = Array.isArray(data) ? data : data?.data ?? [];
  const total = Array.isArray(data) ? data.length : data?.total ?? 0;
  console.log('[useClients] data:', data, 'error:', error);
  return {
    clients,
    total,
    isLoading,
    isError: !!error,
    mutate,
  };
}
