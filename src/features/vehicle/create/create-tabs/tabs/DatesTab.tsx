"use client";

import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useVehicleForm } from "../context/VehicleCreateProvider";
import { CreateTabContent } from "../TabNavigator";

export function DatesTab() {
  const { form, vehicleId } = useVehicleForm();
  const { control, register, formState: { errors } } = form;
  return (
    <CreateTabContent value="dates">
      <Card>
        <CardHeader>
          <CardTitle>Tarihler</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Controller
        control={control}
        name="first_registration_date"
        render={({ field }) => (
          <DatePicker
            date={field.value && !isNaN(new Date(field.value as string).getTime()) ? new Date(field.value as string) : undefined}
            onChange={d => field.onChange(d ? d.toISOString().split("T")[0] : undefined)}
            placeholder="İlk Tescil Tarihi"
          />
        )}
      />
      <div>
         <Input placeholder="Ruhsat Belge No *" {...register("registration_document_number")} />
         {errors.registration_document_number && <p className="text-xs text-red-500">{String(errors.registration_document_number.message)}</p>}
       </div>
      <Controller
        control={control}
        name="next_maintenance_date"
        render={({ field }) => (
          <DatePicker
            date={field.value && !isNaN(new Date(field.value as string).getTime()) ? new Date(field.value as string) : undefined}
            onChange={d => field.onChange(d ? d.toISOString().split("T")[0] : undefined)}
            placeholder="Sonraki Bakım Tarihi *"
          />
        )}
      />
      {errors.next_maintenance_date && <p className="text-xs text-red-500">{String(errors.next_maintenance_date.message)}</p>}
      <Controller
        control={control}
        name="inspection_expiry_date"
        render={({ field }) => (
          <DatePicker
            date={field.value && !isNaN(new Date(field.value as string).getTime()) ? new Date(field.value as string) : undefined}
            onChange={d => field.onChange(d ? d.toISOString().split("T")[0] : undefined)}
            placeholder="Egzoz Pulu Bitiş *"
          />
        )}
      />
            </CardContent>
      </Card>
    </CreateTabContent>
  );
}
