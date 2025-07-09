

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { VehicleCreateProvider } from '@/features/vehicle/create/create-tabs/context/VehicleCreateProvider';
import { TabNavigator } from '@/features/vehicle/create/create-tabs/TabNavigator';
import { BasicTab } from '@/features/vehicle/create/create-tabs/tabs/BasicTab';
import { ReviewTab } from '@/features/vehicle/create/create-tabs/tabs/ReviewTab';
import { DatesTab } from '@/features/vehicle/create/create-tabs/tabs/DatesTab';
import { InsuranceTab } from '@/features/vehicle/create/create-tabs/tabs/InsuranceTab';
import { PurchaseTab } from '@/features/vehicle/create/create-tabs/tabs/PurchaseTab';
import { GPSTab } from '@/features/vehicle/create/create-tabs/tabs/GPSTab';
import { UttsTab } from '@/features/vehicle/create/create-tabs/tabs/UTTSTab';

interface VehicleEditPageProps {
  params: {
    id: string;
  };
}

export default function VehicleEditPage({ params }: VehicleEditPageProps) {
  // Next.js dinamik route parametrelerini async olmadan alıyoruz
  const vehicleId = parseInt(params.id, 10);
  
  if (isNaN(vehicleId)) {
    return notFound();
  }
  
  return (
    <VehicleCreateProvider editMode={true} vehicleToEdit={vehicleId}>
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" aria-label="Geri dön">
            <Link href="/dashboard/vehicles">
              <ArrowLeftIcon />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">Araç Düzenle (ID: {vehicleId})</h1>
        </div>

        <TabNavigator>    
          <BasicTab />
          <GPSTab />
          <PurchaseTab />
          <DatesTab />
          <InsuranceTab />
          <UttsTab />
          <ReviewTab />
        </TabNavigator>
      </div>
    </VehicleCreateProvider>
  );
}
