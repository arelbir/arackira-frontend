// Renkler için hook (mantık: useVehicle gibi merkezi state ve işlemler)
import { useCallback, useEffect, useState, useMemo } from 'react';

export interface Color {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

import {
  getAllColors,
  createColor,
  updateColor,
  deleteColor
} from './colorService';

export function useColor() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchColors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllColors();
      setColors(data);
    } catch (err) {
      setError('Renkler alınamadı');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debug logs for diagnosis
  console.log('useColor: fetchColors ref', fetchColors);
  console.log('useColor: colors ref', colors);



  const addColor = useCallback(async (data: Omit<Color, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newColor = await createColor(data);
      setColors((prev) => [...prev, newColor]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  const editColor = useCallback(async (id: number, data: Partial<Color>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateColor(id, data);
      setColors((prev) => prev.map((c) => c.id === id ? updated : c));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  const removeColor = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteColor(id);
      setColors((prev) => prev.filter((c) => c.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchColors();
  }, []);

  const memoColors = useMemo(() => colors, [colors]);
  return {
    colors: memoColors,
    loading,
    error,
    addColor,
    editColor,
    removeColor,
    refetch: fetchColors,
    setColors,
    setError
  };
}
