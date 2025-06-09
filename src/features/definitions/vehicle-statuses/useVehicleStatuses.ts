// Araç Statüsü işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllVehicleStatuses, createVehicleStatus, updateVehicleStatus, deleteVehicleStatus, VehicleStatus } from './vehicle-status-service';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

export function useVehicleStatuses() {
  const [vehicleStatuses, setVehicleStatuses] = useState<VehicleStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth(); // AuthContext'ten token al

  const fetchVehicleStatuses = useCallback(async () => {
    if (!token) return; // Token yoksa API çağrısı yapma
    setLoading(true);
    setError(null);
    try {
      const data = await getAllVehicleStatuses(token);
      setVehicleStatuses(data);
    } catch (err: any) {
      setError(err.message || 'Araç statüsleri alınamadı');
    } finally {
      setLoading(false);
    }
  }, [token]);  // Token değiştiğinde yeniden çalıştır

  const addVehicleStatus = useCallback(async (data: Omit<VehicleStatus, 'id' | 'created_at'>) => {
    if (!token) return; // Token yoksa API çağrısı yapma
    setLoading(true);
    setError(null);
    try {
      const newVehicleStatus = await createVehicleStatus(data, token);
      setVehicleStatuses(prev => [...prev, newVehicleStatus]);
      return newVehicleStatus;
    } catch (err: any) {
      setError(err.message || 'Araç statüsü eklenemedi');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);  // Token değiştiğinde yeniden çalıştır

  const editVehicleStatus = useCallback(async (id: number, data: Partial<Omit<VehicleStatus, 'id' | 'created_at'>>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateVehicleStatus(id, data, token);
      setVehicleStatuses(prev => prev.map(s => s.id === id ? updated : s));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Araç statüsü güncellenemedi');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);  // Token değiştiğinde yeniden çalıştır

  const removeVehicleStatus = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteVehicleStatus(id, token);
      setVehicleStatuses(prev => prev.filter(s => s.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Araç statüsü silinemedi');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);  // Token değiştiğinde yeniden çalıştır

  useEffect(() => {
    fetchVehicleStatuses();
  }, [fetchVehicleStatuses]);

  return {
    vehicleStatuses,
    loading,
    error,
    fetchVehicleStatuses,
    addVehicleStatus,
    editVehicleStatus,
    removeVehicleStatus
  };
}
