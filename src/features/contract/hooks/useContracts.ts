'use client';
import useSWR from 'swr';
import { getContracts } from '../services/contract.service';
import type { Contract } from '../types';

type UseContractsParams = Record<string, any>;

export function useContracts(params?: UseContractsParams) {
  const queryParams = { ...params };

  const query = Object.keys(queryParams).length > 0 ? '?' + new URLSearchParams(queryParams).toString() : '';
  const url = `/api/contracts${query}`;

  const { data, error, isLoading, mutate } = useSWR(url, () => getContracts(url));

  const contracts: Contract[] = Array.isArray(data) ? data : data?.data ?? [];
  const total = Array.isArray(data) ? data.length : data?.total ?? 0;

  return {
    contracts,
    total,
    isLoading,
    isError: !!error,
    mutate,
  };
}
