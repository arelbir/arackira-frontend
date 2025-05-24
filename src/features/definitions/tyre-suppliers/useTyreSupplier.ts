// Tedarikçi işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllTyreSuppliers, createTyreSupplier, updateTyreSupplier, deleteTyreSupplier, TyreSupplier } from './tyreSupplierService';

export function useTyreSupplier(token: string | null) {
  const [tyreSuppliers, setTyreSuppliers] = useState<TyreSupplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTyreSuppliers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const data = await getAllTyreSuppliers(token);
      setTyreSuppliers(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addTyreSupplier = useCallback(async (data: Omit<TyreSupplier, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const newTyreSupplier = await createTyreSupplier(data, token);
      setTyreSuppliers(prev => [...prev, newTyreSupplier]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editTyreSupplier = useCallback(async (id: number, data: Omit<TyreSupplier, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      const updated = await updateTyreSupplier(id, data, token);
      setTyreSuppliers(prev => prev.map(i => i.id === id ? updated : i));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removeTyreSupplier = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('Kullanıcı oturumu bulunamadı');
      await deleteTyreSupplier(id, token);
      setTyreSuppliers(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchTyreSuppliers();
  }, [fetchTyreSuppliers]);

  return {
    tyreSuppliers,
    loading,
    error,
    fetchTyreSuppliers,
    addTyreSupplier,
    editTyreSupplier,
    removeTyreSupplier,
    setTyreSuppliers,
    setError
  };
}
