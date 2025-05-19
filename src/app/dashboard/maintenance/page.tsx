import ProtectedRoute from '@/components/ProtectedRoute';
import MaintenanceList from '@/features/maintenance/maintenance-list';

export default function MaintenancePage() {
  return (
    <ProtectedRoute>
      <MaintenanceList />
    </ProtectedRoute>
  );
}
