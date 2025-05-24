import { useCallback, useEffect, useState } from 'react';
// NOT: Aşağıdaki servis fonksiyonları gerçek API'nize göre güncellenmeli
import { getAllVehicles, createVehicle, updateVehicle, deleteVehicle, Vehicle } from '../vehicleService';

export function useVehicle() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllVehicles();
      setVehicles(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  const addVehicle = useCallback(async (data: Omit<Vehicle, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newVehicle = await createVehicle(data);
      setVehicles((prev) => [...prev, newVehicle]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  const editVehicle = useCallback(async (id: number, data: Partial<Vehicle>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateVehicle(id, data);
      setVehicles((prev) => prev.map(v => (v.id === id ? updated : v)));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  const removeVehicle = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteVehicle(id);
      setVehicles((prev) => prev.filter(v => v.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    error,
    fetchVehicles,
    addVehicle,
    editVehicle,
    removeVehicle,
  };
}
