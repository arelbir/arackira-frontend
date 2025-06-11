// Lastik Pozisyonu işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllTirePositions, createTirePosition, updateTirePosition, deleteTirePosition, TirePosition } from './tirePositionService';

export function useTirePosition(token: string | null) {
  const [tirePositions, setTirePositions] = useState<TirePosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTirePositions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const data = await getAllTirePositions(token);
      setTirePositions(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addTirePosition = useCallback(async (data: Omit<TirePosition, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const newTirePosition = await createTirePosition(data, token);
      setTirePositions(prev => [...prev, newTirePosition]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editTirePosition = useCallback(async (id: number, data: Omit<TirePosition, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const updated = await updateTirePosition(id, data, token);
      setTirePositions(prev => prev.map(i => i.id === id ? updated : i));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removeTirePosition = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      await deleteTirePosition(id, token);
      setTirePositions(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchTirePositions();
  }, [fetchTirePositions]);

  return {
    tirePositions,
    loading,
    error,
    fetchTirePositions,
    addTirePosition,
    editTirePosition,
    removeTirePosition,
    setTirePositions,
    setError
  };
}
