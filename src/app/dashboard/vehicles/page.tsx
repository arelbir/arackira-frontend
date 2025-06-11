

import VehicleList from '@/features/vehicle/VehicleList';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function VehiclesPage() {
  return (
    <ProtectedRoute>
      <VehicleList />
    </ProtectedRoute>
  );
}
