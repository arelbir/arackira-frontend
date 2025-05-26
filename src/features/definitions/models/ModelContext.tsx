import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getAllModels, Model } from './modelService';

interface ModelContextType {
  models: Model[];
  loading: boolean;
  error: string | null;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const ModelProvider = ({ children }: { children: React.ReactNode }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllModels()
      .then(setModels)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log('ModelProvider state', { models, loading, error });
  }, [models, loading, error]);

  const value = useMemo(() => ({ models, loading, error }), [models, loading, error]);

  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
};

export function useModel() {
  const ctx = useContext(ModelContext);
  if (!ctx) throw new Error('useModel must be used within a ModelProvider');
  return ctx;
}
