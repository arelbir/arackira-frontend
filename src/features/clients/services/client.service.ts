import { apiRequest } from '@/lib/api-client';
import type { ClientsResponse, ClientCompany } from '../types';

export const getClients = async (url: string): Promise<ClientsResponse | ClientCompany[]> => {
  // The 'url' parameter already contains the full path with query parameters from the hook.
  const response = await apiRequest({ url });
  return response as ClientsResponse | ClientCompany[];
};

export const getClientById = async (id: string): Promise<ClientCompany> => {
  const response = await apiRequest({ url: `/api/clients/${id}` });
  return response as ClientCompany;
};

import { ClientCompanyFormValues } from '../schemas/client.schema';

export const createClient = async (clientData: ClientCompanyFormValues): Promise<ClientCompany> => {
  const response = await apiRequest({
    url: '/api/clients',
    method: 'POST',
    body: clientData,
  });
  return response as ClientCompany;
};

export const restoreClient = async (id: number): Promise<void> => {
  await apiRequest({ url: `/api/clients/${id}/restore`, method: 'POST' });
};

export const updateClient = async (id: number, clientData: ClientCompanyFormValues): Promise<ClientCompany> => {
  const response = await apiRequest({
    url: `/api/clients/${id}`,
    method: 'PUT',
    body: clientData,
  });
  return response as ClientCompany;
};

export const deleteClient = async (id: number): Promise<void> => {
  await apiRequest({ url: `/api/clients/${id}`, method: 'DELETE' });
};

export const bulkDeleteClients = async (ids: (string | number)[]): Promise<void> => {
  await apiRequest({
    url: '/api/clients/bulk/delete',
    method: 'POST',
    body: { ids },
  });
};

export const bulkRestoreClients = async (ids: (string | number)[]): Promise<void> => {
  await apiRequest({
    url: '/api/clients/bulk/restore',
    method: 'POST',
    body: { ids },
  });
};

