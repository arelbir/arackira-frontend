"use client";

import { useState } from 'react';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription
} from '@/components/ui/drawer';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useDrawerState as useDrawer } from '@/hooks/useDrawerState';
import { InspectionForm } from './InspectionForm';
import { InspectionTable } from './InspectionTable';
import { PlusIcon } from 'lucide-react';

import { VehicleFormValues } from "@/features/vehicle/schemas/vehicle.schemas";
import { useLookupData } from "@/features/vehicle/hooks/useLookupData";
import { FieldArrayWithId } from "react-hook-form";
import { z } from "zod";
import { inspectionSchema } from "../../../../schemas/included.schemas";
import { TabContentWrapper } from "../components/TabContentWrapper";

// Single source of truth for the inspection type, enriched with the company name.
// This type will be imported by InspectionTable.tsx.
export type Inspection = z.infer<typeof inspectionSchema>;
export type EnrichedInspection = FieldArrayWithId<VehicleFormValues, "inspections", "id"> & {
  inspection_company_name?: string;
};

export function InspectionTab() {
  const { control, getValues } = useFormContext<VehicleFormValues>();
  const { fields, append, remove, update } = useFieldArray<VehicleFormValues>({ control, name: "inspections" });
  const { isOpen: isDrawerOpen, context: editingIndex, openDrawer, closeDrawer } = useDrawer<number>();
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | null>(null);

  const { inspectionCompanies } = useLookupData();
  const companyNameMap = new Map(inspectionCompanies?.map(c => [String(c.id), c.name]));

  const enrichedInspections: EnrichedInspection[] = (fields as any[]).map((field) => ({
    ...field,
    inspection_company_name: companyNameMap.get(String(field.inspection_company_id)),
  }));

  const openInspectionDrawer = (mode: 'add' | 'edit', index?: number) => {
    setDialogMode(mode);
    if (mode === 'add') {
            const defaultValues = { inspection_date: new Date(), expiry_date: new Date(), result: '', cost: 0, description: '', inspection_company_id: null };
      append(defaultValues as Inspection);
      openDrawer(fields.length);
    } else if (index !== undefined) {
      openDrawer(index);
    }
  };

  const handleCloseDrawer = () => {
    if (dialogMode === 'add') {
      remove(fields.length - 1);
    }
    closeDrawer();
  };

  const handleSave = () => {
    if (editingIndex === null) return;
    const formData = getValues(`inspections.${editingIndex}`);
    update(editingIndex, formData as Inspection);
    closeDrawer();
  };

  const openDeleteAlert = (index: number) => {
    setDeletingIndex(index);
    setDeleteAlertOpen(true);
  };

  const closeDeleteAlert = () => {
    setDeletingIndex(null);
    setDeleteAlertOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingIndex !== null) {
      remove(deletingIndex);
      closeDeleteAlert();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Muayene Kayıtları</h3>
        <Drawer open={isDrawerOpen} onOpenChange={(open) => !open && handleCloseDrawer()} direction="right">
          <DrawerTrigger asChild>
            <Button type="button" onClick={() => openInspectionDrawer('add')}>
              <PlusIcon className="size-4 mr-2" />
              Yeni Muayene Ekle
            </Button>
          </DrawerTrigger>
          <DrawerContent className="w-full md:w-1/2 lg:w-2/5 p-4">
            <DrawerHeader className="text-left px-0 pt-0">
              <DrawerTitle>{dialogMode === 'add' ? "Yeni Muayene Ekle" : "Muayene Düzenle"}</DrawerTitle>
              <DrawerDescription>Araç için muayene bilgilerini buradan ekleyebilir veya güncelleyebilirsiniz.</DrawerDescription>
            </DrawerHeader>

            <div className="p-4 overflow-y-auto">
              {isDrawerOpen && editingIndex !== null && (
                <InspectionForm index={editingIndex} />
              )}
            </div>

            <DrawerFooter className="pt-4 flex-row justify-end border-t">
              <DrawerClose asChild>
                <Button type="button" variant="outline" onClick={handleCloseDrawer}>İptal</Button>
              </DrawerClose>
              <Button type="button" onClick={handleSave}>Kaydet</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      <TabContentWrapper isEmpty={fields.length === 0} emptyMessage="Henüz muayene kaydı eklenmedi.">
        <InspectionTable
          inspections={enrichedInspections}
          onEdit={(index) => openInspectionDrawer('edit', index)}
          onDelete={openDeleteAlert}
        />
      </TabContentWrapper>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Muayene Kaydını Sil</AlertDialogTitle>
            <AlertDialogDescription>Bu muayene kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteAlert}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Sil</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
