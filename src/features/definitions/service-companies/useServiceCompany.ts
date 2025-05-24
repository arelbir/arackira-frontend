// Servis Şirketi işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllServiceCompanies, createServiceCompany, updateServiceCompany, deleteServiceCompany, ServiceCompany } from './serviceCompanyService';

export function useServiceCompany(token: string | null) {
  if (!token) {
    throw new Error('No authentication token provided');
  }
  const [serviceCompanies, setServiceCompanies] = useState<ServiceCompany[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServiceCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllServiceCompanies(token);
      setServiceCompanies(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addServiceCompany = useCallback(async (data: Omit<ServiceCompany, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newServiceCompany = await createServiceCompany(data, token);
      setServiceCompanies(prev => [...prev, newServiceCompany]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editServiceCompany = useCallback(async (id: number, data: Omit<ServiceCompany, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateServiceCompany(id, data, token);
      setServiceCompanies(prev => prev.map(i => i.id === id ? updated : i));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removeServiceCompany = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteServiceCompany(id, token);
      setServiceCompanies(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchServiceCompanies();
  }, [fetchServiceCompanies]);

  return {
    serviceCompanies,
    loading,
    error,
    fetchServiceCompanies,
    addServiceCompany,
    editServiceCompany,
    removeServiceCompany,
    setServiceCompanies,
    setError
  };
}
