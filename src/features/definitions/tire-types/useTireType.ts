// Lastik Tipi işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllTireTypes, createTireType, updateTireType, deleteTireType, TireType } from './tireTypeService';

export function useTireType(token: string | null) {
  const [tireTypes, setTireTypes] = useState<TireType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTireTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const data = await getAllTireTypes(token);
      setTireTypes(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addTireType = useCallback(async (data: Omit<TireType, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const newTireType = await createTireType(data, token);
      setTireTypes(prev => [...prev, newTireType]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editTireType = useCallback(async (id: number, data: Omit<TireType, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const updated = await updateTireType(id, data, token);
      setTireTypes(prev => prev.map(i => i.id === id ? updated : i));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removeTireType = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      await deleteTireType(id, token);
      setTireTypes(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchTireTypes();
  }, [fetchTireTypes]);

  return {
    tireTypes,
    loading,
    error,
    fetchTireTypes,
    addTireType,
    editTireType,
    removeTireType,
    setTireTypes,
    setError
  };
}
