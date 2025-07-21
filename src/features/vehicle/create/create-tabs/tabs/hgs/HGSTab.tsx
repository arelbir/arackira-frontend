"use client";

import { useState, useEffect } from "react";
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

import { HGSForm } from './HGSForm';
import { HGSTable } from './HGSTable';
import { VehicleFormValues } from "@/features/vehicle/schemas/vehicle.schemas";

import { NEW_HGS_RECORD, Hgs, HGS_MESSAGES } from "./hgs-constants";



interface HGSTabProps {
  onSubmit: (data: VehicleFormValues) => void;
}

export function HGSTab({ onSubmit }: HGSTabProps) {
    const { control, getValues, trigger, handleSubmit } = useFormContext<VehicleFormValues>();
  const { fields, append, remove } = useFieldArray<VehicleFormValues>({ control, name: "hgs" });
  const { setValue } = useFormContext<VehicleFormValues>();

  useEffect(() => {
    fields.forEach((field, index) => {
      if (!(field as Hgs).loading_date) {
        setValue(`hgs.${index}.loading_date`, new Date());
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddNew = () => {
    append(NEW_HGS_RECORD as any); // Use as any to bypass strict typing issues with field arrays
    setEditingIndex(fields.length);
    setDialogOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setDialogOpen(true);
  };

    const handleSave = async () => {
    if (editingIndex === null) return;

    const isValid = await trigger(`hgs.${editingIndex}`);
    if (isValid) {
      await handleSubmit(onSubmit)();
      setDialogOpen(false);
      setEditingIndex(null);
    }
  };

  const handleCloseDialog = () => {
    if (editingIndex !== null && !getValues(`hgs.${editingIndex}.id`)) {
      remove(editingIndex);
    }
    setDialogOpen(false);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium">HGS Kayıtları</h3>
        <Button onClick={handleAddNew}>HGS Ekle</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null && fields[editingIndex]?.id ? HGS_MESSAGES.EDIT : HGS_MESSAGES.NEW}
            </DialogTitle>
          </DialogHeader>
          {editingIndex !== null && <HGSForm index={editingIndex} />}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseDialog}>
              İptal
            </Button>
            <Button type="button" onClick={handleSave}>
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex-1 min-h-[300px] flex flex-col overflow-auto w-full mb-4 border rounded-md">
        {fields.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Kayıtlı HGS bulunmamaktadır.</p>
          </div>
        ) : (
          <HGSTable hgsRecords={fields as Hgs[]} onEdit={handleEdit} onDelete={remove} />
        )}
      </div>
    </div>
  );
}
