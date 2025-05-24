// Model state ve işlemleri için custom hook
import { useCallback, useEffect, useState } from 'react';
import { getAllModels, createModel, updateModel, deleteModel, Model } from './modelService';
import { getAllBrands, Brand } from '../brands/brandService';

export function useModel() {
  const [models, setModels] = useState<Model[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modelleri çek
  const fetchModels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllModels();
      setModels(data);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  // Markaları çek (brand select için)
  const fetchBrands = useCallback(async () => {
    try {
      const data = await getAllBrands();
      setBrands(data);
    } catch (e: any) {
      // Brand çekilemezse formda select boş kalır
    }
  }, []);

  const addModel = useCallback(async (data: Omit<Model, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newModel = await createModel(data);
      setModels((prev) => [...prev, newModel]);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  const editModel = useCallback(async (id: number, data: Partial<Omit<Model, 'id' | 'created_at'>>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateModel(id, data);
      setModels((prev) => prev.map(m => (m.id === id ? updated : m)));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  const removeModel = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteModel(id);
      setModels((prev) => prev.filter(m => m.id !== id));
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchModels();
    fetchBrands();
  }, [fetchModels, fetchBrands]);

  return {
    models,
    brands,
    loading,
    error,
    addModel,
    editModel,
    removeModel,
    setError,
    fetchModels
  };
}
