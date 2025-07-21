

'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { VehicleFormProvider } from '@/features/vehicle/create/context/VehicleFormProvider';
import { useVehicleQuery } from '@/features/vehicle/hooks/useVehicleQuery';
import { TabNavigator } from '@/features/vehicle/create/create-tabs/TabNavigator';


function VehicleEditForm({ vehicleId }: { vehicleId: number }) {
  const { vehicleData: vehicle, error, isLoading } = useVehicleQuery(vehicleId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="p-8 text-center text-destructive">
        Araç verileri yüklenirken bir hata oluştu veya araç bulunamadı.
      </div>
    );
  }



  return (
    <VehicleFormProvider defaultValues={vehicle}>
      <TabNavigator />
    </VehicleFormProvider>
  );
}

export default function VehicleEditPage() {
  const params = useParams();
  const vehicleId = parseInt(params.id as string, 10);

  if (isNaN(vehicleId)) {
    return notFound();
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="icon" aria-label="Geri dön">
          <Link href="/dashboard/vehicles">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold">Aracı Düzenle</h1>
      </div>
      <VehicleEditForm vehicleId={vehicleId} />
    </div>
  );
}
