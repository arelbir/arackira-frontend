// Ajans işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllAgencies, createAgency, updateAgency, deleteAgency, Agency } from './agencyService';

export function useAgency(token: string | null) {
  if (!token) {
    throw new Error('No authentication token provided');
  }
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgencies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllAgencies(token);
      setAgencies(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addAgency = useCallback(async (data: Omit<Agency, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newAgency = await createAgency(data, token);
      setAgencies(prev => [...prev, newAgency]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editAgency = useCallback(async (id: number, data: Omit<Agency, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateAgency(id, data, token);
      setAgencies(prev => prev.map(i => i.id === id ? updated : i));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removeAgency = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteAgency(id, token);
      setAgencies(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchAgencies();
  }, [fetchAgencies]);

  return {
    agencies,
    loading,
    error,
    fetchAgencies,
    addAgency,
    editAgency,
    removeAgency,
    setAgencies,
    setError
  };
}
