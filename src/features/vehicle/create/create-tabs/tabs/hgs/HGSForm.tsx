"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FormInput } from "@/components/ui/form-input";
import { FormSwitchField } from "@/components/ui/form-switch-field";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { VehicleFormValues } from '@/features/vehicle/schemas/vehicle.schemas';

interface HGSFormProps {
  index: number;
  onSubmit: (data: VehicleFormValues) => void;
  onClose: () => void;
}

export function HGSForm({ index, onSubmit, onClose }: HGSFormProps) {
  const { control, trigger, handleSubmit } = useFormContext<VehicleFormValues>();

  const handleSave = async () => {
    const isValid = await trigger(`hgs.${index}`);
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
            name={`hgs.${index}.hgs_tag_no`}
            label="HGS Etiket No"
            placeholder="Etiket Numarası"
            required
          />
          <FormInput
            control={control}
            name={`hgs.${index}.hgs_vehicle_class`}
            label="Araç Sınıfı"
            placeholder="Örn: 1. Sınıf"
            required
          />
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h4 className="text-md font-semibold">Diğer Alanlar</h4>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <FormInput
                    control={control}
                    name={`hgs.${index}.hgs_place`}
                    label="Alındığı Yer"
                    placeholder="Örn: PTT"
                />
                <FormSwitchField
                    control={control}
                    name={`hgs.${index}.is_active`}
                    label="HGS Aktif"
                />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

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
