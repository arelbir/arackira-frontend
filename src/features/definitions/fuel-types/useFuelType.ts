// Yakıt Tipi işlemleri için custom hook
import { useCallback, useState, useEffect } from 'react';
import { getAllFuelTypes, createFuelType, updateFuelType, deleteFuelType, FuelType } from './fuel-type-service';

export function useFuelType() {
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFuelTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllFuelTypes();
      setFuelTypes(data);
    } catch (err: any) {
      setError(err.message || 'Yakıt tipleri alınamadı');
    } finally {
      setLoading(false);
    }
  }, []);

  const addFuelType = useCallback(
    async (fuelTypeData: Omit<FuelType, 'id' | 'created_at'>) => {
      setLoading(true);
      setError(null);
      try {
        const newFuelType = await createFuelType(fuelTypeData);
        setFuelTypes((prev) => [...prev, newFuelType]);
        return newFuelType;
      } catch (err: any) {
        setError(err.message || 'Yakıt tipi eklenemedi');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateFuelTypeById = useCallback(
    async (id: number, fuelTypeData: Partial<Omit<FuelType, 'id' | 'created_at'>>) => {
      setLoading(true);
      setError(null);
      try {
        const updatedFuelType = await updateFuelType(id, fuelTypeData);
        setFuelTypes((prev) =>
          prev.map((item) => (item.id === id ? updatedFuelType : item))
        );
        return updatedFuelType;
      } catch (err: any) {
        setError(err.message || 'Yakıt tipi güncellenemedi');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeFuelType = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        await deleteFuelType(id);
        setFuelTypes((prev) => prev.filter((item) => item.id !== id));
        return true;
      } catch (err: any) {
        setError(err.message || 'Yakıt tipi silinemedi');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchFuelTypes();
  }, [fetchFuelTypes]);

  return {
    fuelTypes,
    loading,
    error,
    fetchFuelTypes,
    addFuelType,
    editFuelType: updateFuelTypeById,
    removeFuelType,
    setFuelTypes,
    setError
  };
}
