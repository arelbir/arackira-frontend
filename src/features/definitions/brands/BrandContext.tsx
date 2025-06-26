import React, { createContext, useContext } from 'react';
import { useAllBrands } from './use-brands';
import type { Brand } from './brand-schema';

interface BrandContextType {
  brands: Brand[];
  loading: boolean;
  error: unknown | null;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

/**
 * Brand Provider Component
 * 
 * Model modülüyle tutarlılık için hooks bazlı yaklaşım kullanır
 * React Query'nin sağladığı state yönetimi özellikleri kullanılır
 */
export const BrandProvider = ({ children }: { children: React.ReactNode }) => {
  // useAllBrands hook'unu doğrudan kullanarak tüm marka verilerini çekme
  const brandsQuery = useAllBrands();
  
  // React Query ile alınan verilerden context değerini oluşturma
  const value: BrandContextType = {
    brands: brandsQuery.data || [],
    loading: brandsQuery.isLoading,
    error: brandsQuery.error
  };
  
  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
};

/**
 * Brand context hook'u
 */
export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error('useBrand must be used within a BrandProvider');
  return ctx;
}
