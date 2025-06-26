'use client';

import React, { createContext, useContext } from 'react';
import { useAllColors } from './use-colors';
import type { Color } from './color-schema';

interface ColorContextType {
  colors: Color[];
  loading: boolean;
  error: unknown | null;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

/**
 * Color Provider Component
 * 
 * Model ve Brand modülleriyle tutarlılık için hooks bazlı yaklaşım kullanır
 * React Query'nin sağladığı state yönetimi özellikleri kullanılır
 */
export const ColorProvider = ({ children }: { children: React.ReactNode }) => {
  // useAllColors hook'unu doğrudan kullanarak tüm renk verilerini çekme
  const colorsQuery = useAllColors();
  
  // React Query ile alınan verilerden context değerini oluşturma
  const value: ColorContextType = {
    colors: colorsQuery.data || [],
    loading: colorsQuery.isLoading,
    error: colorsQuery.error
  };
  
  return <ColorContext.Provider value={value}>{children}</ColorContext.Provider>;
};

/**
 * Color context hook'u
 */
export function useColor() {
  const ctx = useContext(ColorContext);
  if (!ctx) throw new Error('useColor must be used within a ColorProvider');
  return ctx;
}
