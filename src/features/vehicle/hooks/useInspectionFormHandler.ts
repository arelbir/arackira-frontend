"use client";

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useEffect, useState, useCallback } from "react"; // useCallback eklendi
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { inspectionArraySchema, VehicleCreateValues } from "@/features/vehicle/create/create-tabs/schema";
import { useVehicleForm } from "@/features/vehicle/create/create-tabs/context/VehicleCreateProvider";
import { toast } from "sonner";

/**
 * Muayene formu alanlarını yönetmek için custom hook.
 * VehicleCreateProvider'dan ana formu alır ve kendi iç formunu senkronize eder.
 * @returns isDialogOpen: Dialog durumu, editingIndex: Düzenlenen kaydın indeksi, fields: Form alanları, vb.
 */
export function useInspectionFormHandler() {
  const { form: vehicleForm } = useVehicleForm();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const methods = useForm<VehicleCreateValues>({
    resolver: zodResolver(z.object({ inspections: inspectionArraySchema })),
    defaultValues: {
      inspections: vehicleForm.getValues().inspections || [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: methods.control,
    name: "inspections",
  });

  const handleAddNew = useCallback(() => {
    setEditingIndex(null);
    setDialogOpen(true);
  }, []);

  const handleEdit = useCallback((index: number) => {
    setEditingIndex(index);
    setDialogOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    methods.handleSubmit((data) => {
      // Sadece 'inspections' alanını ana forma set et
      vehicleForm.setValue("inspections", data.inspections);
      toast.success(editingIndex !== null ? "Muayene kaydı başarıyla güncellendi." : "Muayene kaydı başarıyla eklendi.");
      setDialogOpen(false);
      setEditingIndex(null);
    }, (errors) => {
      console.error("Doğrulama Hataları:", errors);
      toast.error("Lütfen formdaki hataları düzeltin.");
    })();
  }, [methods, vehicleForm, editingIndex, setDialogOpen, setEditingIndex]);
  
  const handleRemove = useCallback((index: number) => {
      remove(index);
      const updatedInspections = methods.getValues().inspections;
      vehicleForm.setValue("inspections", updatedInspections);
      toast.success("Muayene kaydı silindi.");
  }, [remove, methods, vehicleForm]);

  // Ana formdaki değişiklikleri izle ve bu hook'un formunu senkronize et
  const watchedInspections = useWatch({ control: vehicleForm.control, name: "inspections" });
  useEffect(() => {
    // Sadece gerçekten farklıysa resetle, sonsuz döngüyü önlemek için
    if (JSON.stringify(watchedInspections) !== JSON.stringify(methods.getValues().inspections)) {
      methods.reset({ ...methods.getValues(), inspections: watchedInspections });
    }
  }, [watchedInspections, methods]);

  return {
    isDialogOpen,
    setDialogOpen,
    editingIndex,
    fields,
    handleAddNew,
    handleEdit,
    handleSave,
    handleRemove,
    methods, // FormProvider için React Hook Form metotları
  };
}
