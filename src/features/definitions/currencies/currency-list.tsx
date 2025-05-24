// Para Birimleri Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import CurrencyActionsMenu from './currency-actions-menu';
import type { Currency } from './currencyService';

interface CurrencyListProps {
  currencies: Currency[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (currency: Currency) => void;
  onDelete: (currency: Currency) => void;
}

const CurrencyList: React.FC<CurrencyListProps> = ({ currencies, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = currencies.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.description && i.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Para birimi ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Para Birimi'
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
              filtered.map((currency, idx) => (
                <tr key={currency.id ?? `currency-row-${idx}`} className='border-b'>
                  <td className='py-2 px-4'>{currency.name}</td>
                  <td className='py-2 px-4'>{currency.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <CurrencyActionsMenu currency={currency} onEdit={onEdit} onDelete={onDelete} />
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

export default CurrencyList;
