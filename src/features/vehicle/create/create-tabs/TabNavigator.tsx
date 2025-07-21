'use client';

'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useWatch } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useVehicleFormContext } from '@/features/vehicle/create/context/VehicleFormProvider';
import { useVehicleMutation } from '@/features/vehicle/hooks/useVehicleMutation';
import { VehicleFormValues } from '../../schemas';
import { BasicTab } from './tabs/BasicTab';
import { PurchaseTab } from './tabs/PurchaseTab';
import { UttsTab } from './tabs/UTTSTab';
import { ReviewTab } from './tabs/ReviewTab';
import { GPSTab } from './tabs/gps/GPSTab';
import { InspectionTab } from './tabs/inspection/InspectionTab';
import { InsuranceTab } from './tabs/insurance/InsuranceTab';
import { HGSTab } from './tabs/hgs/HGSTab';

// Statik sekme tanımlamaları
const tabDefs = [
  { id: 'basic', label: 'Genel Bilgiler', Component: BasicTab },
  { id: 'purchase', label: 'Satınalma', Component: PurchaseTab },
  { id: 'gps', label: 'GPS', Component: GPSTab },
  { id: 'inspection', label: 'Muayene', Component: InspectionTab },
  { id: 'insurance', label: 'Sigorta', Component: InsuranceTab },
  { id: 'hgs', label: 'HGS', Component: HGSTab },
  { id: 'utts', label: 'UTTS', Component: UttsTab },
  { id: 'review', label: 'Özet', Component: ReviewTab },
] as const;

type TabId = typeof tabDefs[number]['id'];

export const TabNavigator = () => {
  const [activeTab, setActiveTab] = useState<TabId>(tabDefs[0].id);
  const contentRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const vehicleId = params.id ? parseInt(params.id as string, 10) : undefined;

  const { handleSubmit, control } = useVehicleFormContext();
  const { createVehicle, updateVehicle, isCreating, isUpdating } = useVehicleMutation();
  const isSaving = isCreating || isUpdating;

  const chassisNumber = useWatch({ control, name: 'chassis_number' });
  const isChassisValid = !!chassisNumber && chassisNumber.trim().length >= 5;

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeTab]);

  const onSave = (data: VehicleFormValues) => {
    if (vehicleId) {
      updateVehicle(vehicleId, data);
    } else {
      createVehicle(data);
    }
  };

  const onInvalid = () => {
    // Hata yönetimi
  };

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabId)}>
      <div className="sticky top-0 z-30 bg-background/95 p-4 mb-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {vehicleId ? 'Araç Düzenle' : 'Yeni Araç Oluştur'}
          </h2>
          <Button onClick={handleSubmit(onSave, onInvalid)} disabled={!isChassisValid || isSaving}>
            {isSaving ? 'Kaydediliyor...' : vehicleId ? 'Değişiklikleri Kaydet' : 'Aracı Kaydet'}
          </Button>
        </div>

        {!isChassisValid && (
          <div className="w-full text-center text-xs text-destructive pb-2">
            Diğer sekmelere geçmek ve aracı kaydetmek için lütfen &apos;Genel Bilgiler&apos; sekmesindeki Şasi Numarasını girin.
          </div>
        )}

        <TabsList className="w-full overflow-x-auto overflow-y-hidden justify-start h-auto">
          {tabDefs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              disabled={(!isChassisValid && tab.id !== 'basic') || isSaving}
              className="flex-shrink-0"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div ref={contentRef} className="p-4 md:p-0">
        {tabDefs.map(({ id, Component }) => (
          <TabsContent key={id} value={id} className="m-0 p-0">
            <Card className="p-6 mt-2 mb-10 shadow-lg w-full mx-auto">
                            {(() => {
                const props: any = {};
                if (['gps', 'hgs', 'inspection', 'insurance'].includes(id)) {
                  props.onSubmit = onSave;
                }
                return <Component {...props} />;
              })()}
            </Card>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};
