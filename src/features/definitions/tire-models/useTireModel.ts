// Lastik Modeli işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllTireModels, createTireModel, updateTireModel, deleteTireModel, TireModel } from './tireModelService';

export function useTireModel(token: string | null) {
  const [tireModels, setTireModels] = useState<TireModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTireModels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const data = await getAllTireModels(token);
      setTireModels(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addTireModel = useCallback(async (data: Omit<TireModel, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const newTireModel = await createTireModel(data, token);
      setTireModels(prev => [...prev, newTireModel]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editTireModel = useCallback(async (id: number, data: Omit<TireModel, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const updated = await updateTireModel(id, data, token);
      setTireModels(prev => prev.map(i => i.id === id ? updated : i));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removeTireModel = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      await deleteTireModel(id, token);
      setTireModels(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchTireModels();
  }, [fetchTireModels]);

  return {
    tireModels,
    loading,
    error,
    fetchTireModels,
    addTireModel,
    editTireModel,
    removeTireModel,
    setTireModels,
    setError
  };
}
