// Ödeme Tipleri Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import PaymentTypeActionsMenu from './payment-type-actions-menu';
import type { PaymentType } from './paymentTypeService';

interface PaymentTypeListProps {
  paymentTypes: PaymentType[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (paymentType: PaymentType) => void;
  onDelete: (paymentType: PaymentType) => void;
}

const PaymentTypeList: React.FC<PaymentTypeListProps> = ({ paymentTypes, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = paymentTypes.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.description && i.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Ödeme tipi ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Ödeme Tipi'
      />
      <div className='relative w-full overflow-x-auto'>
        <table className='w-full caption-bottom text-sm'>
          <thead>
            <tr className='bg-muted text-muted-foreground'>
              <th className='py-2 px-4 text-left'>Ad</th>
              <th className='py-2 px-4 text-left'>Açıklama</th>
              <th className='py-2 px-4 w-12'></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className='text-center py-4 text-muted'>Yükleniyor...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={3} className='text-center py-4 text-muted'>Kayıt bulunamadı.</td></tr>
            ) : (
              filtered.map(paymentType => (
                <tr key={paymentType.id} className='border-b'>
                  <td className='py-2 px-4'>{paymentType.name}</td>
                  <td className='py-2 px-4'>{paymentType.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <PaymentTypeActionsMenu paymentType={paymentType} onEdit={onEdit} onDelete={onDelete} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentTypeList;
