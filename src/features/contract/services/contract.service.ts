import { apiRequest } from '@/lib/api-client';
import type { ContractsResponse, Contract } from '../types';

// İleride Zod şeması ve form değerleri için bir şema dosyası oluşturulacak.
// import { ContractFormValues } from '../schemas/contract.schema';

export const getContracts = async (url: string): Promise<ContractsResponse | Contract[]> => {
  const response = await apiRequest({ url });
  return response as ContractsResponse | Contract[];
};

export const getContractById = async (id: string): Promise<Contract> => {
  const response = await apiRequest({ url: `/api/contracts/${id}` });
  return response as Contract;
};

export const createContract = async (contractData: any): Promise<Contract> => { // Şema oluşturulana kadar 'any' kullanılıyor
  const response = await apiRequest({
    url: '/api/contracts',
    method: 'POST',
    body: contractData,
  });
  return response as Contract;
};

export const updateContract = async (id: number, contractData: any): Promise<Contract> => { // Şema oluşturulana kadar 'any' kullanılıyor
  const response = await apiRequest({
    url: `/api/contracts/${id}`,
    method: 'PUT',
    body: contractData,
  });
  return response as Contract;
};

export const deleteContract = async (id: number): Promise<void> => {
  await apiRequest({ url: `/api/contracts/${id}`, method: 'DELETE' });
};