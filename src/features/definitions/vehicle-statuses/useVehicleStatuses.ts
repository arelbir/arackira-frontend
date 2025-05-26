// Araç Statüsü işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllVehicleStatuses, createVehicleStatus, updateVehicleStatus, deleteVehicleStatus, VehicleStatus } from './vehicleStatusService';
import { useAuth } from '@/hooks/useAuth';

export function useVehicleStatuses() {
  const [vehicleStatuses, setVehicleStatuses] = useState<VehicleStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchVehicleStatuses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const data = await getAllVehicleStatuses(token);
      setVehicleStatuses(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addVehicleStatus = useCallback(async (data: Omit<VehicleStatus, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const newVehicleStatus = await createVehicleStatus(data, token);
      setVehicleStatuses(prev => [...prev, newVehicleStatus]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editVehicleStatus = useCallback(async (id: number, data: Omit<VehicleStatus, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const updated = await updateVehicleStatus(id, data, token);
      setVehicleStatuses(prev => prev.map(i => i.id === id ? updated : i));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removeVehicleStatus = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      await deleteVehicleStatus(id, token);
      setVehicleStatuses(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

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
    removeVehicleStatus,
    setVehicleStatuses,
    setError
  };
}
