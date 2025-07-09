import { DisposalFormValues } from './disposal-schema';
export interface DisposalRecord {
  id: number;
  vehicle_id: number;
  disposal_type: string;
  disposal_date: string;
  amount?: number;
  notes?: string;
  created_at?: string;
}

import { apiFetch } from '@/services/api';
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/api/disposal`;

export async function getAllDisposals(): Promise<DisposalRecord[]> {
  const res = await apiFetch(API_URL);
  if (!res.ok) throw new Error('Elden çıkarma kayıtları alınamadı');
  const data = await res.json();
  return data.map((item: any) => ({
    id: item.id,
    vehicle_id: item.vehicle_id,
    disposal_type: item.disposal_type,
    disposal_date: item.disposal_date,
    amount: item.amount,
    notes: item.notes,
    created_at: item.created_at
  }));
}

export async function createDisposal(
  data: DisposalFormValues
): Promise<DisposalRecord> {
  const res = await apiFetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    let msg = 'Elden çıkarma kaydı eklenemedi';
    try {
      const err = await res.json();
      msg = err?.error || err?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function updateDisposal(
  id: number,
  data: DisposalFormValues
): Promise<DisposalRecord> {
  const res = await apiFetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Elden çıkarma kaydı güncellenemedi');
  return res.json();
}

export async function deleteDisposal(id: number): Promise<void> {
  const res = await apiFetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Elden çıkarma kaydı silinemedi');
}
