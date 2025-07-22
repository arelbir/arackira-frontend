"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from '@/components/ui/drawer';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

import { UTTSForm } from './UTTSForm';
import { UTTSTable } from './UTTSTable';
import { VehicleFormValues } from "@/features/vehicle/schemas/vehicle.schemas";

import { NEW_UTTS_RECORD, Utts, UTTS_MESSAGES } from "./utts-constants";
import { TabContentWrapper } from "../components/TabContentWrapper";
import { PlusIcon } from 'lucide-react';

export function UttsTab() {
  const { control, getValues, setValue } = useFormContext<VehicleFormValues>();
  const { fields, append, remove } = useFieldArray<VehicleFormValues>({ control, name: "utts" });

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [itemToDeleteIndex, setItemToDeleteIndex] = useState<number | null>(null);

  const handleAddNew = () => {
    append(NEW_UTTS_RECORD);
    setEditingIndex(fields.length);
    setDialogOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setDialogOpen(true);
  };

  const onSubmit = () => {
    setDialogOpen(false);
    setEditingIndex(null);
  };

  const handleCloseDialog = () => {
    if (editingIndex !== null && !getValues(`utts.${editingIndex}.id`)) {
      remove(editingIndex);
    }
    setDialogOpen(false);
    setEditingIndex(null);
  };

  const openDeleteAlert = (index: number) => {
    setItemToDeleteIndex(index);
    setDeleteAlertOpen(true);
  };

  const closeDeleteAlert = () => {
    setItemToDeleteIndex(null);
    setDeleteAlertOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (itemToDeleteIndex === null) return;
    const itemToDelete = fields[itemToDeleteIndex];
    if (itemToDelete.id) {
        const currentDeletedIds = getValues('deleted_ids.utts') || [];
        setValue('deleted_ids.utts', [...currentDeletedIds, itemToDelete.id]);
    }
    remove(itemToDeleteIndex);
    closeDeleteAlert();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">UTTS Kayıtları</h3>
        <Drawer open={isDialogOpen} onOpenChange={setDialogOpen} direction="right">
          <DrawerTrigger asChild>
            <Button type="button" onClick={handleAddNew}>
            <PlusIcon className="size-4 mr-2" />
              UTTS Ekle
            </Button>
          </DrawerTrigger>
          <DrawerContent className="w-full md:w-1/2 lg:w-2/5 p-4">
            <DrawerHeader className="text-left px-0 pt-0">
              <DrawerTitle>
                {editingIndex !== null && fields[editingIndex]?.id ? UTTS_MESSAGES.EDIT : UTTS_MESSAGES.NEW}
              </DrawerTitle>
              <DrawerDescription>
                Araç için UTTS bilgilerini buradan ekleyebilir veya güncelleyebilirsiniz.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 overflow-y-auto">
              {editingIndex !== null && (
                <UTTSForm
                  index={editingIndex}
                  onSubmit={onSubmit}
                  onClose={handleCloseDialog}
                />
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <TabContentWrapper isEmpty={fields.length === 0} emptyMessage="Kayıtlı UTTS bulunmamaktadır.">
        <UTTSTable uttsRecords={fields as Utts[]} onEdit={handleEdit} onDelete={openDeleteAlert} />
      </TabContentWrapper>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{UTTS_MESSAGES.DELETE_TITLE}</AlertDialogTitle>
            <AlertDialogDescription>
              {UTTS_MESSAGES.DELETE_MESSAGE}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteAlert}>{UTTS_MESSAGES.CANCEL}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>{UTTS_MESSAGES.DELETE}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
