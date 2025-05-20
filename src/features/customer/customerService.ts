import { CustomerFormValues } from './utils/customer-schema';

import { apiFetch } from '@/services/api';
const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/api/clients`;

export interface Customer {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
}

export async function getAllCustomers(): Promise<Customer[]> {
  const res = await apiFetch(API_BASE);
  if (!res.ok) throw new Error('Müşteriler alınamadı');
  return res.json();
}

export async function createCustomer(
  data: CustomerFormValues
): Promise<Customer> {
  const res = await apiFetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Müşteri eklenemedi');
  return result;
}

export async function updateCustomer(
  id: number,
  data: CustomerFormValues
): Promise<Customer> {
  const res = await apiFetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Müşteri güncellenemedi');
  return result;
}

export async function deleteCustomer(id: number): Promise<void> {
  const res = await apiFetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Müşteri silinemedi');
}

export async function getCustomerById(id: number): Promise<Customer> {
  const res = await apiFetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Müşteri bulunamadı');
  return res.json();
}
