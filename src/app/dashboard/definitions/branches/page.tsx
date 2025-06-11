// Şube tanımları sayfası - Yeni hook tabanlı mimari ile güncellendi
'use client';
import React, { useState } from 'react';
import { useAllBranches } from '@/features/definitions/branches/use-branches';
import { useBranchMutations } from '@/features/definitions/branches/use-branches';
import type { Branch } from '@/features/definitions/branches/branch-schema';
import { BranchForm, BranchList, BranchDeleteConfirmDialog } from '@/features/definitions/branches/components';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function BranchesDefinitionsPage() {
  // Yeni hook'ları kullan
  const { data: branches, isLoading: branchesLoading } = useAllBranches();
  const { addBranch, updateBranch, deleteBranch, isAddingBranch, isUpdatingBranch, isDeletingBranch } = useBranchMutations();

  // UI durumları
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  
  // Silme işlemi için onay dialog durumları
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);

  // Yönetim fonksiyonları
  const handleAdd = () => {
    setEditingBranch(null);
    setModalOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingBranch(null);
  };

  const handleSubmit = async (data: { name: string; address?: string; phone?: string }) => {
    try {
      if (editingBranch) {
        updateBranch({ id: editingBranch.id, data });
      } else {
        addBranch(data);
      }
      setModalOpen(false);
      setEditingBranch(null);
    } catch (err) {
      console.error('Şube kaydedilirken hata oluştu:', err);
    }
  };

  // Silme işlemini başlat - dialog aç
  const handleDeleteClick = (branch: Branch) => {
    setBranchToDelete(branch);
    setConfirmDialogOpen(true);
  };

  // Silme işlemini onayla
  const handleConfirmDelete = () => {
    if (branchToDelete) {
      deleteBranch(branchToDelete.id);
      setConfirmDialogOpen(false);
      setBranchToDelete(null);
    }
  };

  // Silme işlemini iptal et
  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setBranchToDelete(null);
  };

  return (
    <div className='container mx-auto py-8 w-full'>
      <BranchList
        items={branches || []}
        loading={branchesLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      <Sheet open={modalOpen} onOpenChange={setModalOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingBranch ? 'Şube Düzenle' : 'Yeni Şube'}</SheetTitle>
          </SheetHeader>
          <BranchForm
            open={modalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
            initialData={editingBranch ? {
              name: editingBranch.name,
              address: editingBranch.address,
              phone: editingBranch.phone
            } : undefined}
            loading={isAddingBranch || isUpdatingBranch}
          />
        </SheetContent>
      </Sheet>
      
      {/* Silme onay dialog'u */}
      <BranchDeleteConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        itemToDelete={branchToDelete}
        isDeleting={isDeletingBranch}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
