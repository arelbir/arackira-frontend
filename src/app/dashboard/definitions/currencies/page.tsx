// Para Birimleri Sayfası
'use client';
import React, { useState } from 'react';
import CurrencyList from '@/features/definitions/currencies/currency-list';
import CurrencyForm from '@/features/definitions/currencies/currency-form';
import { useCurrency } from '@/features/definitions/currencies/useCurrency';
import { useAuth } from '@/hooks/useAuth';
import type { Currency } from '@/features/definitions/currencies/currencyService';
import ProtectedRoute from '@/components/ProtectedRoute';

const CurrenciesPage = () => {
  const { token } = useAuth();
  const {
    currencies,
    loading,
    addCurrency,
    editCurrency,
    removeCurrency
  } = useCurrency(token);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<Currency> | undefined>(undefined);

  const handleAdd = () => {
    setEditData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (currency: Currency) => {
    setEditData(currency);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editData && editData.id) {
      await editCurrency(editData.id, data);
    } else {
      await addCurrency(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (currency: Currency) => {
    await removeCurrency(currency.id);
  };

  return (
    <ProtectedRoute>
      <CurrencyList
        currencies={currencies}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <CurrencyForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default CurrenciesPage;
