"use client";

import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { toast } from "sonner";

import { InsuranceTable } from "./InsuranceTable";
import { InsuranceForm } from "./InsuranceForm";
import { EmptyState } from "@/components/ui/shared/empty-state";
import { INSURANCE_MESSAGES, NEW_INSURANCE_RECORD } from "./insurance-constants";
import { VehicleFormValues } from "@/features/vehicle/schemas";
import { InsuranceDeleteConfirmDialog } from "@/features/vehicle/components/InsuranceDeleteConfirmDialog";
import { useLookupData } from "@/features/vehicle/hooks/useLookupData";
import { EnrichedInsurance } from "./InsuranceTable";

export function InsuranceTab() {
  const { control, watch } = useFormContext<VehicleFormValues>();
  const vehicleId = watch("id");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "insurances",
  });

  const { insuranceTypes, insuranceCompanies } = useLookupData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const companyNameMap = new Map(insuranceCompanies?.map(c => [String(c.id), c.name]));
  const typeNameMap = new Map(insuranceTypes?.map(t => [String(t.id), t.name]));

  const enrichedInsurances: EnrichedInsurance[] = fields.map((field) => ({
    ...field,
    insurance_company_name: companyNameMap.get(String(field.insurance_company_id)),
    insurance_type_name: typeNameMap.get(String(field.insurance_type_id)),
  }));

  const enrichedItemToDelete = deleteIndex !== null ? enrichedInsurances[deleteIndex] : null;

  const handleAddNew = () => {
    append(NEW_INSURANCE_RECORD);
    setEditingIndex(fields.length);
    setIsDrawerOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    // Form state is managed by react-hook-form, so we just close the drawer.
    setIsDrawerOpen(false);
    setEditingIndex(null);
    toast.success(INSURANCE_MESSAGES.SUCCESS);
  };

  const handleCancel = () => {
    // If we were adding a new record, remove it on cancel.
    if (editingIndex !== null && editingIndex >= fields.length - 1) {
      // This logic might need adjustment if sorting/filtering is added
    }
    setIsDrawerOpen(false);
    setEditingIndex(null);
  };

  const openDeleteConfirm = (index: number) => {
    setDeleteIndex(index);
  };

  const handleDelete = () => {
    if (deleteIndex !== null) {
      remove(deleteIndex);
      setDeleteIndex(null);
      toast.success(INSURANCE_MESSAGES.DELETE_SUCCESS);
    }
  };

  if (!vehicleId) {
    return (
      <div>
        <EmptyState
          icon={<PlusIcon className="size-12 text-yellow-300" />}
          title="Sigorta kaydı eklemek için önce taslak araç oluşturmalısınız."
          description="'Taslak Kaydet' butonunu kullanarak önce aracı kaydedin."
          variant="warning"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Sigorta Kayıtları</h2>
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
          <DrawerTrigger asChild>
            <Button type="button" variant="default" onClick={handleAddNew}>
              <PlusIcon className="size-4 mr-2" />
              Sigorta Ekle
            </Button>
          </DrawerTrigger>
          <DrawerContent className="w-full md:w-1/2 lg:w-1/3 p-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingIndex === null ? INSURANCE_MESSAGES.NEW : INSURANCE_MESSAGES.EDIT}
            </h3>
            {editingIndex !== null && (
              <InsuranceForm
                index={editingIndex}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            )}
          </DrawerContent>
        </Drawer>
      </div>

      <div className="flex-1 min-h-[300px] flex flex-col overflow-auto w-full mb-4 border rounded-md">
        {fields.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <EmptyState
              icon={<PlusIcon className="size-10 text-gray-400" />}
              title="Henüz sigorta kaydı eklenmedi."
              description="Yeni bir sigorta poliçesi eklemek için butona tıklayın."
            />
          </div>
        ) : (
          <InsuranceTable
            insurances={enrichedInsurances}
            onEdit={handleEdit}
            onDelete={openDeleteConfirm}
            onRenew={() => {}}
          />
        )}
      </div>

      <InsuranceDeleteConfirmDialog
        open={deleteIndex !== null}
        onOpenChange={(isOpen) => !isOpen && setDeleteIndex(null)}
        itemToDelete={enrichedItemToDelete}
        onConfirm={() => {
          handleDelete();
          setDeleteIndex(null);
        }}
        onCancel={() => setDeleteIndex(null)}
        isDeleting={false} // This can be connected to a loading state if the delete is async
      />
    </div>
  );
};