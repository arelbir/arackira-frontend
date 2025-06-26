// Ödeme Hesabı servis fonksiyonları
import { apiFetch } from '@/services/api';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

export interface PaymentAccount {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function getAllPaymentAccounts(token: string): Promise<PaymentAccount[]> {
  const res = await apiFetch(`${API_BASE}/api/payment-accounts`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ödeme hesapları alınamadı');
  return await res.json();
}

export async function createPaymentAccount(data: Omit<PaymentAccount, 'id' | 'created_at'>, token: string): Promise<PaymentAccount> {
  const res = await apiFetch(`${API_BASE}/api/payment-accounts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Ödeme hesabı eklenemedi');
  return await res.json();
}

export async function updatePaymentAccount(id: number, data: Omit<PaymentAccount, 'id' | 'created_at'>, token: string): Promise<PaymentAccount> {
  const res = await apiFetch(`${API_BASE}/api/payment-accounts/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Ödeme hesabı güncellenemedi');
  return await res.json();
}

export async function deletePaymentAccount(id: number, token: string): Promise<void> {
  const res = await apiFetch(`${API_BASE}/api/payment-accounts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Ödeme hesabı silinemedi');
  return await res.json();
}
