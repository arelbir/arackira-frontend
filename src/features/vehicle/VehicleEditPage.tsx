import React from 'react';
import VehicleForm from './form/VehicleForm';
import { VehicleFormValues, vehicleSchema } from './vehicle-schema';
import { getAllVehicles, updateVehicle } from './vehicleService';
import ProtectedRoute from '@/components/ProtectedRoute';

// Dummy: Gerçek projede bu veri, route parametresiyle ID alınarak API'den çekilir.
const exampleInitialData: Partial<VehicleFormValues> = {
  plate_number: '34ABC123',
  branch_id: 1,
  vehicle_type_id: 1,
  brand_id: 1,
  model_id: 1,
  version: '1.5 TSI',
  package: 'Design',
  vehicle_group_id: 1,
  body_type: 'Sedan',
  fuel_type_id: 2,
  transmission_id: 1,
  model_year: 2024,
  color_id: 1,
  engine_power_hp: 100,
  engine_volume_cc: 1000,
  chassis_number: 'XYZ123456',
  engine_number: 'EN123456',
  first_registration_date: '2024-01-01',
  registration_document_number: 'REG123',
  vehicle_responsible_id: 1,
  vehicle_km: 5000,
  next_maintenance_date: '2025-01-01',
  inspection_expiry_date: '2026-01-01',
  insurance_expiry_date: '2025-06-01',
  casco_expiry_date: '2025-06-01',
  exhaust_stamp_expiry_date: '2025-06-01',
  acquisition_cost: 800000,
  acquisition_date: '2024-01-01',
  current_status: 'available',
  notes: 'Test notu',
  current_client_company_id: 1
};

const VehicleEditPage: React.FC = () => {
  
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Dummy: Gerçek projede route parametresinden ID alınır ve veri API'den çekilir
  const vehicleId = 1;

  const handleSubmit = async (data: VehicleFormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await updateVehicle(vehicleId, data);
      setSuccess('Araç başarıyla güncellendi!');
    } catch (e: any) {
      setError(e.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Araç Düzenle</h1>
        {success && <div className="mb-4 text-green-600">{success}</div>}
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <VehicleForm
          onSubmit={handleSubmit}
          loading={loading}
          initialData={exampleInitialData}
        />
      </div>
    </ProtectedRoute>
  );
};

export default VehicleEditPage;
