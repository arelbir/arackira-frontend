import { useCallback, useEffect, useState } from 'react';
import { getAllCustomers, createCustomer, updateCustomer, deleteCustomer, Customer } from '../customerService';

export function useCustomer() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  const addCustomer = useCallback(async (data: Omit<Customer, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newCustomer = await createCustomer(data);
      setCustomers((prev) => [...prev, newCustomer]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  const editCustomer = useCallback(async (id: number, data: Omit<Customer, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateCustomer(id, data);
      setCustomers((prev) => prev.map(c => (c.id === id ? updated : c)));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  const removeCustomer = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter(c => c.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    editCustomer,
    removeCustomer,
  };
}
