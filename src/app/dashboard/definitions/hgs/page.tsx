// HGS Tanımları Sayfası
'use client';
import React, { useState } from 'react';
import { useAllHGS } from '@/features/definitions/hgs/use-hgs';
import type { HGS } from '@/features/definitions/hgs/hgs-schema';
import { useHGSMutations } from '@/features/definitions/hgs/use-hgs';
import { HGSForm, HGSList, HGSDeleteConfirmDialog } from '@/features/definitions/hgs/components';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function HGSDefinitionsPage() {
  const { data: hgsList = [], isLoading: hgsLoading } = useAllHGS();
  const { addMutation, updateMutation, deleteMutation } = useHGSMutations();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingHGS, setEditingHGS] = useState<HGS | null>(null);

  // Silme işlemi için onay dialog durumları
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [hgsToDelete, setHGSToDelete] = useState<HGS | null>(null);

  const handleAdd = () => {
    setEditingHGS(null);
    setModalOpen(true);
  };
  const handleEdit = (hgs: HGS) => {
    setEditingHGS(hgs);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingHGS(null);
  };
  const handleSubmit = async (data: any) => {
    try {
      if (editingHGS) {
        updateMutation.mutate({ id: editingHGS.id, data });
      } else {
        addMutation.mutate(data);
      }
      setModalOpen(false);
      setEditingHGS(null);
    } catch (err) {
      console.error('HGS kaydedilirken hata oluştu:', err);
    }
  };

  // Silme işlemini başlat - dialog aç
  const handleDeleteClick = (hgs: HGS) => {
    setHGSToDelete(hgs);
    setConfirmDialogOpen(true);
  };

  // Silme işlemini onayla
  const handleConfirmDelete = () => {
    if (hgsToDelete) {
      deleteMutation.mutate(hgsToDelete.id);
      setConfirmDialogOpen(false);
      setHGSToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <HGSList
        items={hgsList}
        loading={hgsLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      <Sheet open={modalOpen} onOpenChange={setModalOpen}>
        <SheetContent side="right" className="w-[400px]">
          <SheetHeader>
            <SheetTitle>{editingHGS ? 'HGS Kaydını Düzenle' : 'Yeni HGS Kaydı'}</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <HGSForm
              open={modalOpen}
              onClose={handleCloseModal}
              onSubmit={handleSubmit}
              initialData={editingHGS || undefined}
              loading={addMutation.status === 'pending' || updateMutation.status === 'pending'}
            />
          </div>
        </SheetContent>
      </Sheet>
      <HGSDeleteConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        itemToDelete={hgsToDelete}
        isDeleting={deleteMutation.status === 'pending'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialogOpen(false)}
      />
    </div>
  );
}
