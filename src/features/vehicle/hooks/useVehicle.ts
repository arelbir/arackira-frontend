"use client"


import { useCallback, useEffect, useState } from 'react';
// NOT: Aşağıdaki servis fonksiyonları gerçek API'nize göre güncellenmeli
import { getAllVehicles, createVehicle, updateVehicle, Vehicle, deleteDraftVehicle, deleteVehicle } from '../vehicleService'; // deleteVehicle eklendi

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

  // Hem normal hem taslak araç silme destekleniyor. isDraft parametresi ile ayrım yapılır.
  const removeVehicle = useCallback(async (id: number, isDraft: boolean) => {
    setLoading(true);
    setError(null);
    try {
      if (isDraft) {
        await deleteDraftVehicle(id);
      } else {
        await deleteVehicle(id);
      }
      setVehicles((prev) => prev.filter(v => v.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
