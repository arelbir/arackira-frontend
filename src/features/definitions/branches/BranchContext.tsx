import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getAllBranches, Branch } from './branchService';

interface BranchContextType {
  branches: Branch[];
  loading: boolean;
  error: string | null;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const BranchProvider = ({ children }: { children: React.ReactNode }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllBranches()
      .then(setBranches)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log('BranchProvider state', { branches, loading, error });
  }, [branches, loading, error]);

  const value = useMemo(() => ({ branches, loading, error }), [branches, loading, error]);

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
};

export function useBranch() {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error('useBranch must be used within a BranchProvider');
  return ctx;
}
