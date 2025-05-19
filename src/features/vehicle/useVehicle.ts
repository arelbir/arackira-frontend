'use client';
import { useState, useEffect } from 'react';
import {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from './vehicleService';

export function useVehicle() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllVehicles()
      .then((data) => {
        setVehicles(data || []);
        setError(null);
      })
      .catch((err) => {
        setError('Araçlar yüklenemedi');
      })
      .finally(() => setLoading(false));
  }, []);

  async function addVehicle(vehicle: any) {
    setLoading(true);
    setError(null);
    try {
      const newVehicle = await createVehicle(vehicle);
      setVehicles((prev) => [...prev, newVehicle]);
      return newVehicle;
    } catch (err) {
      setError('Araç eklenemedi');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function editVehicle(id: number, updates: any) {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateVehicle(id, updates);
      setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
      return updated;
    } catch (err) {
      setError('Araç güncellenemedi');
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
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      setError('Araç silinemedi');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { vehicles, loading, error, addVehicle, editVehicle, removeVehicle };
}
