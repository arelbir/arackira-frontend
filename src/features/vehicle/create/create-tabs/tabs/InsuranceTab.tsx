"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { DrawerForm } from "@/components/ui/form/drawer-form";
import { toast } from "sonner";

import { useVehicleForm } from "../context/VehicleCreateProvider";
import { CreateTabContent } from "../TabNavigator";
import { InsuranceTable } from "./InsuranceTable";
import { InsuranceForm } from "./InsuranceForm";
import { EmptyState } from "@/components/ui/shared/empty-state";
import { useLookupData } from "@/features/vehicle/hooks/useLookupData";
import { useInsuranceFormHandler } from "@/features/vehicle/hooks/useInsuranceFormHandler";
import { INSURANCE_MESSAGES } from "./insurance-constants";
import { FormProvider } from "react-hook-form";
import { InsuranceDeleteConfirmDialog } from "@/features/vehicle/components/InsuranceDeleteConfirmDialog";
import { Insurance } from "@/features/vehicle/types";
import React, { useState } from "react";

export function InsuranceTab() {
  const { form, vehicleId } = useVehicleForm();
  
  // Lookup verilerini merkezi hook'tan al
  const lookups = useLookupData();
  
  // Silme işlemi için state değişkenleri
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  // Form işlemlerini merkezi hook'tan al
  const {
    isDrawerOpen, 
    setIsDrawerOpen,
    editingIndex,
    fields,
    handleAddNew,
    handleEdit,
    handleRenew,
    handleSave,
    methods,
    remove
  } = useInsuranceFormHandler({ 
    control: form.control,
    onSuccess: () => toast.success(INSURANCE_MESSAGES.SUCCESS),
    onError: (error: Error | unknown) => toast.error(INSURANCE_MESSAGES.ERROR)
  });

  if (!vehicleId) {
    return (
      <CreateTabContent value="insurance">
        <EmptyState
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="size-12 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C7 4 2 6 2 11v5a2 2 0 002 2h16a2 2 0 002-2v-5c0-5-5-7-10-9zm0 0v2m0 0c2.5 1 5 2 5 7v5" />
            </svg>
          }
          title="Sigorta kaydı eklemek için önce taslak araç oluşturmalısınız."
          description="'Taslak Kaydet' butonunu kullanarak önce aracı kaydedin."
          variant="warning"
        />
      </CreateTabContent>
    );
  }

  return (
    <CreateTabContent value="insurance">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Sigorta Kayıtları</h2>
        <Button
          type="button"
          variant="default"
          onClick={handleAddNew}
        >
          <PlusIcon className="size-4 mr-2" />
          Sigorta Ekle
        </Button>
      </div>
      
      {fields.length === 0 ? (
        <EmptyState 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="size-12 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C7 4 2 6 2 11v5a2 2 0 002 2h16a2 2 0 002-2v-5c0-5-5-7-10-9zm0 0v2m0 0c2.5 1 5 2 5 7v5" />
            </svg>
          }
          title="Henüz sigorta kaydı yok"
          description="Yeni bir sigorta eklemek için yukarıdaki butonu kullanın."
        />
      ) : (
        <div className="flex-1 min-h-[300px] flex flex-col overflow-auto w-full mb-4 border rounded-md">
          <InsuranceTable 
            insurances={fields} 
            onEdit={handleEdit}
            onDelete={(index) => {
              setDeleteIndex(index);
              setIsDeleteConfirmOpen(true);
            }}
            onRenew={handleRenew}
            insuranceTypes={lookups.insuranceTypes}
          />
        </div>
      )}
      
      {/* Drawer (Sağdan Açılan Form Paneli) */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
        <DrawerForm
          title={editingIndex === null ? INSURANCE_MESSAGES.NEW : INSURANCE_MESSAGES.EDIT}
          onCancel={() => setIsDrawerOpen(false)}
          onSave={() => handleSave(form)}
        >
          <div className="p-6 pt-2 pb-8">
            <FormProvider {...methods}>
              <InsuranceForm
                index={editingIndex !== null ? editingIndex : fields.length}
                initialData={editingIndex !== null ? fields[editingIndex] : undefined}
                lookups={lookups}
                onClose={() => setIsDrawerOpen(false)}
                onSave={() => handleSave(form)}
              />
            </FormProvider>
          </div>
        </DrawerForm>
      </Drawer>
      
      {/* Silme Onay Dialog'u */}
      <InsuranceDeleteConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        itemToDelete={deleteIndex !== null ? fields[deleteIndex] as Insurance : null}
        isDeleting={isDeleting}
        onConfirm={() => {
          if (deleteIndex !== null) {
            setIsDeleting(true);
            try {
              remove(deleteIndex);
              toast.success("Sigorta kaydı başarıyla silindi");
            } finally {
              setIsDeleting(false);
              setIsDeleteConfirmOpen(false);
              setDeleteIndex(null);
            }
          }
        }}
        onCancel={() => {
          setIsDeleteConfirmOpen(false);
          setDeleteIndex(null);
        }}
      />
    </CreateTabContent>
  );
};