// Para Birimi servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface Currency {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllCurrencies(token: string): Promise<Currency[]> {
  const res = await apiFetch(`${API_BASE}/api/currencies`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Para birimleri alınamadı');
  return await res.json();
}

export async function createCurrency(data: Omit<Currency, 'id' | 'created_at'>, token: string): Promise<Currency> {
  const res = await apiFetch(`${API_BASE}/api/currencies`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Para birimi eklenemedi');
  return await res.json();
}

export async function updateCurrency(id: number, data: Omit<Currency, 'id' | 'created_at'>, token: string): Promise<Currency> {
  const res = await apiFetch(`${API_BASE}/api/currencies/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Para birimi güncellenemedi');
  return await res.json();
}

export async function deleteCurrency(id: number, token: string): Promise<void> {
  const res = await apiFetch(`${API_BASE}/api/currencies/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Para birimi silinemedi');
  return await res.json();
}
