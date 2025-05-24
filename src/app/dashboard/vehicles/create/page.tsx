// Araç ekleme sayfası route'u
import VehicleCreatePage from '@/features/vehicle/VehicleCreatePage';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function VehiclesCreateRoute() {
  return (
    <ProtectedRoute>
      <VehicleCreatePage />
    </ProtectedRoute>
  );
}
