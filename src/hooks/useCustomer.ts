import { useState, useCallback, useEffect } from 'react';
import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  Customer
} from '@/features/customer/customerService';
import { CustomerFormValues } from '@/features/customer/utils/customer-schema';

export interface UseCustomerResult {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  addCustomer: (data: CustomerFormValues) => Promise<void>;
  editCustomer: (id: number, data: CustomerFormValues) => Promise<void>;
  removeCustomer: (id: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useCustomer(): UseCustomerResult {
  // Hook mount olduğunda müşteri listesini otomatik çek
  const [state, setState] = useState<{
    customers: Customer[];
    loading: boolean;
    error: string | null;
  }>({
    customers: [],
    loading: false,
    error: null
  });

  const setLoading = (loading: boolean) =>
    setState((prev) => ({ ...prev, loading }));
  const setError = (error: string | null) =>
    setState((prev) => ({ ...prev, error }));
  const setCustomers = (customers: Customer[]) =>
    setState((prev) => ({ ...prev, customers }));

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCustomers();
      // Her müşteri objesine active alanı ekle (varsayılanı true)
      const normalized = data.map((c) => ({
        ...c,
        active: typeof c.active === 'boolean' ? c.active : true,
      }));
      setCustomers(normalized);
    } catch (e: any) {
      setError(e.message || 'Müşteriler alınamadı');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCustomer = useCallback(
    async (data: CustomerFormValues) => {
      setLoading(true);
      setError(null);
      try {
        await createCustomer(data);
        await fetchCustomers();
      } catch (e: any) {
        setError(e.message || 'Müşteri eklenemedi');
      } finally {
        setLoading(false);
      }
    },
    [fetchCustomers]
  );

  const editCustomer = useCallback(
    async (id: number, data: CustomerFormValues) => {
      setLoading(true);
      setError(null);
      try {
        await updateCustomer(id, data);
        await fetchCustomers();
      } catch (e: any) {
        setError(e.message || 'Müşteri güncellenemedi');
      } finally {
        setLoading(false);
      }
    },
    [fetchCustomers]
  );

  const removeCustomer = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        await deleteCustomer(id);
        await fetchCustomers();
      } catch (e: any) {
        setError(e.message || 'Müşteri silinemedi');
      } finally {
        setLoading(false);
      }
    },
    [fetchCustomers]
  );

  // İlk mount'ta müşteri listesini çek
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers: state.customers,
    loading: state.loading,
    error: state.error,
    fetchCustomers,
    addCustomer,
    editCustomer,
    removeCustomer,
    refetch: fetchCustomers
  };
}
