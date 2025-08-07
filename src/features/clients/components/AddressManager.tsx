'use client';

import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription, DrawerClose } from '@/components/ui/drawer';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AddressForm } from './AddressForm';
import { AddressTable } from './AddressTable';
import { PlusIcon } from 'lucide-react';
import type { ClientCompanyFormValues, ClientAddress } from '../schemas/client.schema';

const NEW_ADDRESS_RECORD: ClientAddress = {
  address_title: '',
  street: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
};

export function AddressManager() {
  const { control, trigger, getValues, setValue } = useFormContext<ClientCompanyFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'addresses' });

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | null>(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [itemToDeleteIndex, setItemToDeleteIndex] = useState<number | null>(null);

  const handleEdit = (index: number) => {
    openDialog('edit', index);
  };

  const openDialog = (mode: 'add' | 'edit', index?: number) => {
    setDialogMode(mode);
    if (mode === 'add') {
      const newIndex = fields.length;
      append(NEW_ADDRESS_RECORD, { shouldFocus: false });
      setSelectedAddressIndex(newIndex);
    } else if (index !== undefined) {
      setSelectedAddressIndex(index);
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (dialogMode === 'add' && selectedAddressIndex !== null) {
      remove(selectedAddressIndex);
    }
    setDialogOpen(false);
    setDialogMode(null);
    setSelectedAddressIndex(null);
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
    const itemToDelete = fields[itemToDeleteIndex] as ClientAddress;
    if (itemToDelete.id) {
      const currentDeletedIds = getValues('deleted_ids.addresses') || [];
      setValue('deleted_ids.addresses', [...currentDeletedIds, itemToDelete.id]);
    }
    remove(itemToDeleteIndex);
    closeDeleteAlert();
  };

  const handleSave = async () => {
    if (selectedAddressIndex === null) return;
    const isValid = await trigger(`addresses.${selectedAddressIndex}`);
    if (isValid) {
      setDialogOpen(false);
      setDialogMode(null);
      setSelectedAddressIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Adres Kayıtları</h3>
        <Drawer open={isDialogOpen} onOpenChange={setDialogOpen} direction="right">
          <DrawerTrigger asChild>
            <Button type="button" onClick={() => openDialog('add')}>
              <PlusIcon className="size-4 mr-2" />
              Yeni Adres Ekle
            </Button>
          </DrawerTrigger>
          <DrawerContent className="w-full md:w-1/2 lg:w-2/5 p-4">
            <DrawerHeader className="text-left px-0 pt-0">
              <DrawerTitle>{dialogMode === 'add' ? 'Yeni Adres Ekle' : 'Adresi Düzenle'}</DrawerTitle>
              <DrawerDescription>
                Müşteri için adres bilgilerini buradan ekleyebilir veya güncelleyebilirsiniz.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 overflow-y-auto">
              {selectedAddressIndex !== null && (
                <AddressForm index={selectedAddressIndex} />
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

      {fields.length > 0 ? (
        <AddressTable 
          addresses={fields as ClientAddress[]}
          onEdit={handleEdit} 
          onDelete={openDeleteAlert} 
        />
      ) : (
        <p className="text-sm text-muted-foreground">Kayıtlı adres bulunmamaktadır.</p>
      )}

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Adresi Silmek İstediğinizden Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Bu adres kalıcı olarak silinecektir.
            </AlertDialogDescription>
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
