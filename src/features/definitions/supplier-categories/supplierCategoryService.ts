// Tedarikçi Kategorisi servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface SupplierCategory {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllSupplierCategories(token: string): Promise<SupplierCategory[]> {
  const res = await apiFetch(`${API_BASE}/api/supplier-categories`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Tedarikçi kategorileri alınamadı');
  return await res.json();
}

export async function createSupplierCategory(data: Omit<SupplierCategory, 'id' | 'created_at'>, token: string): Promise<SupplierCategory> {
  const res = await apiFetch(`${API_BASE}/api/supplier-categories`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Tedarikçi kategorisi eklenemedi');
  return await res.json();
}

export async function updateSupplierCategory(id: number, data: Omit<SupplierCategory, 'id' | 'created_at'>, token: string): Promise<SupplierCategory> {
  const res = await apiFetch(`${API_BASE}/api/supplier-categories/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Tedarikçi kategorisi güncellenemedi');
  return await res.json();
}

export async function deleteSupplierCategory(id: number, token: string): Promise<void> {
  const res = await apiFetch(`${API_BASE}/api/supplier-categories/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Tedarikçi kategorisi silinemedi');
  return await res.json();
}
