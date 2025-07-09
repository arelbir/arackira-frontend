// Kiralama işlemleri için service fonksiyonları (maintenanceService örnek alınarak)
import { RentalFormValues } from './rental-schema';

import { apiFetch } from '@/services/api';
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/api/rentals`;

export interface RentalRecord {
  id: number;
  vehicle_id: number;
  client_company_id: number;
  contract_number: string;
  start_date: string;
  end_date: string;
  terms: string;
  created_at: string;
  status: string;
}

export async function getAllRentals(): Promise<RentalRecord[]> {
  const res = await apiFetch(API_URL);
  if (!res.ok) throw new Error('Kiralama kayıtları alınamadı');
  const data = await res.json();
  // API'den dönen alanları frontend arayüzüne uygun şekilde map et
  return data.map((item: any) => ({
    id: item.id,
    vehicle_id: item.vehicle_id,
    client_company_id: item.client_company_id,
    contract_number: item.contract_number,
    start_date: item.start_date,
    end_date: item.end_date,
    terms: item.terms,
    created_at: item.created_at,
    status: item.status
  }));
}

export async function createRental(
  data: RentalFormValues
): Promise<RentalRecord> {
  const res = await apiFetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Kiralama kaydı eklenemedi');
  return res.json();
}

export async function updateRental(
  id: number,
  data: RentalFormValues
): Promise<RentalRecord> {
  const res = await apiFetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Kiralama kaydı güncellenemedi');
  return res.json();
}

export async function deleteRental(id: number): Promise<void> {
  const res = await apiFetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Kiralama kaydı silinemedi');
}
