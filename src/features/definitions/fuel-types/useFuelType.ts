// Yakıt Tipi işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllFuelTypes, createFuelType, updateFuelType, deleteFuelType, FuelType } from './fuelTypeService';

export function useFuelType(token: string) {
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFuelTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllFuelTypes(token);
      setFuelTypes(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addFuelType = useCallback(async (data: Omit<FuelType, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newFuelType = await createFuelType(data, token);
      setFuelTypes(prev => [...prev, newFuelType]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editFuelType = useCallback(async (id: number, data: Omit<FuelType, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateFuelType(id, data, token);
      setFuelTypes(prev => prev.map(f => f.id === id ? updated : f));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removeFuelType = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteFuelType(id, token);
      setFuelTypes(prev => prev.filter(f => f.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchFuelTypes();
  }, [fetchFuelTypes]);

  return {
    fuelTypes,
    loading,
    error,
    fetchFuelTypes,
    addFuelType,
    editFuelType,
    removeFuelType,
    setFuelTypes,
    setError
  };
}
