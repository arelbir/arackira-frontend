"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useVehicleForm } from "../../context/VehicleCreateProvider";
import { CreateTabContent } from "../../TabNavigator";
import { GPSForm } from './GPSForm';
import { GPSTable } from './GPSTable';
import { useGpsFormHandler } from "@/features/vehicle/hooks/useGpsFormHandler";

export function GPSTab() {
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
  } = useGpsFormHandler();

  if (!vehicleId) {
    return (
      <CreateTabContent value="gps">
        <div className="flex flex-col items-center justify-center py-16 text-center text-yellow-700 dark:text-yellow-200">
            <p>GPS kaydı eklemek için önce taslak araç oluşturmalısınız.</p>
        </div>
      </CreateTabContent>
    );
  }

  return (
    <CreateTabContent value="gps">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Uydu Takip (GPS) Kayıtları</h2>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" onClick={handleAddNew}>GPS Ekle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingIndex !== null ? 'GPS Düzenle' : 'Yeni GPS Ekle'}</DialogTitle>
            </DialogHeader>
            <FormProvider {...methods}>
              <GPSForm index={editingIndex ?? fields.length} />
              <Button className="w-full mt-4" onClick={handleSave}>Kaydet</Button>
            </FormProvider>
          </DialogContent>
        </Dialog>
      </div>

      {fields.length === 0 ? (
        <div className="flex items-center justify-center h-64 border rounded-md">
          <p className="text-gray-500">Henüz GPS kaydı yok.</p>
        </div>
      ) : (
        <div className="flex-1 min-h-[300px] flex flex-col overflow-auto w-full mb-4 border rounded-md">
          <GPSTable fields={fields} onEdit={handleEdit} onRemove={handleRemove} />
        </div>
      )}
    </CreateTabContent>
  );
}

export default GPSTab;
