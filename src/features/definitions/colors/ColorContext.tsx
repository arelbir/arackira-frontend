import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getAllColors, Color } from './colorService';

interface ColorContextType {
  colors: Color[];
  loading: boolean;
  error: string | null;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export const ColorProvider = ({ children }: { children: React.ReactNode }) => {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllColors()
      .then(setColors)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log('ColorProvider state', { colors, loading, error });
  }, [colors, loading, error]);

  const value = useMemo(() => ({ colors, loading, error }), [colors, loading, error]);

  return <ColorContext.Provider value={value}>{children}</ColorContext.Provider>;
};

export function useColor() {
  const ctx = useContext(ColorContext);
  if (!ctx) throw new Error('useColor must be used within a ColorProvider');
  return ctx;
}
