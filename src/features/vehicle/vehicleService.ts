// Araç servis fonksiyonları
// NOT: JWT token localStorage'dan alınır ve Authorization header ile gönderilir.
//      Backend'e doğrudan fetch atılır (http://localhost:4000). Credentials: 'include' ile cookie de gönderilir.
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export async function getAllVehicles() {
  const res = await apiFetch(`${API_BASE}/api/vehicles`);
  if (!res.ok) throw new Error('Araçlar alınamadı');
  return await res.json();
}

export async function createVehicle(data: any) {
  const res = await apiFetch(`${API_BASE}/api/vehicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Araç eklenemedi');
  return await res.json();
}

export async function updateVehicle(id: number, data: any) {
  const res = await apiFetch(`${API_BASE}/api/vehicles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Araç güncellenemedi');
  return await res.json();
}

export async function deleteVehicle(id: number) {
  const res = await apiFetch(`${API_BASE}/api/vehicles/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Araç silinemedi');
  return await res.json();
}
