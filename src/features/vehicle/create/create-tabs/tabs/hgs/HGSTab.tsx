"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from '@/components/ui/drawer';

import { HGSForm } from './HGSForm';
import { HGSTable } from './HGSTable';
import { VehicleFormValues } from "@/features/vehicle/schemas/vehicle.schemas";

import { NEW_HGS_RECORD, Hgs, HGS_MESSAGES } from "./hgs-constants";
import { TabContentWrapper } from "../components/TabContentWrapper";
import { PlusIcon } from 'lucide-react';



interface HGSTabProps {
  onSubmit: (data: VehicleFormValues) => void;
}

export function HGSTab({ onSubmit }: HGSTabProps) {
  const { control, getValues } = useFormContext<VehicleFormValues>();
  const { fields, append, remove } = useFieldArray<VehicleFormValues>({ control, name: "hgs" });

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddNew = () => {
    append(NEW_HGS_RECORD);
    setEditingIndex(fields.length);
    setDialogOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setDialogOpen(true);
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">HGS Kayıtları</h3>
        <Drawer open={isDialogOpen} onOpenChange={setDialogOpen} direction="right">
          <DrawerTrigger asChild>
            <Button type="button" onClick={handleAddNew}>
            <PlusIcon className="size-4 mr-2" />
              Yeni HGS Ekle
            </Button>
          </DrawerTrigger>
          <DrawerContent className="w-full md:w-1/2 lg:w-2/5 p-4">
            <DrawerHeader className="text-left px-0 pt-0">
              <DrawerTitle>
                {editingIndex !== null && fields[editingIndex]?.id ? HGS_MESSAGES.EDIT : HGS_MESSAGES.NEW}
              </DrawerTitle>
              <DrawerDescription>
                Araç için HGS bilgilerini buradan ekleyebilir veya güncelleyebilirsiniz.
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex-grow overflow-y-auto p-4">
              {editingIndex !== null && (
                <HGSForm
                  index={editingIndex}
                  onSubmit={onSubmit}
                  onClose={handleCloseDialog}
                />
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <TabContentWrapper isEmpty={fields.length === 0} emptyMessage="Kayıtlı HGS bulunmamaktadır.">
        <HGSTable hgsRecords={fields as Hgs[]} onEdit={handleEdit} onDelete={remove} />
      </TabContentWrapper>
    </div>
  );
}
