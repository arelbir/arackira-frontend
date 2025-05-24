// Servis Tipi işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllServiceTypes, createServiceType, updateServiceType, deleteServiceType, ServiceType } from './serviceTypeService';

export function useServiceType(token: string | null) {
  if (!token) {
    throw new Error('No authentication token provided');
  }
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServiceTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllServiceTypes(token);
      setServiceTypes(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addServiceType = useCallback(async (data: Omit<ServiceType, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newServiceType = await createServiceType(data, token);
      setServiceTypes(prev => [...prev, newServiceType]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editServiceType = useCallback(async (id: number, data: Omit<ServiceType, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateServiceType(id, data, token);
      setServiceTypes(prev => prev.map(i => i.id === id ? updated : i));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removeServiceType = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteServiceType(id, token);
      setServiceTypes(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchServiceTypes();
  }, [fetchServiceTypes]);

  return {
    serviceTypes,
    loading,
    error,
    fetchServiceTypes,
    addServiceType,
    editServiceType,
    removeServiceType,
    setServiceTypes,
    setError
  };
}
