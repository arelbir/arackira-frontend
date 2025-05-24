import { useCallback, useState } from "react";

export interface Insurance {
  id: number;
  insurance_type_id: number;
  insurance_company_id: number;
  agency_id: number;
  policy_number: string;
  tramer: string;
  start_date: string;
  end_date: string;
  policy_date: string;
  agency_number: string;
  amount: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  installment_count: number;
  payment_type_id: number;
  payment_account_id: number;
  create_payment_record: boolean;
  description: string;
}

export function useInsurance(token: string) {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsurances = useCallback(async (vehicleId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:4000/api/insurance?vehicle_id=${vehicleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Sigorta verileri alınamadı');
      const data = await res.json();
      setInsurances(data);
    } catch (e: any) {
      setError(e.message || 'Bir hata oluştu');
    }
    setLoading(false);
  }, [token]);

  const addInsurance = useCallback(async (insurance: Omit<Insurance, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:4000/api/insurance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(insurance),
      });
      if (!res.ok) throw new Error('Sigorta eklenemedi');
      await res.json();
    } catch (e: any) {
      setError(e.message || 'Bir hata oluştu');
    }
    setLoading(false);
  }, [token]);

  return { insurances, loading, error, fetchInsurances, addInsurance };
}
