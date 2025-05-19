import { useEffect, useState } from 'react';
import { getAllVehicles } from '../features/vehicle/vehicleService';

export interface Vehicle {
  id: number;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
  [key: string]: any;
}

export function useVehicle() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVehicles() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllVehicles();
        setVehicles(data);
      } catch (err: any) {
        setError(err.message || 'Araçlar alınamadı');
      } finally {
        setLoading(false);
      }
    }
    fetchVehicles();
  }, []);

  return { vehicles, loading, error };
}
