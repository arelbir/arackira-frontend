// Servis Şirketi servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface ServiceCompany {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllServiceCompanies(token: string): Promise<ServiceCompany[]> {
  const res = await apiFetch(`${API_BASE}/api/service-companies`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Servis şirketleri alınamadı');
  return await res.json();
}

export async function createServiceCompany(data: Omit<ServiceCompany, 'id' | 'created_at'>, token: string): Promise<ServiceCompany> {
  const res = await apiFetch(`${API_BASE}/api/service-companies`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Servis şirketi eklenemedi');
  return await res.json();
}

export async function updateServiceCompany(id: number, data: Omit<ServiceCompany, 'id' | 'created_at'>, token: string): Promise<ServiceCompany> {
  const res = await apiFetch(`${API_BASE}/api/service-companies/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Servis şirketi güncellenemedi');
  return await res.json();
}

export async function deleteServiceCompany(id: number, token: string): Promise<void> {
  const res = await apiFetch(`${API_BASE}/api/service-companies/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Servis şirketi silinemedi');
  return await res.json();
}
