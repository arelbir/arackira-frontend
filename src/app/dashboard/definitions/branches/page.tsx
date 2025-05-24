// Şube yönetimi ana sayfası (liste + ekle/düzenle)
'use client';
import React, { useState } from 'react';
import { useBranch, Branch } from '@/features/definitions/branches/useBranch';
import BranchList from '@/features/definitions/branches/branch-list';
import BranchForm from '@/features/definitions/branches/branch-form';

export default function BranchesPage() {
  const { branches, loading, addBranch, editBranch, removeBranch } = useBranch();
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Branch | null>(null);

  const handleAdd = () => {
    setEditData(null);
    setFormOpen(true);
  };
  const handleEdit = (branch: Branch) => {
    setEditData(branch);
    setFormOpen(true);
  };
  const handleDelete = (branch: Branch) => {
    if (window.confirm('Bu şubeyi silmek istediğinize emin misiniz?')) {
      removeBranch(branch.id);
    }
  };
  const handleSubmit = async (data: any) => {
    if (editData) {
      await editBranch(editData.id, data);
    } else {
      await addBranch(data);
    }
    setFormOpen(false);
  };

  return (
    <div className='container py-8'>
      <h1 className='text-2xl font-bold mb-4'>Şubeler</h1>
      <BranchList
        branches={branches}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <BranchForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData || undefined}
        loading={loading}
      />
    </div>
  );
}
