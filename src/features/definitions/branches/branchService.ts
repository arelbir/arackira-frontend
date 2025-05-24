// Şube servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export async function getAllBranches() {
  const res = await apiFetch(`${API_BASE}/api/branches`);
  if (!res.ok) throw new Error('Şubeler alınamadı');
  return await res.json();
}

export async function createBranch(data: any) {
  const res = await apiFetch(`${API_BASE}/api/branches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Şube eklenemedi');
  return await res.json();
}

export async function updateBranch(id: number, data: any) {
  const res = await apiFetch(`${API_BASE}/api/branches/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Şube güncellenemedi');
  return await res.json();
}

export async function deleteBranch(id: number) {
  const res = await apiFetch(`${API_BASE}/api/branches/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Şube silinemedi');
  return await res.json();
}
