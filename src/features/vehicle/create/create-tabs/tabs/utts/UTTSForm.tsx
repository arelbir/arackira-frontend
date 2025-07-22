"use client";

import { FormInput } from "@/components/ui/form-input";
import { useFormContext } from "react-hook-form";
import { VehicleFormValues } from '@/features/vehicle/schemas/vehicle.schemas';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";

interface UTTSFormProps {
  index: number;
  onSubmit: (data: VehicleFormValues) => void;
  onClose: () => void;
}

export function UTTSForm({ index, onSubmit, onClose }: UTTSFormProps) {
  const { control, trigger, handleSubmit } = useFormContext<VehicleFormValues>();

  const handleSave = async () => {
    const isValid = await trigger(`utts.${index}`);
    if (isValid) {
      await handleSubmit(onSubmit)();
      onClose();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-md font-semibold">Önemli Alanlar</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name={`utts.${index}.utts_code`}
            label="UTTS Kodu"
            placeholder="UTTS Kodunu Giriniz"
            required
          />

              <FormField
                control={control}
                name={`utts.${index}.installation_date`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montaj Tarihi</FormLabel>
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

        </div>
      </div>


      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          İptal
        </Button>
        <Button type="button" onClick={handleSave}>
          Kaydet
        </Button>
      </div>
    </div>
  );
}
