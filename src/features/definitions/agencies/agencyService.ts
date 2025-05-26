// Ajans servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface Agency {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllAgencies(token: string): Promise<Agency[]> {
  const res = await apiFetch(`${API_BASE}/api/agencies`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ajanslar alınamadı');
  return await res.json();
}

export async function createAgency(data: Omit<Agency, 'id' | 'created_at'>, token: string): Promise<Agency> {
  const res = await apiFetch(`${API_BASE}/api/agencies`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Ajans eklenemedi');
  return await res.json();
}

export async function updateAgency(id: number, data: Omit<Agency, 'id' | 'created_at'>, token: string): Promise<Agency> {
  const res = await apiFetch(`${API_BASE}/api/agencies/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Ajans güncellenemedi');
  return await res.json();
}

export async function deleteAgency(id: number, token: string): Promise<void> {
  const res = await apiFetch(`${API_BASE}/api/agencies/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ajans silinemedi');
  return await res.json();
}
