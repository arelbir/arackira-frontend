"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormDatePicker } from '../../../../../../components/ui/form-date-picker';
import { FormSwitchField } from "@/components/ui/form-switch-field";
import { useFormContext } from "react-hook-form";
import { VehicleFormValues } from '@/features/vehicle/schemas/vehicle.schemas';

interface HGSFormProps {
  index: number;
}

export function HGSForm({ index }: HGSFormProps) {
  const { control } = useFormContext<VehicleFormValues>();

  return (
    <div className="border p-4 rounded-md my-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormInput
          control={control}
          name={`hgs.${index}.hgs_tag_no`}
          label="HGS Etiket No"
          placeholder="Etiket Numarası"
        />
        <FormInput
          control={control}
          name={`hgs.${index}.hgs_place`}
          label="Alındığı Yer"
          placeholder="Örn: PTT"
        />
        <FormInput
          control={control}
          name={`hgs.${index}.hgs_vehicle_class`}
          label="Araç Sınıfı"
          placeholder="Örn: 1. Sınıf"
        />
        <FormDatePicker
          control={control}
          name={`hgs.${index}.loading_date`}
          label="Yükleme Tarihi"
        />
      </div>
      <FormSwitchField
        control={control}
        name={`hgs.${index}.is_active`}
        label="HGS Aktif"
      />

    </div>
  );
}
