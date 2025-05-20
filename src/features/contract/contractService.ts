// Sözleşme servis fonksiyonları
// NOT: JWT token localStorage'dan alınır ve Authorization header ile gönderilir.
//      Backend'e doğrudan fetch atılır (http://localhost:4000). Credentials: 'include' ile cookie de gönderilir.

import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export async function getAllContracts() {
  const res = await apiFetch(`${API_BASE}/api/contracts`);
  if (!res.ok) throw new Error('Sözleşmeler alınamadı');
  return await res.json();
}

export async function createContract(data: any) {
  const res = await apiFetch(`${API_BASE}/api/contracts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Sözleşme eklenemedi');
  return await res.json();
}

export async function updateContract(id: number, data: any) {
  const res = await apiFetch(`${API_BASE}/api/contracts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Sözleşme güncellenemedi');
  return await res.json();
}

export async function deleteContract(id: number) {
  const res = await apiFetch(`${API_BASE}/api/contracts/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Sözleşme silinemedi');
  return await res.json();
}
