// Ajanslar Sayfası
'use client';
import React, { useState } from 'react';
import { AgencyList, AgencyForm, AgencyDeleteConfirmDialog } from '@/features/definitions/agencies/components';
import { useAllAgencies, useAgencyMutations } from '@/features/definitions/agencies/use-agencies';
import type { Agency } from '@/features/definitions/agencies/agency-schema';
import { AgencyFormValues } from '@/features/definitions/agencies/agency-schema';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AgenciesPage() {
  // Veri yükleme
  const { data: agencies, isLoading } = useAllAgencies();
  
  // Mutasyon hook'ları
  const { addAgency, updateAgency, deleteAgency, isPending } = useAgencyMutations();

  // UI durum yönetimi
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  
  // Silme işlemi için onay dialog durumları
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [agencyToDelete, setAgencyToDelete] = useState<Agency | null>(null);

  // Ekleme işlevleri
  const handleAdd = () => {
    setEditingAgency(null);
    setModalOpen(true);
  };

  // Düzenleme işlevleri
  const handleEdit = (agency: Agency) => {
    setEditingAgency(agency);
    setModalOpen(true);
  };
  
  // Modal kapatma
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingAgency(null);
  };

  // Form gönderimi
  const handleSubmit = (data: AgencyFormValues) => {
    try {
      if (editingAgency) {
        updateAgency({ id: editingAgency.id, data });
      } else {
        addAgency(data);
      }
      setModalOpen(false);
      setEditingAgency(null);
    } catch (err) {
      console.error('Acente kaydedilirken hata oluştu:', err);
    }
  };

  // Silme işlemini başlat - dialog aç
  const handleDeleteClick = (agency: Agency) => {
    setAgencyToDelete(agency);
    setConfirmDialogOpen(true);
  };

  // Silme işlemini onayla
  const handleConfirmDelete = () => {
    if (agencyToDelete) {
      deleteAgency(agencyToDelete.id);
      setConfirmDialogOpen(false);
      setAgencyToDelete(null);
    }
  };

  // Silme işlemini iptal et
  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setAgencyToDelete(null);
  };

  return (
    <ProtectedRoute>
      <div className='container mx-auto py-8 w-full'>
        <AgencyList
          items={agencies || []}
          loading={isLoading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
        
        {/* Form Sheet */}
        <Sheet open={modalOpen} onOpenChange={setModalOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{editingAgency ? 'Acente Düzenle' : 'Yeni Acente'}</SheetTitle>
            </SheetHeader>
            <AgencyForm
              open={modalOpen}
              onClose={handleCloseModal}
              onSubmit={handleSubmit}
              initialData={editingAgency ? {
                name: editingAgency.name,
                description: editingAgency.description
              } : undefined}
              loading={isPending}
            />
          </SheetContent>
        </Sheet>
        
        {/* Silme onay dialogs */}
        <AgencyDeleteConfirmDialog
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
          itemToDelete={agencyToDelete}
          isDeleting={isPending}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </ProtectedRoute>
  );
}

