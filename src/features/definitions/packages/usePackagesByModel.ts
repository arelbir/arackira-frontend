import { useState, useEffect } from 'react';
import { getPackagesByModel, VehiclePackage } from './packageService';

export function usePackagesByModel(modelId: number | null) {
  const [packages, setPackages] = useState<VehiclePackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!modelId) {
      setPackages([]);
      return;
    }
    setLoading(true);
    setError(null);
    getPackagesByModel(modelId)
      .then(setPackages)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [modelId]);

  return { packages, loading, error };
}
