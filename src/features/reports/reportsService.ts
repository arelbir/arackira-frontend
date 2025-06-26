// src/features/reports/reportsService.ts
const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/api/reports`;

import { apiFetch } from '@/services/api';

export async function getVehicleListReport() {
  const res = await apiFetch(`${API_BASE}/vehicle_list`);
  if (!res.ok) throw new Error('Araç listesi alınamadı');
  return res.json();
}



export async function getActiveVehicleCountReport() {
  const res = await apiFetch(`${API_BASE}/active_vehicle_count`);
  if (!res.ok) throw new Error('Aktif araç sayısı alınamadı');
  return res.json();
}

export async function getRentalCountByClientReport() {
  const res = await apiFetch(`${API_BASE}/rental_count_by_client`);
  if (!res.ok) throw new Error('Kiralama raporu alınamadı');
  return res.json();
}



export async function getVehiclesInMaintenanceReport() {
  const res = await apiFetch(`${API_BASE}/vehicles_in_maintenance`);
  if (!res.ok) throw new Error('Bakımda olan araçlar alınamadı');
  return res.json();
}
