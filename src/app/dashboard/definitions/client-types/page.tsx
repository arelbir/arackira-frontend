// Müşteri Tipleri Sayfası - Yeni hook tabanlı mimari ile güncellendi
'use client';
import React, { useState } from 'react';
import { useAllClientTypes } from '@/features/definitions/client-types/use-client-types';
import { useClientTypeMutations } from '@/features/definitions/client-types/use-client-types';
import type { ClientType } from '@/features/definitions/client-types/client-type-schema';
import { ClientTypeForm, ClientTypeList, ClientTypeDeleteConfirmDialog } from '@/features/definitions/client-types/components';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ClientTypesDefinitionsPage() {
  // Yeni hook'ları kullan
  const { data: clientTypes, isLoading: clientTypesLoading } = useAllClientTypes();
  const { addClientType, updateClientType, deleteClientType, isAddingClientType, isUpdatingClientType, isDeletingClientType } = useClientTypeMutations();

  // UI durumları
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClientType, setEditingClientType] = useState<ClientType | null>(null);
  
  // Silme işlemi için onay dialog durumları
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [clientTypeToDelete, setClientTypeToDelete] = useState<ClientType | null>(null);

  // Yönetim fonksiyonları
  const handleAdd = () => {
    setEditingClientType(null);
    setModalOpen(true);
  };

  const handleEdit = (clientType: ClientType) => {
    setEditingClientType(clientType);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingClientType(null);
  };

  const handleSubmit = async (data: { name: string; description?: string }) => {
    try {
      if (editingClientType) {
        updateClientType({ id: editingClientType.id, data });
      } else {
        addClientType(data);
      }
      setModalOpen(false);
      setEditingClientType(null);
    } catch (err) {
      console.error('Müşteri tipi kaydedilirken hata oluştu:', err);
    }
  };

  // Silme işlemini başlat - dialog aç
  const handleDeleteClick = (clientType: ClientType) => {
    setClientTypeToDelete(clientType);
    setConfirmDialogOpen(true);
  };

  // Silme işlemini onayla
  const handleConfirmDelete = () => {
    if (clientTypeToDelete) {
      deleteClientType(clientTypeToDelete.id);
      setConfirmDialogOpen(false);
      setClientTypeToDelete(null);
    }
  };

  // Silme işlemini iptal et
  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setClientTypeToDelete(null);
  };

  return (
    <ProtectedRoute>
      <div className='container mx-auto py-8 w-full'>
        <ClientTypeList
          items={clientTypes || []}
          loading={clientTypesLoading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
        <Sheet open={modalOpen} onOpenChange={setModalOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{editingClientType ? 'Müşteri Tipi Düzenle' : 'Yeni Müşteri Tipi'}</SheetTitle>
            </SheetHeader>
            <ClientTypeForm
              open={modalOpen}
              onClose={handleCloseModal}
              onSubmit={handleSubmit}
              initialData={editingClientType ? {
                name: editingClientType.name,
                description: editingClientType.description
              } : undefined}
              loading={isAddingClientType || isUpdatingClientType}
            />
          </SheetContent>
        </Sheet>
        
        {/* Silme onay dialog'u */}
        <ClientTypeDeleteConfirmDialog
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
          itemToDelete={clientTypeToDelete}
          isDeleting={isDeletingClientType}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </ProtectedRoute>
  );
}
