"use client";

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import VehicleCreateTabs from './VehicleCreateTabs';
import { VehicleProvider } from './context/VehicleContext';
import { useVehicleForm } from './hooks/useVehicleForm';
import { Button } from '@/components/ui/button';
import { SaveIcon, ArrowLeftIcon } from 'lucide-react';
import { toast } from 'sonner';

interface VehicleCreatePageProps {
  vehicleId?: number;  // Düzenleme için
}

const VehicleCreatePage: React.FC<VehicleCreatePageProps> = ({ vehicleId }) => {
  const router = useRouter();
  const { form, handleSubmit, isSubmitting, isDirty } = useVehicleForm(vehicleId);

  const onSave = async () => {
    try {
      await handleSubmit();
      // Başarılı kayıt sonrası araçlar listesine yönlendir
      toast.success(vehicleId ? "Araç güncellendi" : "Araç kaydedildi", {
        description: "İşlem başarıyla tamamlandı."
      });
      router.push('/dashboard/vehicles');
    } catch (error) {
      // Hata işleme useVehicleForm hook'unda yapılıyor
      console.error("Form gönderimi sırasında hata:", error);
    }
  };

  return (
    <ProtectedRoute>
      <VehicleProvider vehicleId={vehicleId}>
        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              {vehicleId ? "Araç Düzenle" : "Yeni Araç Ekle"}
            </h2>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard/vehicles')}
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                İptal
              </Button>
              <Button 
                onClick={onSave} 
                disabled={isSubmitting || !isDirty}
              >
                <SaveIcon className="mr-2 h-4 w-4" />
                Kaydet
              </Button>
            </div>
          </div>
          
          <VehicleCreateTabs form={form} />
          
        </div>
      </VehicleProvider>
    </ProtectedRoute>
  );
};

export default VehicleCreatePage;
