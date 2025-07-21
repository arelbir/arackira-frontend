"use client";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormSelectField } from "@/components/ui/form-select";
import { DatePicker } from "@/components/ui/date-picker";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { useLookupData } from "@/features/vehicle/hooks/useLookupData";
import { VehicleFormValues } from '@/features/vehicle/schemas/vehicle.schemas';

interface InspectionFormProps {
  index: number;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

export function InspectionForm({ index, onSave, onCancel, isEditing }: InspectionFormProps) {
  const { control } = useFormContext<VehicleFormValues>();
  const { inspectionCompanies, isLoading } = useLookupData();

  return (
    <div className="border p-4 rounded-md my-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormSelectField
          control={control}
          name={`inspections.${index}.inspection_company_id`}
          label="Muayene İstasyonu"
          options={inspectionCompanies?.map((company) => ({ value: String(company.id), label: company.name })) ?? []}
          disabled={!isEditing || isLoading}
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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
          disabled={!isEditing}
          placeholder="Örn: Geçti"
        />

        <FormInput
          control={control}
          name={`inspections.${index}.cost`}
          label="Maliyet"
          type="number"
          disabled={!isEditing}
          placeholder="0.00"
        />

        <div className="col-span-full">
            <FormInput
              control={control}
              name={`inspections.${index}.description`}
              label="Açıklama"
              disabled={!isEditing}
              placeholder="Muayene ile ilgili notlar..."
            />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>İptal</Button>
        <Button type="button" onClick={onSave}>Kaydet</Button>
      </div>
    </div>
  );
}
