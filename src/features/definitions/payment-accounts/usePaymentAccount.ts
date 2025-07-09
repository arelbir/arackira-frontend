// Ödeme Hesabı işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllPaymentAccounts, createPaymentAccount, updatePaymentAccount, deletePaymentAccount, PaymentAccount } from './paymentAccountService';

export function usePaymentAccount(token: string | null) {
  if (token === null) {
    throw new Error('No authentication token provided');
  }
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPaymentAccounts(token);
      setPaymentAccounts(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addPaymentAccount = useCallback(async (data: Omit<PaymentAccount, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newPaymentAccount = await createPaymentAccount(data, token);
      setPaymentAccounts(prev => [...prev, newPaymentAccount]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editPaymentAccount = useCallback(async (id: number, data: Omit<PaymentAccount, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updatePaymentAccount(id, data, token);
      setPaymentAccounts(prev => prev.map(i => i.id === id ? updated : i));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removePaymentAccount = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deletePaymentAccount(id, token);
      setPaymentAccounts(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchPaymentAccounts();
  }, [fetchPaymentAccounts]);

  return {
    paymentAccounts,
    loading,
    error,
    fetchPaymentAccounts,
    addPaymentAccount,
    editPaymentAccount,
    removePaymentAccount,
    setPaymentAccounts,
    setError
  };
}
