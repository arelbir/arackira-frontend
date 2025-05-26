// Sigorta Tipi işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllInsuranceTypes, createInsuranceType, updateInsuranceType, deleteInsuranceType, InsuranceType } from './insuranceTypeService';

export function useInsuranceType(token: string | null) {
  if (!token) {
    throw new Error('No authentication token provided');
  }
  const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsuranceTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllInsuranceTypes(token);
      setInsuranceTypes(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addInsuranceType = useCallback(async (data: Omit<InsuranceType, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newInsuranceType = await createInsuranceType(data, token);
      setInsuranceTypes(prev => [...prev, newInsuranceType]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editInsuranceType = useCallback(async (id: number, data: Omit<InsuranceType, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateInsuranceType(id, data, token);
      setInsuranceTypes(prev => prev.map(i => i.id === id ? updated : i));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removeInsuranceType = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteInsuranceType(id, token);
      setInsuranceTypes(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchInsuranceTypes();
  }, [fetchInsuranceTypes]);

  return {
    insuranceTypes,
    loading,
    error,
    fetchInsuranceTypes,
    addInsuranceType,
    editInsuranceType,
    removeInsuranceType,
    setInsuranceTypes,
    setError
  };
}
