// Ödeme Tipi servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface PaymentType {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllPaymentTypes(token: string): Promise<PaymentType[]> {
  const res = await apiFetch(`${API_BASE}/api/payment-types`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ödeme tipleri alınamadı');
  return await res.json();
}

export async function createPaymentType(data: Omit<PaymentType, 'id' | 'created_at'>, token: string): Promise<PaymentType> {
  const res = await apiFetch(`${API_BASE}/api/payment-types`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Ödeme tipi eklenemedi');
  return await res.json();
}

export async function updatePaymentType(id: number, data: Omit<PaymentType, 'id' | 'created_at'>, token: string): Promise<PaymentType> {
  const res = await apiFetch(`${API_BASE}/api/payment-types/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Ödeme tipi güncellenemedi');
  return await res.json();
}

export async function deletePaymentType(id: number, token: string): Promise<void> {
  const res = await apiFetch(`${API_BASE}/api/payment-types/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ödeme tipi silinemedi');
  return await res.json();
}
