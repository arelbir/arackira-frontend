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


export function InsuranceTab() {
  const { form, vehicleId } = useVehicleForm();
  
  // Lookup verilerini merkezi hook'tan al
  const lookups = useLookupData();
  
  // Form işlemlerini merkezi hook'tan al
  const {
    isDrawerOpen, 
    setIsDrawerOpen,
    editingIndex,
    fields,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleRenew,
    handleSave
  } = useInsuranceFormHandler({ 
    control: form.control,
    onSuccess: () => {},
    onError: (error: Error | unknown) => console.error('Sigorta işleminde hata:', error)
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
            onDelete={handleDelete}
            onRenew={handleRenew}
            insuranceTypes={lookups.insuranceTypes}
          />
        </div>
      )}
      
      {/* Drawer (Sağdan Açılan Form Paneli) */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
        <DrawerForm
          title={editingIndex === null ? 'Yeni Sigorta Kaydı' : 'Sigorta Kaydını Düzenle'}
          onCancel={() => setIsDrawerOpen(false)}
          onSave={() => handleSave(form)}
        >
          <div className="p-6 pt-2 pb-8">
            <InsuranceForm
              control={form.control}
              index={editingIndex !== null ? editingIndex : fields.length}
              initialData={editingIndex !== null ? fields[editingIndex] : undefined}
              lookups={lookups}
              onClose={() => setIsDrawerOpen(false)}
              onSave={() => handleSave(form)}
            />
          </div>
        </DrawerForm>
      </Drawer>
    </CreateTabContent>
  );
};