// Tedarikçi servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface Supplier {
  id: number;
  name: string;
  tax_number?: string | null;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupplierListResponse {
  data: Supplier[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface SupplierFilters {
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  searchTerm?: string;
}

export async function getAllSuppliers(
  filters: SupplierFilters = {}, 
  token: string
): Promise<SupplierListResponse> {
  // Filtre ve sayfalama parametrelerini URL'e ekle
  const queryParams = new URLSearchParams();
  
  if (filters.sortBy) queryParams.append('sortBy', filters.sortBy as string);
  if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder as string);
  if (filters.isActive !== undefined) queryParams.append('isActive', String(filters.isActive));
  if (filters.page) queryParams.append('page', String(filters.page));
  if (filters.pageSize) queryParams.append('pageSize', String(filters.pageSize));
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  const res = await apiFetch(`${API_BASE}/api/suppliers${queryString}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!res.ok) throw new Error('Tedarikçiler alınamadı');
  return await res.json();
}

export async function getSupplierById(id: number, token: string): Promise<Supplier> {
  const res = await apiFetch(`${API_BASE}/api/suppliers/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Tedarikçi detayları alınamadı');
  return await res.json();
}

export async function searchSuppliers(
  searchTerm: string, 
  limit = 10, 
  token: string
): Promise<Supplier[]> {
  const res = await apiFetch(`${API_BASE}/api/suppliers/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Tedarikçi araması yapılamadı');
  const data = await res.json();
  return data.data;
}

export async function createSupplier(
  data: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>, 
  token: string
): Promise<Supplier> {
  const res = await apiFetch(`${API_BASE}/api/suppliers`, {
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

export async function updateSupplier(
  id: number, 
  data: Partial<Omit<Supplier, 'id' | 'created_at' | 'updated_at'>>, 
  token: string
): Promise<Supplier> {
  const res = await apiFetch(`${API_BASE}/api/suppliers/${id}`, {
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

export async function deleteSupplier(id: number, token: string): Promise<void> {
  const res = await apiFetch(`${API_BASE}/api/suppliers/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Tedarikçi silinemedi');
  return;
}
