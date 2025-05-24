// Tedarikçi (Tyre Supplier) servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface TyreSupplier {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllTyreSuppliers(token: string | null): Promise<TyreSupplier[]> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tyre-suppliers`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Tedarikçiler alınamadı');
  return await res.json();
}

export async function createTyreSupplier(data: Omit<TyreSupplier, 'id' | 'created_at'>, token: string | null): Promise<TyreSupplier> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tyre-suppliers`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Tedarikçi eklenemedi');
  return await res.json();
}

export async function updateTyreSupplier(id: number, data: Omit<TyreSupplier, 'id' | 'created_at'>, token: string | null): Promise<TyreSupplier> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tyre-suppliers/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Tedarikçi güncellenemedi');
  return await res.json();
}

export async function deleteTyreSupplier(id: number, token: string | null): Promise<void> {
  if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
  const res = await apiFetch(`${API_BASE}/api/tyre-suppliers/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Tedarikçi silinemedi');
  return await res.json();
}
