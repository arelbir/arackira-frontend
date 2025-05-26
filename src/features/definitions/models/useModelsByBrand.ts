import { useState, useEffect } from 'react';
import { getModelsByBrand, Model } from './modelService';

export function useModelsByBrand(brandId: number | null) {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!brandId) {
      setModels([]);
      return;
    }
    setLoading(true);
    setError(null);
    getModelsByBrand(brandId)
      .then(setModels)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [brandId]);

  return { models, loading, error };
}
