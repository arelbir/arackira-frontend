'use client';
import useSWR from 'swr';
import { getClients } from '../services/client.service';
import type { ClientCompany, ClientCompanyWithSubRows } from '../types';

type UseClientsParams = Record<string, any> & { includeDeleted?: boolean };

export function useClients(params?: UseClientsParams) {
  let queryParams = { ...params };
  if (!queryParams.includeDeleted) {
    queryParams.deleted = 'false';
  } else {
    queryParams.deleted = 'any';
  }
  delete queryParams.includeDeleted;

  const query = Object.keys(queryParams).length > 0 ? '?' + new URLSearchParams(queryParams).toString() : '';
  const url = `/api/clients${query}`;

  const { data, error, isLoading, mutate } = useSWR(url, () => getClients(url));

  const clients: ClientCompanyWithSubRows[] = data || [];
  const total = Array.isArray(data) ? data.length : data?.total ?? 0;

  return {
    clients,
    total,
    isLoading,
    isError: !!error,
    mutate,
  };
}

