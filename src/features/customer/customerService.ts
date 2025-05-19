import { CustomerFormValues } from './utils/customer-schema';

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/api/clients`;

export interface Customer {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
}

export async function getAllCustomers(): Promise<Customer[]> {
  const res = await fetch(API_BASE, {
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Müşteriler alınamadı');
  return res.json();
}

export async function createCustomer(
  data: CustomerFormValues
): Promise<Customer> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
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
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Müşteri güncellenemedi');
  return result;
}

export async function deleteCustomer(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Müşteri silinemedi');
}

export async function getCustomerById(id: number): Promise<Customer> {
  const res = await fetch(`${API_BASE}/${id}`, {
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Müşteri bulunamadı');
  return res.json();
}
