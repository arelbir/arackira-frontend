"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSelectField } from "@/components/ui/form-select";
import { DatePicker } from "@/components/ui/date-picker";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { useLookupData } from "@/features/vehicle/hooks/useLookupData";
import { VehicleFormValues } from '@/features/vehicle/schemas/vehicle.schemas';

interface InspectionFormProps {
  index: number;
}

export function InspectionForm({ index }: InspectionFormProps) {
  const { control } = useFormContext<VehicleFormValues>();
  const { inspectionCompanies, isLoading } = useLookupData();





  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow space-y-4 overflow-y-auto pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelectField
            control={control}
            name={`inspections.${index}.inspection_company_id`}
            label="Muayene İstasyonu"
            options={inspectionCompanies?.map((company) => ({ value: String(company.id), label: company.name })) ?? []}
            disabled={isLoading}
            placeholder="İstasyon Seçin..."
          />

          <FormField
            control={control}
            name={`inspections.${index}.inspection_date`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Muayene Tarihi</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value ?? undefined}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`inspections.${index}.expiry_date`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Geçerlilik Tarihi</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value ?? undefined}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormInput
            control={control}
            name={`inspections.${index}.result`}
            label="Sonuç"
            placeholder="Örn: Geçti"
          />


          <div className="col-span-full">
              <FormInput
                control={control}
                name={`inspections.${index}.description`}
                label="Açıklama"
                placeholder="Muayene ile ilgili notlar..."
              />
          </div>
        </div>
      </div>

    </div>
  );
}
