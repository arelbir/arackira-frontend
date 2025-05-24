// Ödeme Tipleri Sayfası
'use client';
import React, { useState } from 'react';
import PaymentTypeList from '@/features/definitions/payment-types/payment-type-list';
import PaymentTypeForm from '@/features/definitions/payment-types/payment-type-form';
import { usePaymentType } from '@/features/definitions/payment-types/usePaymentType';
import { useAuth } from '@/hooks/useAuth';
import type { PaymentType } from '@/features/definitions/payment-types/paymentTypeService';
import ProtectedRoute from '@/components/ProtectedRoute';

const PaymentTypesPage = () => {
  const { token } = useAuth();
  const {
    paymentTypes,
    loading,
    addPaymentType,
    editPaymentType,
    removePaymentType
  } = usePaymentType(token);

  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<PaymentType> | undefined>(undefined);

  const handleAdd = () => {
    setEditData(undefined);
    setFormOpen(true);
  };

  const handleEdit = (paymentType: PaymentType) => {
    setEditData(paymentType);
    setFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editData && editData.id) {
      await editPaymentType(editData.id, data);
    } else {
      await addPaymentType(data);
    }
    setFormOpen(false);
  };

  const handleDelete = async (paymentType: PaymentType) => {
    await removePaymentType(paymentType.id);
  };

  return (
    <ProtectedRoute>
      <PaymentTypeList
        paymentTypes={paymentTypes}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <PaymentTypeForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={loading}
      />
    </ProtectedRoute>
  );
};

export default PaymentTypesPage;
