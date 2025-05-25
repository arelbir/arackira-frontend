import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getAllBrands, Brand } from './brandService';

interface BrandContextType {
  brands: Brand[];
  loading: boolean;
  error: string | null;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider = ({ children }: { children: React.ReactNode }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllBrands()
      .then(setBrands)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log('BrandProvider state', { brands, loading, error });
  }, [brands, loading, error]);

  const value = useMemo(() => ({ brands, loading, error }), [brands, loading, error]);
  // If you add any functions to value, wrap them with useCallback above and include in deps
  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
};

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error('useBrand must be used within a BrandProvider');
  return ctx;
}
