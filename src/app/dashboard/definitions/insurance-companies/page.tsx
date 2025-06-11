// Sigorta Şirketleri Sayfası
'use client';

import React, { useState, useMemo } from 'react';
import { InsuranceCompanyList, InsuranceCompanyForm, InsuranceCompanyDeleteConfirmDialog } from '@/features/definitions/insurance-companies/components';
import { useAllInsuranceCompanies, useInsuranceCompanyMutations } from '@/features/definitions/insurance-companies/use-insurance-companies';
import { InsuranceCompany, InsuranceCompanyFormValues } from '@/features/definitions/insurance-companies/insurance-company-schema';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function InsuranceCompanyDefinitionsPage() {
  // State yönetimi
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<InsuranceCompany | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<InsuranceCompany | null>(null);
  
  // React Query hooks
  const { data: insuranceCompanies = [], isLoading } = useAllInsuranceCompanies();
  const { addInsuranceCompany, updateInsuranceCompany, deleteInsuranceCompany, isAddingInsuranceCompany, isUpdatingInsuranceCompany, isDeletingInsuranceCompany } = useInsuranceCompanyMutations();
  
  // Form işlemleri
  const handleAdd = () => {
    setEditingCompany(null);
    setModalOpen(true);
  };

  const handleEdit = (company: InsuranceCompany) => {
    setEditingCompany(company);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCompany(null);
  };

  // Form gönderim işlemi
  const handleSubmit = (data: InsuranceCompanyFormValues) => {
    try {
      if (editingCompany) {
        updateInsuranceCompany({ id: editingCompany.id, data });
      } else {
        addInsuranceCompany(data);
      }
      setModalOpen(false);
      setEditingCompany(null);
    } catch (err) {
      console.error('Sigorta şirketi kaydedilirken hata oluştu:', err);
    }
  };

  // Silme işlemleri
  const handleDeleteClick = (company: InsuranceCompany) => {
    setCompanyToDelete(company);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (companyToDelete) {
      deleteInsuranceCompany(companyToDelete.id);
      setConfirmDialogOpen(false);
      setCompanyToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setCompanyToDelete(null);
  };
  
  // Şirket verilerini optimize etmek için useMemo kullan
  const processedCompanies = useMemo(() => {
    return insuranceCompanies.map(company => ({
      ...company,
    }));
  }, [insuranceCompanies]);

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 w-full">
        <InsuranceCompanyList
          items={processedCompanies}
          loading={isLoading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
        
        <Sheet open={modalOpen} onOpenChange={setModalOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{editingCompany ? 'Sigorta Şirketi Düzenle' : 'Yeni Sigorta Şirketi'}</SheetTitle>
            </SheetHeader>
            <InsuranceCompanyForm
              open={modalOpen}
              onClose={handleCloseModal}
              onSubmit={handleSubmit}
              initialData={editingCompany ? {
                name: editingCompany.name,
                description: editingCompany.description
              } : undefined}
              loading={isAddingInsuranceCompany || isUpdatingInsuranceCompany}
            />
          </SheetContent>
        </Sheet>

        <InsuranceCompanyDeleteConfirmDialog
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
          itemToDelete={companyToDelete}
          isDeleting={isDeletingInsuranceCompany}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </ProtectedRoute>
  );
}
