"use client";

import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { VehicleFormValues } from '@/features/vehicle/schemas/vehicle.schemas';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription, DrawerClose } from '@/components/ui/drawer';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { GPSForm } from './GPSForm';
import { GPSTable } from './GPSTable';
import { Gps, NEW_GPS_RECORD, GPS_MESSAGES } from './gps-constants';
import { PlusIcon } from 'lucide-react';
import { TabContentWrapper } from '../components/TabContentWrapper';

// onSubmit prop'u artık TabNavigator tarafından yönetildiği için kaldırıldı.
export function GPSTab() {
    const { control, trigger } = useFormContext<VehicleFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'gps' });

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | null>(null);
  const [selectedGpsIndex, setSelectedGpsIndex] = useState<number | null>(null);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [itemToDeleteIndex, setItemToDeleteIndex] = useState<number | null>(null);

  const { getValues, setValue } = useFormContext<VehicleFormValues>();

  const handleEdit = (index: number) => {
    openDialog('edit', index);
  };

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
    // "Ekle" modunda diyalog kapatılırsa ve kullanıcı bir şey girmeden kapatıyorsa, kaydı kaldır.
    if (dialogMode === 'add' && selectedGpsIndex !== null) {
        // Not: Bu kısım daha akıllı hale getirilebilir. 
        // Örneğin, kullanıcının forma herhangi bir veri girip girmediğini kontrol edebiliriz.
        // Şimdilik, ekleme modunda iptal her zaman kaydı kaldırır.
        remove(selectedGpsIndex);
    }
    setDialogOpen(false);
    setDialogMode(null);
    setSelectedGpsIndex(null);
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

    // Eğer kayıt veritabanında mevcutsa (ID'si varsa), ID'sini silinecekler listesine ekle.
    if (itemToDelete.id) {
        const currentDeletedIds = getValues('deleted_ids.gps') || [];
        setValue('deleted_ids.gps', [...currentDeletedIds, itemToDelete.id]);
    }

    // Kaydı UI'dan (useFieldArray state'inden) kaldır.
    remove(itemToDeleteIndex);
    
    closeDeleteAlert();
  };

  const handleSave = async () => {
    if (selectedGpsIndex === null) return;

    const isValid = await trigger(`gps.${selectedGpsIndex}`);
    if (isValid) {
      // Sadece diyaloğu kapat, ana kaydetme işlemi TabNavigator'dan yapılacak.
      setDialogOpen(false);
      setDialogMode(null);
      setSelectedGpsIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Uydu Takip (GPS) Kayıtları</h3>
        <Drawer open={isDialogOpen} onOpenChange={setDialogOpen} direction="right">
          <DrawerTrigger asChild>
            <Button type="button" onClick={() => openDialog('add')}>
            <PlusIcon className="size-4 mr-2" />
              Yeni GPS Ekle
            </Button>
          </DrawerTrigger>
          <DrawerContent className="w-full md:w-1/2 lg:w-2/5 p-4">
            <DrawerHeader className="text-left px-0 pt-0">
              <DrawerTitle>{dialogMode === 'add' ? 'Yeni GPS Ekle' : 'GPS Düzenle'}</DrawerTitle>
              <DrawerDescription>
                Araç için GPS bilgilerini buradan ekleyebilir veya güncelleyebilirsiniz.
              </DrawerDescription>
            </DrawerHeader>
            
            <div className="p-4 overflow-y-auto">
              {selectedGpsIndex !== null && (
                <GPSForm 
                  index={selectedGpsIndex} 
                />
              )}
            </div>
            <DrawerFooter className="pt-4 flex-row justify-end border-t">
              <DrawerClose asChild>
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    İptal
                  </Button>
              </DrawerClose>
              <Button type="button" onClick={handleSave}>
                Kaydet
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      <TabContentWrapper isEmpty={fields.length === 0} emptyMessage="Kayıtlı GPS bulunmamaktadır.">
        <GPSTable 
          gpsRecords={fields as Gps[]} 
          onEdit={handleEdit} 
          onDelete={openDeleteAlert} 
        />
      </TabContentWrapper>

      {/* Silme Onayı için AlertDialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{GPS_MESSAGES.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {GPS_MESSAGES.deleteMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteAlert}>{GPS_MESSAGES.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>{GPS_MESSAGES.delete}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


