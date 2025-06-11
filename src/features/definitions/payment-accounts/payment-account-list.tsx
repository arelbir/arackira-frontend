// Ödeme Hesapları Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import PaymentAccountActionsMenu from './payment-account-actions-menu';
import type { PaymentAccount } from './paymentAccountService';

interface PaymentAccountListProps {
  paymentAccounts: PaymentAccount[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (paymentAccount: PaymentAccount) => void;
  onDelete: (paymentAccount: PaymentAccount) => void;
}

const PaymentAccountList: React.FC<PaymentAccountListProps> = ({ paymentAccounts, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = paymentAccounts.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.description && i.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Ödeme hesabı ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Ödeme Hesabı'
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
              filtered.map(paymentAccount => (
                <tr key={paymentAccount.id} className='border-b'>
                  <td className='py-2 px-4'>{paymentAccount.name}</td>
                  <td className='py-2 px-4'>{paymentAccount.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <PaymentAccountActionsMenu paymentAccount={paymentAccount} onEdit={onEdit} onDelete={onDelete} />
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

export default PaymentAccountList;
