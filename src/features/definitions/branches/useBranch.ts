// Şubeler için hook
import { useCallback, useEffect, useState } from 'react';

export interface Branch {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  created_at: string;
}

import {
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch
} from './branchService';

export function useBranch() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllBranches();
      setBranches(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  const addBranch = useCallback(async (data: Omit<Branch, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newBranch = await createBranch(data);
      setBranches((prev) => [...prev, newBranch]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  const editBranch = useCallback(async (id: number, data: Partial<Branch>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateBranch(id, data);
      setBranches((prev) => prev.map((b) => b.id === id ? updated : b));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  const removeBranch = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteBranch(id);
      setBranches((prev) => prev.filter((b) => b.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return {
    branches,
    loading,
    error,
    fetchBranches,
    addBranch,
    editBranch,
    removeBranch,
  };
}
