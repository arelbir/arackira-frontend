// Araç Tipi işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllVehicleTypes, createVehicleType, updateVehicleType, deleteVehicleType, VehicleType } from './vehicleTypeService';

export function useVehicleType(token: string | null) {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicleTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const data = await getAllVehicleTypes(token);
      setVehicleTypes(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addVehicleType = useCallback(async (data: Omit<VehicleType, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const newVehicleType = await createVehicleType(data, token);
      setVehicleTypes(prev => [...prev, newVehicleType]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editVehicleType = useCallback(async (id: number, data: Omit<VehicleType, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const updated = await updateVehicleType(id, data, token);
      setVehicleTypes(prev => prev.map(v => v.id === id ? updated : v));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removeVehicleType = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      await deleteVehicleType(id, token);
      setVehicleTypes(prev => prev.filter(v => v.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchVehicleTypes();
  }, [fetchVehicleTypes]);

  return {
    vehicleTypes,
    loading,
    error,
    fetchVehicleTypes,
    addVehicleType,
    editVehicleType,
    removeVehicleType,
    setVehicleTypes,
    setError
  };
}
