"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormProvider } from "react-hook-form";
import { useVehicleForm } from "../../context/VehicleCreateProvider";
import { CreateTabContent } from "../../TabNavigator";
import { InspectionForm } from "./InspectionForm";
import { InspectionTable } from "./InspectionTable";
import { useInspectionFormHandler } from "@/features/vehicle/hooks/useInspectionFormHandler";

export function InspectionTab() {
  const { vehicleId } = useVehicleForm();
  const {
    isDialogOpen,
    setDialogOpen,
    editingIndex,
    fields,
    handleAddNew,
    handleEdit,
    handleSave,
    handleRemove,
    methods,
  } = useInspectionFormHandler();

  if (!vehicleId) {
    return (
      <CreateTabContent value="inspection">
        <div className="flex items-center justify-center h-64 border rounded-md">
          <p className="text-gray-500">Muayene kaydı eklemek için önce taslak araç oluşturmalısınız.</p>
        </div>
      </CreateTabContent>
    );
  }

  return (
    <CreateTabContent value="inspection">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Muayene Kayıtları</h2>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" onClick={handleAddNew}>Muayene Ekle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingIndex !== null ? 'Muayene Düzenle' : 'Yeni Muayene Ekle'}</DialogTitle>
            </DialogHeader>
            <FormProvider {...methods}>
              <InspectionForm 
                index={editingIndex ?? fields.length}
                onSave={handleSave}
                onClose={() => setDialogOpen(false)}
              />
            </FormProvider>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 min-h-[300px] flex flex-col overflow-auto w-full mb-4 border rounded-md">
        {fields.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Henüz muayene kaydı yok.</p>
          </div>
        ) : (
          <InspectionTable inspections={fields} onEdit={handleEdit} onDelete={handleRemove} />
        )}
      </div>
    </CreateTabContent>
  );
}
