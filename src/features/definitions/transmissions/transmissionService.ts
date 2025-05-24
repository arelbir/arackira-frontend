// Vites Tipi servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface Transmission {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllTransmissions(token: string): Promise<Transmission[]> {
  const res = await apiFetch(`${API_BASE}/api/transmissions`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Vites tipleri alınamadı');
  return await res.json();
}

export async function createTransmission(data: Omit<Transmission, 'id' | 'created_at'>, token: string): Promise<Transmission> {
  const res = await apiFetch(`${API_BASE}/api/transmissions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Vites tipi eklenemedi');
  return await res.json();
}

export async function updateTransmission(id: number, data: Omit<Transmission, 'id' | 'created_at'>, token: string): Promise<Transmission> {
  const res = await apiFetch(`${API_BASE}/api/transmissions/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Vites tipi güncellenemedi');
  return await res.json();
}

export async function deleteTransmission(id: number, token: string): Promise<void> {
  const res = await apiFetch(`${API_BASE}/api/transmissions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Vites tipi silinemedi');
  return await res.json();
}
