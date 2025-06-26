'use client';
// Tedarikçi işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllSuppliers, createSupplier, updateSupplier, deleteSupplier, Supplier } from './supplierService';

export function useSupplier(token: string | null) {
  if (token === null) {
    throw new Error('No authentication token provided');
  }
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchSuppliers = useCallback(async (page = 1, size = 10, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllSuppliers({
        ...filters,
        page,
        pageSize: size
      }, token);
      setSuppliers(response.data);
      setTotalItems(response.meta.total);
      setCurrentPage(page);
      setPageSize(size);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [token]);

  const addSupplier = useCallback(async (data: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newSupplier = await createSupplier(data, token);
      setSuppliers(prev => [...prev, newSupplier]);
      return newSupplier;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const editSupplier = useCallback(async (id: number, data: Partial<Omit<Supplier, 'id' | 'created_at' | 'updated_at'>>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateSupplier(id, data, token);
      setSuppliers(prev => prev.map(i => i.id === id ? updated : i));
      return updated;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const removeSupplier = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteSupplier(id, token);
      setSuppliers(prev => prev.filter(i => i.id !== id));
      return { success: true };
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSuppliers(currentPage, pageSize);
  }, [fetchSuppliers, currentPage, pageSize]);

  return {
    suppliers,
    loading,
    error,
    totalItems,
    currentPage,
    pageSize,
    fetchSuppliers,
    addSupplier,
    editSupplier,
    removeSupplier,
    setSuppliers,
    setError,
    setCurrentPage,
    setPageSize
  };
}
