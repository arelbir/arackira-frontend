

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { VehicleCreateProvider } from '@/features/vehicle/create/create-tabs/context/VehicleCreateProvider';
import { TabNavigator } from '@/features/vehicle/create/create-tabs/TabNavigator';
import { BasicTab } from '@/features/vehicle/create/create-tabs/tabs/BasicTab';
import { ReviewTab } from '@/features/vehicle/create/create-tabs/tabs/ReviewTab';

import { InsuranceTab } from '@/features/vehicle/create/create-tabs/tabs/insurance/InsuranceTab';
import { InspectionTab } from '@/features/vehicle/create/create-tabs/tabs/inspection/InspectionTab';
import { PurchaseTab } from '@/features/vehicle/create/create-tabs/tabs/PurchaseTab';
import { GPSTab } from '@/features/vehicle/create/create-tabs/tabs/gps/GPSTab';
import { UttsTab } from '@/features/vehicle/create/create-tabs/tabs/UTTSTab';

interface VehicleEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

import { getVehicle } from '@/features/vehicle/services/VehicleService';

export default async function VehicleEditPage({ params: paramsPromise }: VehicleEditPageProps) {
  const params = await paramsPromise;
  const vehicleId = parseInt(params.id, 10);

  if (isNaN(vehicleId)) {
    return notFound();
  }

  // Sunucu tarafında araç verilerini çek
  const vehicleData = await getVehicle(vehicleId);

  if (!vehicleData) {
    return notFound();
  }

  return (
    <VehicleCreateProvider editMode={true} vehicleToEdit={vehicleData}>
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" aria-label="Geri dön">
            <Link href="/dashboard/vehicles">
              <ArrowLeftIcon />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">Araç Düzenle: {vehicleData.plate}</h1>
        </div>

        <TabNavigator>    
          <BasicTab />
          <GPSTab />
          <PurchaseTab />

          <InspectionTab />
          <InsuranceTab />
          <UttsTab />
          <ReviewTab />
        </TabNavigator>
      </div>
    </VehicleCreateProvider>
  );
}
