"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TabsContent } from '@/components/ui/tabs';
import { InspectionForm } from './InspectionForm';
import { InspectionTable } from './InspectionTable';

import { VehicleFormValues } from "@/features/vehicle/schemas/vehicle.schemas";
import { useLookupData } from "@/features/vehicle/hooks/useLookupData";
import { FieldArrayWithId } from "react-hook-form";
import { z } from "zod";
import { inspectionSchema } from "../../../../schemas/included.schemas";

// Single source of truth for the inspection type, enriched with the company name.
// This type will be imported by InspectionTable.tsx.
export type Inspection = z.infer<typeof inspectionSchema>;
export type EnrichedInspection = FieldArrayWithId<VehicleFormValues, "inspections", "id"> & {
  inspection_company_name?: string;
};

export function InspectionTab() {
    const { control, getValues } = useFormContext<VehicleFormValues>();
  const { fields, append, remove } = useFieldArray<VehicleFormValues>({ control, name: "inspections" });

  const { inspectionCompanies } = useLookupData();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const companyNameMap = new Map(inspectionCompanies?.map(c => [String(c.id), c.name]));

  const enrichedInspections: EnrichedInspection[] = (fields as any[]).map((field) => ({
    ...field,
    inspection_company_name: companyNameMap.get(String(field.inspection_company_id)),
  }));

  const handleAddNew = () => {
    append({ // @ts-ignore - RHF's type inference struggles with multiple field arrays
      inspection_company_id: null,
      inspection_date: null,
      expiry_date: null,
      result: '',
      cost: null,
      description: '',
      created_at: null,
      updated_at: null,
    });
    setEditingIndex(fields.length);
    setDialogOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setDialogOpen(true);
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const handleSave = () => {
    // Optionally update the form state if needed, though react-hook-form should handle it
    setDialogOpen(false);
    setEditingIndex(null);
  };

  const handleCloseDialog = () => {
    // If it was a new entry that was cancelled, remove it from the field array
    if (editingIndex !== null && !getValues(`inspections.${editingIndex}.id`)) {
        remove(editingIndex);
    }
    setDialogOpen(false);
    setEditingIndex(null);
  };

  return (
    <TabsContent value="inspection" className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddNew}>
          Muayene Ekle
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleCloseDialog();
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null && fields[editingIndex]?.id
                ? "Muayene Düzenle"
                : "Yeni Muayene Ekle"}
            </DialogTitle>
          </DialogHeader>
          {editingIndex !== null && (
            <InspectionForm
              index={editingIndex}
              onSave={handleSave}
              onCancel={handleCloseDialog}
              isEditing={true} // Form is always editable when open
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="flex-1 min-h-[300px] flex flex-col overflow-auto w-full mb-4 border rounded-md">
        {fields.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Kayıtlı muayene bulunmamaktadır.</p>
          </div>
        ) : (
          <InspectionTable inspections={enrichedInspections} onEdit={handleEdit} onDelete={handleRemove} />
        )}
      </div>
    </TabsContent>
  );
}
