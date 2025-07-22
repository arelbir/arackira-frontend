"use client";

import { useFormContext } from 'react-hook-form';
import { FormInput } from '@/components/ui/form-input';
import { FormSwitchField } from '@/components/ui/form-switch-field';
import { DatePicker } from '@/components/ui/date-picker';
import { VehicleFormValues } from '@/features/vehicle/schemas/vehicle.schemas';
import { FormField, FormLabel, FormItem } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface GPSFormProps {
  index: number;
}

export function GPSForm({ index }: GPSFormProps) {
  const { control } = useFormContext<VehicleFormValues>();
  const namePrefix = `gps.${index}` as const;

  return (
    <div className="space-y-6">
      {/* Önemli Alanlar */}
      <div className="space-y-4">
        <FormInput control={control} name={`${namePrefix}.device_serial_number`} label="Seri Numarası" />
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
        <FormInput control={control} name={`${namePrefix}.description`} label="Açıklama" />
      </div>

      {/* Opsiyonel Alanlar */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Diğer Detaylar</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <FormInput control={control} name={`${namePrefix}.brand`} label="Marka" />
              <FormInput control={control} name={`${namePrefix}.device_model`} label="Cihaz Modeli" />
              <FormInput control={control} name={`${namePrefix}.sim_number`} label="SIM Kart No" />
              <FormInput control={control} name={`${namePrefix}.service_provider`} label="Servis Sağlayıcı" />
              <FormInput control={control} name={`${namePrefix}.installation_location`} label="Montaj Yeri" />
              <FormField
                control={control}
                name={`${namePrefix}.subscription_start_date`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Abonelik Başlangıç</FormLabel>
                    <DatePicker date={field.value ?? undefined} onChange={field.onChange} />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`${namePrefix}.subscription_end_date`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Abonelik Bitiş</FormLabel>
                    <DatePicker date={field.value ?? undefined} onChange={field.onChange} />
                  </FormItem>
                )}
              />
              <FormSwitchField control={control} name={`${namePrefix}.is_active`} label="Aktif" />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
