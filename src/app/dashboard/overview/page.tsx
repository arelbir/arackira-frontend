import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardHeader from '@/components/DashboardHeader';

import ActiveVehicleCountWidget from '@/features/reports/ActiveVehicleCountWidget';
import VehicleListWidget from '@/features/reports/VehicleListWidget';
import RentalCountByClientWidget from '@/features/reports/RentalCountByClientWidget';
import VehiclesInMaintenanceWidget from '@/features/reports/VehiclesInMaintenanceWidget';

export default function OverviewPage() {
  return (
    <ProtectedRoute>
      <div className='w-full'>
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2'>
          <section className='flex flex-col gap-2'>
            <h3 className='mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100'>
              Aktif Araçlar
            </h3>
            <ActiveVehicleCountWidget />
            <VehiclesInMaintenanceWidget />
          </section>
          <section className='flex flex-col gap-2'>
            <h3 className='mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100'>
              Kiralama ve Liste
            </h3>
            <RentalCountByClientWidget />
            <VehicleListWidget />
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
