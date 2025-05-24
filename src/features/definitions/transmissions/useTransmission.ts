// Vites Tipi işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllTransmissions, createTransmission, updateTransmission, deleteTransmission, Transmission } from './transmissionService';

export function useTransmission(token: string) {
  const [transmissions, setTransmissions] = useState<Transmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllTransmissions(token);
      setTransmissions(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addTransmission = useCallback(async (data: Omit<Transmission, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newTransmission = await createTransmission(data, token);
      setTransmissions(prev => [...prev, newTransmission]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editTransmission = useCallback(async (id: number, data: Omit<Transmission, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateTransmission(id, data, token);
      setTransmissions(prev => prev.map(t => t.id === id ? updated : t));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removeTransmission = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTransmission(id, token);
      setTransmissions(prev => prev.filter(t => t.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

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
