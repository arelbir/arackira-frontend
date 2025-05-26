import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface ClientType {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllClientTypes(token: string): Promise<ClientType[]> {
  const res = await apiFetch(`${API_BASE}/api/client-types`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Müşteri tipleri alınamadı');
  return await res.json();
}

export async function createClientType(data: Omit<ClientType, 'id' | 'created_at'>, token: string): Promise<ClientType> {
  const res = await apiFetch(`${API_BASE}/api/client-types`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Müşteri tipi eklenemedi');
  return await res.json();
}

export async function updateClientType(id: number, data: Omit<ClientType, 'id' | 'created_at'>, token: string): Promise<ClientType> {
  const res = await apiFetch(`${API_BASE}/api/client-types/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Müşteri tipi güncellenemedi');
  return await res.json();
}

export async function deleteClientType(id: number, token: string): Promise<void> {
  const res = await apiFetch(`${API_BASE}/api/client-types/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Müşteri tipi silinemedi');
  return await res.json();
}
