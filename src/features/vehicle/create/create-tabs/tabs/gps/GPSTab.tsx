"use client";

import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { VehicleFormValues } from '@/features/vehicle/schemas/vehicle.schemas';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { GPSForm } from './GPSForm';
import { GPSTable } from './GPSTable';
import { Gps, NEW_GPS_RECORD, GPS_MESSAGES } from './gps-constants';

interface GPSTabProps {
  onSubmit: (data: VehicleFormValues) => void;
}

export function GPSTab({ onSubmit }: GPSTabProps) {
    const { control, trigger, handleSubmit } = useFormContext<VehicleFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'gps' });

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | null>(null);
  const [selectedGpsIndex, setSelectedGpsIndex] = useState<number | null>(null);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const openDialog = (mode: 'add' | 'edit', index?: number) => {
    setDialogMode(mode);
    if (mode === 'add') {
      const newIndex = fields.length;
      append(NEW_GPS_RECORD, { shouldFocus: false });
      setSelectedGpsIndex(newIndex);
    } else if (index !== undefined) {
      setSelectedGpsIndex(index);
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    // "Ekle" modunda diyalog kapatılırsa, yeni eklenen ama kaydedilmeyen boş kaydı kaldır.
    if (dialogMode === 'add' && selectedGpsIndex !== null) {
      remove(selectedGpsIndex);
    }
    setDialogOpen(false);
    setDialogMode(null);
    setSelectedGpsIndex(null);
  };

  const handleSave = async () => {
    if (selectedGpsIndex === null) return;

    const isValid = await trigger(`gps.${selectedGpsIndex}`);
    if (isValid) {
      await handleSubmit(onSubmit)();
      setDialogOpen(false);
      setDialogMode(null);
      setSelectedGpsIndex(null);
    }
  };

  const handleDelete = (index: number) => {
    setSelectedGpsIndex(index);
    setDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (selectedGpsIndex !== null) {
      remove(selectedGpsIndex);
    }
    setDeleteAlertOpen(false);
    setSelectedGpsIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Uydu Takip (GPS) Kayıtları</h3>
        <Button type="button" onClick={() => openDialog('add')}>
          Yeni GPS Ekle
        </Button>
      </div>

      <div className="flex-1 min-h-[300px] flex flex-col overflow-auto w-full mb-4 border rounded-md">
        {fields.length > 0 ? (
          <GPSTable
            gpsRecords={fields as Gps[]}
            onEdit={(index) => openDialog('edit', index)}
            onDelete={handleDelete}
            highlightedIndex={dialogMode === 'add' ? selectedGpsIndex : null}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Henüz GPS kaydı eklenmemiş.</p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => (open ? setDialogOpen(true) : closeDialog())}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'add' ? GPS_MESSAGES.NEW : GPS_MESSAGES.EDIT}</DialogTitle>
            <DialogDescription>
              Bu ekranda araç için yeni bir GPS kaydı oluşturabilir veya mevcut bir kaydı güncelleyebilirsiniz.
            </DialogDescription>
          </DialogHeader>
          {selectedGpsIndex !== null && <GPSForm index={selectedGpsIndex} />}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>
              İptal
            </Button>
            <Button type="button" onClick={handleSave}>
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>{GPS_MESSAGES.DELETE_CONFIRM}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Sil</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


