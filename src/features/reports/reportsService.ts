// src/features/reports/reportsService.ts
const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/api/reports`;

export async function getVehicleListReport() {
  const res = await fetch(`${API_BASE}/vehicle_list`, {
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Araç listesi alınamadı');
  return res.json();
}

export async function getActiveVehicleCountReport() {
  const res = await fetch(`${API_BASE}/active_vehicle_count`, {
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Aktif araç sayısı alınamadı');
  return res.json();
}

export async function getRentalCountByClientReport() {
  const res = await fetch(`${API_BASE}/rental_count_by_client`, {
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Kiralama raporu alınamadı');
  return res.json();
}

export async function getVehiclesInMaintenanceReport() {
  const res = await fetch(`${API_BASE}/vehicles_in_maintenance`, {
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Bakımda olan araçlar alınamadı');
  return res.json();
}
