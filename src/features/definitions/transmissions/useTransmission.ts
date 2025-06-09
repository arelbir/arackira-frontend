// Vites Tipi işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllTransmissions, createTransmission, updateTransmission, deleteTransmission, Transmission } from './transmission-service';

export function useTransmission() {
  const [transmissions, setTransmissions] = useState<Transmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllTransmissions();
      setTransmissions(data);
    } catch (err: any) {
      setError(err.message || 'Vites tipleri alınamadı');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransmission = useCallback(async (data: Omit<Transmission, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newTransmission = await createTransmission(data);
      setTransmissions(prev => [...prev, newTransmission]);
      return newTransmission;
    } catch (err: any) {
      setError(err.message || 'Vites tipi eklenemedi');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editTransmission = useCallback(async (id: number, data: Partial<Omit<Transmission, 'id' | 'created_at'>>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateTransmission(id, data);
      setTransmissions(prev => prev.map(t => t.id === id ? updated : t));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Vites tipi güncellenemedi');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeTransmission = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTransmission(id);
      setTransmissions(prev => prev.filter(t => t.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Vites tipi silinemedi');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransmissions();
  }, [fetchTransmissions]);

  return {
    transmissions,
    loading,
    error,
    fetchTransmissions,
    addTransmission,
    editTransmission,
    removeTransmission,
    setTransmissions,
    setError
  };
}
