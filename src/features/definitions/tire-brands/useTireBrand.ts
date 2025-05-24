// Lastik Markası işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllTireBrands, createTireBrand, updateTireBrand, deleteTireBrand, TireBrand } from './tireBrandService';

export function useTireBrand(token: string | null) {
  const [tireBrands, setTireBrands] = useState<TireBrand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTireBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const data = await getAllTireBrands(token);
      setTireBrands(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addTireBrand = useCallback(async (data: Omit<TireBrand, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const newTireBrand = await createTireBrand(data, token);
      setTireBrands(prev => [...prev, newTireBrand]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editTireBrand = useCallback(async (id: number, data: Omit<TireBrand, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const updated = await updateTireBrand(id, data, token);
      setTireBrands(prev => prev.map(i => i.id === id ? updated : i));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removeTireBrand = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      await deleteTireBrand(id, token);
      setTireBrands(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchTireBrands();
  }, [fetchTireBrands]);

  return {
    tireBrands,
    loading,
    error,
    fetchTireBrands,
    addTireBrand,
    editTireBrand,
    removeTireBrand,
    setTireBrands,
    setError
  };
}
