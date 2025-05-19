import { useEffect, useState } from 'react';
import { getAllVehicles, createVehicle, updateVehicle, deleteVehicle } from '../features/vehicle/vehicleService';

export interface Vehicle {
  id: number;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
  [key: string]: any;
}

export function useVehicle() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchVehicles() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllVehicles();
      setVehicles(data);
    } catch (err: any) {
      setError(err.message || 'Araçlar alınamadı');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addVehicle(vehicle: Partial<Vehicle>) {
    setLoading(true);
    setError(null);
    try {
      const newVehicle = await createVehicle(vehicle);
      setVehicles(prev => [...prev, newVehicle]);
      return newVehicle;
    } catch (err: any) {
      setError(err.message || 'Araç eklenemedi');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function editVehicle(id: number, updates: Partial<Vehicle>) {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateVehicle(id, updates);
      setVehicles(prev => prev.map(v => v.id === id ? updated : v));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Araç güncellenemedi');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function removeVehicle(id: number) {
    setLoading(true);
    setError(null);
    try {
      await deleteVehicle(id);
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (err: any) {
      setError(err.message || 'Araç silinemedi');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    vehicles,
    loading,
    error,
    addVehicle,
    editVehicle,
    removeVehicle,
    refetch: fetchVehicles,
  };
}
