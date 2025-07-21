'use client';

import Link from 'next/link';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { VehicleFormProvider } from '@/features/vehicle/create/context/VehicleFormProvider';
import { TabNavigator } from '@/features/vehicle/create/create-tabs/TabNavigator';


export default function VehicleCreatePage() {
  return (
    <VehicleFormProvider>
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" aria-label="Geri dön">
            <Link href="/dashboard/vehicles">
              <ArrowLeftIcon />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">Yeni Araç Oluştur</h1>
        </div>

        <TabNavigator />
      </div>
    </VehicleFormProvider>
  );
}
