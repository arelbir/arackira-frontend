// Lastik Durumu işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllTireConditions, createTireCondition, updateTireCondition, deleteTireCondition, TireCondition } from './tireConditionService';

export function useTireCondition(token: string | null) {
  const [tireConditions, setTireConditions] = useState<TireCondition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTireConditions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const data = await getAllTireConditions(token);
      setTireConditions(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addTireCondition = useCallback(async (data: Omit<TireCondition, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const newTireCondition = await createTireCondition(data, token);
      setTireConditions(prev => [...prev, newTireCondition]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editTireCondition = useCallback(async (id: number, data: Omit<TireCondition, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const updated = await updateTireCondition(id, data, token);
      setTireConditions(prev => prev.map(i => i.id === id ? updated : i));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removeTireCondition = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      await deleteTireCondition(id, token);
      setTireConditions(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchTireConditions();
  }, [fetchTireConditions]);

  return {
    tireConditions,
    loading,
    error,
    fetchTireConditions,
    addTireCondition,
    editTireCondition,
    removeTireCondition,
    setTireConditions,
    setError
  };
}
