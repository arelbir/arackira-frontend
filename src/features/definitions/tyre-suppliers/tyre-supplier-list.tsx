// Tedarikçiler Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import TyreSupplierActionsMenu from './tyre-supplier-actions-menu';
import type { TyreSupplier } from './tyreSupplierService';

interface TyreSupplierListProps {
  tyreSuppliers: TyreSupplier[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (tyreSupplier: TyreSupplier) => void;
  onDelete: (tyreSupplier: TyreSupplier) => void;
}

const TyreSupplierList: React.FC<TyreSupplierListProps> = ({ tyreSuppliers, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = tyreSuppliers.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.description && i.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Tedarikçi ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Tedarikçi'
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
              filtered.map((tyreSupplier, idx) => (
                <tr key={tyreSupplier.id ?? `tyre-supplier-row-${idx}`} className='border-b'>
                  <td className='py-2 px-4'>{tyreSupplier.name}</td>
                  <td className='py-2 px-4'>{tyreSupplier.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <TyreSupplierActionsMenu tyreSupplier={tyreSupplier} onEdit={onEdit} onDelete={onDelete} />
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

export default TyreSupplierList;
