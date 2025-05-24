// Tedarikçi Kategorisi işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllSupplierCategories, createSupplierCategory, updateSupplierCategory, deleteSupplierCategory, SupplierCategory } from './supplierCategoryService';

export function useSupplierCategory(token: string | null) {
  if (token === null) {
    throw new Error('No authentication token provided');
  }
  const [supplierCategories, setSupplierCategories] = useState<SupplierCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSupplierCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllSupplierCategories(token);
      setSupplierCategories(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addSupplierCategory = useCallback(async (data: Omit<SupplierCategory, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newSupplierCategory = await createSupplierCategory(data, token);
      setSupplierCategories(prev => [...prev, newSupplierCategory]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const editSupplierCategory = useCallback(async (id: number, data: Omit<SupplierCategory, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateSupplierCategory(id, data, token);
      setSupplierCategories(prev => prev.map(i => i.id === id ? updated : i));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const removeSupplierCategory = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteSupplierCategory(id, token);
      setSupplierCategories(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchSupplierCategories();
  }, [fetchSupplierCategories]);

  return {
    supplierCategories,
    loading,
    error,
    fetchSupplierCategories,
    addSupplierCategory,
    editSupplierCategory,
    removeSupplierCategory,
    setSupplierCategories,
    setError
  };
}
