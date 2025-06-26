// Ödeme Hesapları Sayfası
'use client';
import React, { useState } from 'react';
import PaymentAccountList from '@/features/definitions/payment-accounts/payment-account-list';
import PaymentAccountForm from '@/features/definitions/payment-accounts/payment-account-form';
import { usePaymentAccount } from '@/features/definitions/payment-accounts/usePaymentAccount';
import { useAuth } from '@/hooks/useAuth';
import type { PaymentAccount } from '@/features/definitions/payment-accounts/paymentAccountService';
import ProtectedRoute from '@/components/ProtectedRoute';

const PaymentAccountsPage = () => {
  const { token } = useAuth();
  const {
    paymentAccounts,
    loading,
    addPaymentAccount,
    editPaymentAccount,
    removePaymentAccount
  } = usePaymentAccount(token);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<PaymentAccount> | undefined>(undefined);

  const handleAdd = () => {
    setEditData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (paymentAccount: PaymentAccount) => {
    setEditData(paymentAccount);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editData && editData.id) {
      await editPaymentAccount(editData.id, data);
    } else {
      await addPaymentAccount(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (paymentAccount: PaymentAccount) => {
    await removePaymentAccount(paymentAccount.id);
  };

  return (
    <ProtectedRoute>
      <PaymentAccountList
        paymentAccounts={paymentAccounts}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <PaymentAccountForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default PaymentAccountsPage;
