// Sigorta Tipi servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface InsuranceType {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllInsuranceTypes(token: string): Promise<InsuranceType[]> {
  const res = await apiFetch(`${API_BASE}/api/insurance-types`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Sigorta tipleri alınamadı');
  return await res.json();
}

export async function createInsuranceType(data: Omit<InsuranceType, 'id' | 'created_at'>, token: string): Promise<InsuranceType> {
  const res = await apiFetch(`${API_BASE}/api/insurance-types`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Sigorta tipi eklenemedi');
  return await res.json();
}

export async function updateInsuranceType(id: number, data: Omit<InsuranceType, 'id' | 'created_at'>, token: string): Promise<InsuranceType> {
  const res = await apiFetch(`${API_BASE}/api/insurance-types/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Sigorta tipi güncellenemedi');
  return await res.json();
}

export async function deleteInsuranceType(id: number, token: string): Promise<void> {
  const res = await apiFetch(`${API_BASE}/api/insurance-types/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Sigorta tipi silinemedi');
  return await res.json();
}
