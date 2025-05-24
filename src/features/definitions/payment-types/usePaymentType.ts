// Ödeme Tipi işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllPaymentTypes, createPaymentType, updatePaymentType, deletePaymentType, PaymentType } from './paymentTypeService';

export function usePaymentType(token: string | null) {
  if (!token) {
    throw new Error('No authentication token provided');
  }
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPaymentTypes(token);
      setPaymentTypes(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addPaymentType = useCallback(async (data: Omit<PaymentType, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newPaymentType = await createPaymentType(data, token);
      setPaymentTypes(prev => [...prev, newPaymentType]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editPaymentType = useCallback(async (id: number, data: Omit<PaymentType, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updatePaymentType(id, data, token);
      setPaymentTypes(prev => prev.map(i => i.id === id ? updated : i));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removePaymentType = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deletePaymentType(id, token);
      setPaymentTypes(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchPaymentTypes();
  }, [fetchPaymentTypes]);

  return {
    paymentTypes,
    loading,
    error,
    fetchPaymentTypes,
    addPaymentType,
    editPaymentType,
    removePaymentType,
    setPaymentTypes,
    setError
  };
}
