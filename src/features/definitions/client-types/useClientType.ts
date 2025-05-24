// Client Type state ve işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllClientTypes, createClientType, updateClientType, deleteClientType, ClientType } from './clientTypeService';

export function useClientType(token: string) {
  const [clientTypes, setClientTypes] = useState<ClientType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClientTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllClientTypes(token);
      setClientTypes(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addClientType = useCallback(async (data: Omit<ClientType, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newClientType = await createClientType(data, token);
      setClientTypes(prev => [...prev, newClientType]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editClientType = useCallback(async (id: number, data: Omit<ClientType, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateClientType(id, data, token);
      setClientTypes(prev => prev.map(c => c.id === id ? updated : c));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removeClientType = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteClientType(id, token);
      setClientTypes(prev => prev.filter(c => c.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchClientTypes();
  }, [fetchClientTypes]);

  return {
    clientTypes,
    loading,
    error,
    fetchClientTypes,
    addClientType,
    editClientType,
    removeClientType,
    setClientTypes,
    setError
  };
}
