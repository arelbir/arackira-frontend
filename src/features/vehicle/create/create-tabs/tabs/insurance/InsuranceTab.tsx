"use client";

import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

import { InsuranceTable, EnrichedInsurance } from "./InsuranceTable";
import { InsuranceForm } from "./InsuranceForm";
import { INSURANCE_MESSAGES, NEW_INSURANCE_RECORD } from "./insurance-constants";
import { VehicleFormValues } from "@/features/vehicle/schemas";
import { useLookupData } from "@/features/vehicle/hooks/useLookupData";
import { TabContentWrapper } from "../components/TabContentWrapper";
import { EmptyState } from '@/components/ui/shared/empty-state';

export function InsuranceTab() {
  const { control, watch, trigger, getValues, setValue } = useFormContext<VehicleFormValues>();
  const vehicleId = watch("id");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "insurances",
  });

  const { insuranceTypes, insuranceCompanies } = useLookupData();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | null>(null);
  const [selectedInsuranceIndex, setSelectedInsuranceIndex] = useState<number | null>(null);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [itemToDeleteIndex, setItemToDeleteIndex] = useState<number | null>(null);

  const companyNameMap = new Map(insuranceCompanies?.map(c => [String(c.id), c.name]));
  const typeNameMap = new Map(insuranceTypes?.map(t => [String(t.id), t.name]));

  const enrichedInsurances: EnrichedInsurance[] = fields.map((field, index) => ({
    ...field,
    id: fields[index].id, // Ensure the useFieldArray id is passed
    insurance_company_name: companyNameMap.get(String(field.insurance_company_id)),
    insurance_type_name: typeNameMap.get(String(field.insurance_type_id)),
  }));

  const openDialog = (mode: 'add' | 'edit', index?: number) => {
    setDialogMode(mode);
    if (mode === 'add') {
      const newIndex = fields.length;
      append(NEW_INSURANCE_RECORD, { shouldFocus: false });
      setSelectedInsuranceIndex(newIndex);
    } else if (index !== undefined) {
      setSelectedInsuranceIndex(index);
    }
    setDrawerOpen(true);
  };

  const closeDialog = () => {
    if (dialogMode === 'add' && selectedInsuranceIndex !== null) {
      remove(selectedInsuranceIndex);
    }
    setDrawerOpen(false);
    setDialogMode(null);
    setSelectedInsuranceIndex(null);
  };

  const handleSave = async () => {
    if (selectedInsuranceIndex === null) return;

    const isValid = await trigger(`insurances.${selectedInsuranceIndex}`);
    if (isValid) {
      setDrawerOpen(false);
      setDialogMode(null);
      setSelectedInsuranceIndex(null);
      toast.success(INSURANCE_MESSAGES.SUCCESS);
    }
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
      const currentDeletedIds = getValues('deleted_ids.insurances') || [];
      setValue('deleted_ids.insurances', [...currentDeletedIds, itemToDelete.id]);
    }

    remove(itemToDeleteIndex);
    toast.success(INSURANCE_MESSAGES.DELETE_SUCCESS);
    closeDeleteAlert();
  };

  if (!vehicleId) {
    return (
      <EmptyState
        icon={<PlusIcon className="size-12 text-yellow-300" />}
        title="Sigorta kaydı eklemek için önce taslak araç oluşturmalısınız."
        description="'Taslak Kaydet' butonunu kullanarak önce aracı kaydedin."
        variant="warning"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Sigorta Kayıtları</h3>
        <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen} direction="right">
          <DrawerTrigger asChild>
            <Button type="button" onClick={() => openDialog('add')}>
              <PlusIcon className="size-4 mr-2" />
              Sigorta Ekle
            </Button>
          </DrawerTrigger>
          <DrawerContent className="w-full md:w-1/2 lg:w-1/3 p-4">
            <DrawerHeader className="text-left px-0 pt-0">
              <DrawerTitle>{dialogMode === 'add' ? INSURANCE_MESSAGES.NEW : INSURANCE_MESSAGES.EDIT}</DrawerTitle>
              <DrawerDescription>Araç için sigorta bilgilerini buradan ekleyebilir veya güncelleyebilirsiniz.</DrawerDescription>
            </DrawerHeader>

            <div className="p-4 overflow-y-auto">
              {selectedInsuranceIndex !== null && (
                <InsuranceForm index={selectedInsuranceIndex} />
              )}
            </div>

            <DrawerFooter className="pt-4 flex-row justify-end border-t">
              <DrawerClose asChild>
                <Button type="button" variant="outline" onClick={closeDialog}>İptal</Button>
              </DrawerClose>
              <Button type="button" onClick={handleSave}>Kaydet</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      <TabContentWrapper isEmpty={fields.length === 0} emptyMessage="Henüz sigorta kaydı eklenmedi.">
        <InsuranceTable
          insurances={enrichedInsurances}
          onEdit={(index) => openDialog('edit', index)}
          onDelete={openDeleteAlert}
        />
      </TabContentWrapper>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{INSURANCE_MESSAGES.DELETE_TITLE}</AlertDialogTitle>
            <AlertDialogDescription>{INSURANCE_MESSAGES.DELETE_CONFIRM}</AlertDialogDescription>
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