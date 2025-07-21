"use client";

import { useFormContext } from 'react-hook-form';
import { FormInput } from '@/components/ui/form-input';
import { FormSwitchField } from '@/components/ui/form-switch-field';
import { DatePicker } from '@/components/ui/date-picker';
import { VehicleFormValues } from '@/features/vehicle/schemas/vehicle.schemas';
import { FormField, FormLabel, FormItem } from '@/components/ui/form';

interface GPSFormProps {
  index: number;
}

export function GPSForm({ index }: GPSFormProps) {
  const { control } = useFormContext<VehicleFormValues>();
  const namePrefix = `gps.${index}` as const;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormInput control={control} name={`${namePrefix}.brand`} label="Marka" />
        <FormInput control={control} name={`${namePrefix}.device_model`} label="Cihaz Modeli" />
        <FormInput control={control} name={`${namePrefix}.device_serial_number`} label="Seri Numarası" />
        <FormInput control={control} name={`${namePrefix}.sim_number`} label="SIM Kart No" />
        <FormInput control={control} name={`${namePrefix}.service_provider`} label="Servis Sağlayıcı" />
        <FormInput control={control} name={`${namePrefix}.installation_location`} label="Montaj Yeri" />
        <FormField
          control={control}
          name={`${namePrefix}.installation_date`}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Montaj Tarihi</FormLabel>
              <DatePicker date={field.value ?? undefined} onChange={field.onChange} />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${namePrefix}.subscription_start`}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Abonelik Başlangıç</FormLabel>
              <DatePicker date={field.value ?? undefined} onChange={field.onChange} />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${namePrefix}.subscription_end`}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Abonelik Bitiş</FormLabel>
              <DatePicker date={field.value ?? undefined} onChange={field.onChange} />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${namePrefix}.cancellation_date`}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>İptal Tarihi</FormLabel>
              <DatePicker date={field.value ?? undefined} onChange={field.onChange} />
            </FormItem>
          )}
        />
        <FormSwitchField control={control} name={`${namePrefix}.is_active`} label="Aktif" />
        <FormInput control={control} name={`${namePrefix}.description`} label="Açıklama" />
      </div>
    </div>
  );
}
