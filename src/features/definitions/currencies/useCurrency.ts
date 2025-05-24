// Para Birimi işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllCurrencies, createCurrency, updateCurrency, deleteCurrency, Currency } from './currencyService';

export function useCurrency(token: string | null) {
  if (!token) {
    throw new Error('No authentication token provided');
  }
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrencies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCurrencies(token);
      setCurrencies(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addCurrency = useCallback(async (data: Omit<Currency, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newCurrency = await createCurrency(data, token);
      setCurrencies(prev => [...prev, newCurrency]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editCurrency = useCallback(async (id: number, data: Omit<Currency, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateCurrency(id, data, token);
      setCurrencies(prev => prev.map(i => i.id === id ? updated : i));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removeCurrency = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteCurrency(id, token);
      setCurrencies(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  return {
    currencies,
    loading,
    error,
    fetchCurrencies,
    addCurrency,
    editCurrency,
    removeCurrency,
    setCurrencies,
    setError
  };
}
