import { useCallback, useEffect, useState } from 'react';
import { getAllBrands, createBrand, updateBrand, deleteBrand, Brand } from './brandService';

export function useBrand() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllBrands();
      setBrands(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  const addBrand = useCallback(async (data: Omit<Brand, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newBrand = await createBrand(data);
      setBrands((prev) => [...prev, newBrand]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  const editBrand = useCallback(async (id: number, data: Omit<Brand, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateBrand(id, data);
      setBrands((prev) => prev.map(b => (b.id === id ? updated : b)));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  const removeBrand = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteBrand(id);
      setBrands((prev) => prev.filter(b => b.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return {
    brands,
    loading,
    error,
    fetchBrands,
    addBrand,
    editBrand,
    removeBrand,
    setBrands,
    setError
  };
}
