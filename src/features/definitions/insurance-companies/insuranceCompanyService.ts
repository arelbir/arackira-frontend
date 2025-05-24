// Sigorta Şirketi servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface InsuranceCompany {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllInsuranceCompanies(token: string): Promise<InsuranceCompany[]> {
  const res = await apiFetch(`${API_BASE}/api/insurance-companies`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Sigorta şirketleri alınamadı');
  return await res.json();
}

export async function createInsuranceCompany(data: Omit<InsuranceCompany, 'id' | 'created_at'>, token: string): Promise<InsuranceCompany> {
  const res = await apiFetch(`${API_BASE}/api/insurance-companies`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Sigorta şirketi eklenemedi');
  return await res.json();
}

export async function updateInsuranceCompany(id: number, data: Omit<InsuranceCompany, 'id' | 'created_at'>, token: string): Promise<InsuranceCompany> {
  const res = await apiFetch(`${API_BASE}/api/insurance-companies/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Sigorta şirketi güncellenemedi');
  return await res.json();
}

export async function deleteInsuranceCompany(id: number, token: string): Promise<void> {
  const res = await apiFetch(`${API_BASE}/api/insurance-companies/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Sigorta şirketi silinemedi');
  return await res.json();
}
