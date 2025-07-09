'use client';

import React, { useState } from 'react';
import { CurrencyList, CurrencyForm, CurrencyDeleteConfirmDialog } from '@/features/definitions/currencies/components';
import { useAllCurrencies, useCurrencyMutations } from '@/features/definitions/currencies/use-currencies';
import { Currency, CurrencyFormValues } from '@/features/definitions/currencies/currency-schema';

export default function CurrencyDefinitionsPage() {
  // State yönetimi
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // React Query hooks
  const { data: currencies = [], isLoading } = useAllCurrencies();
  const { addCurrency, updateCurrency, deleteCurrency, isAddingCurrency, isUpdatingCurrency, isDeletingCurrency } = useCurrencyMutations();
  
  // Yükleme durumu
  const isFormLoading = isAddingCurrency || isUpdatingCurrency;
  const isDeleting = isDeletingCurrency;

  // Form açma/kapama işlemleri
  const handleOpenForm = (currency?: Currency) => {
    setSelectedCurrency(currency || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedCurrency(null);
  };

  // Form gönderim işlemi
  const handleSubmitForm = (data: CurrencyFormValues) => {
    if (selectedCurrency) {
      updateCurrency({ id: selectedCurrency.id, data });
    } else {
      addCurrency(data);
    }
    setIsFormOpen(false);
  };

  // Silme dialogu açma/kapama işlemleri
  const handleDeleteClick = (currency: Currency) => {
    setSelectedCurrency(currency);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCurrency) {
      deleteCurrency(selectedCurrency.id);
    }
    setIsDeleteDialogOpen(false);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <CurrencyList
        items={currencies} 
        loading={isLoading}
        onAdd={() => handleOpenForm()}
        onEdit={handleOpenForm}
        onDelete={handleDeleteClick}
      />

      <CurrencyForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        initialData={selectedCurrency ? {
          code: selectedCurrency.code,
          name: selectedCurrency.name,
          symbol: selectedCurrency.symbol,
          description: selectedCurrency.description
        } : undefined}
        loading={isFormLoading}
      />

      <CurrencyDeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen} 
        itemToDelete={selectedCurrency}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
