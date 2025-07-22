import { useState } from 'react';
import { toast } from 'sonner';
import { VehicleService } from '../services/VehicleService';
import { VehicleFormValues } from '../schemas';

export const useVehicleMutation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const createVehicle = async (data: VehicleFormValues) => {
    setIsCreating(true);
    try {
      const promise = VehicleService.submitWithRelated(data, false).then(response => {
        if (response.errors && Object.keys(response.errors).length > 0) {
          const errorMessages = Object.entries(response.errors)
            .map(([key, value]) => `${key}: ${value.map((e: any) => e.error || JSON.stringify(e)).join(', ')}`)
            .join('; ');
          throw new Error(`Kayıt tamamlanamadı: ${errorMessages}`);
        }
        return response;
      });

      await toast.promise(promise, {
        loading: 'Araç oluşturuluyor...',
        success: () => {
          window.location.reload();
          return 'Araç başarıyla oluşturuldu!';
        },
        error: (err) => err.message || 'Araç oluşturulurken bir hata oluştu.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const updateVehicle = async (id: number, data: VehicleFormValues) => {
    setIsUpdating(true);
    try {
      const promise = VehicleService.submitWithRelated(data, true, id).then(response => {
        if (response.errors && Object.keys(response.errors).length > 0) {
          const errorMessages = Object.entries(response.errors)
            .map(([key, value]) => `${key}: ${value.map((e: any) => e.error || JSON.stringify(e)).join(', ')}`)
            .join('; ');
          throw new Error(`Güncelleme tamamlanamadı: ${errorMessages}`);
        }
        return response;
      });

      await toast.promise(promise, {
        loading: 'Araç güncelleniyor...',
        success: () => {
          window.location.reload();
          return 'Araç başarıyla güncellendi!';
        },
        error: (err) => err.message || 'Araç güncellenirken bir hata oluştu.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return { createVehicle, updateVehicle, isCreating, isUpdating };
};
