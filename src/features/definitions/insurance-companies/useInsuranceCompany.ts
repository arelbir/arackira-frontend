// Sigorta Şirketi işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllInsuranceCompanies, createInsuranceCompany, updateInsuranceCompany, deleteInsuranceCompany, InsuranceCompany } from './insuranceCompanyService';

export function useInsuranceCompany(token: string | null) {
  if (token === null) {
    throw new Error('No authentication token provided');
  }
  const [insuranceCompanies, setInsuranceCompanies] = useState<InsuranceCompany[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsuranceCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllInsuranceCompanies(token);
      setInsuranceCompanies(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addInsuranceCompany = useCallback(async (data: Omit<InsuranceCompany, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newInsuranceCompany = await createInsuranceCompany(data, token);
      setInsuranceCompanies(prev => [...prev, newInsuranceCompany]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editInsuranceCompany = useCallback(async (id: number, data: Omit<InsuranceCompany, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateInsuranceCompany(id, data, token);
      setInsuranceCompanies(prev => prev.map(i => i.id === id ? updated : i));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removeInsuranceCompany = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteInsuranceCompany(id, token);
      setInsuranceCompanies(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchInsuranceCompanies();
  }, [fetchInsuranceCompanies]);

  return {
    insuranceCompanies,
    loading,
    error,
    fetchInsuranceCompanies,
    addInsuranceCompany,
    editInsuranceCompany,
    removeInsuranceCompany,
    setInsuranceCompanies,
    setError
  };
}
