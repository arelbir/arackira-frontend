// Sözleşme servis fonksiyonları
// NOT: JWT token localStorage'dan alınır ve Authorization header ile gönderilir.
//      Backend'e doğrudan fetch atılır (http://localhost:4000). Credentials: 'include' ile cookie de gönderilir.

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
export async function getAllContracts() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/api/contracts`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      Accept: 'application/json'
    },
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Sözleşmeler alınamadı');
  return await res.json();
}

export async function createContract(data: any) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/api/contracts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      Accept: 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Sözleşme eklenemedi');
  return await res.json();
}

export async function updateContract(id: number, data: any) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/api/contracts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      Accept: 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Sözleşme güncellenemedi');
  return await res.json();
}

export async function deleteContract(id: number) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/api/contracts/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      Accept: 'application/json'
    },
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Sözleşme silinemedi');
  return await res.json();
}
