// Tedarikçi Kategorileri Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import SupplierCategoryActionsMenu from './supplier-category-actions-menu';
import type { SupplierCategory } from './supplierCategoryService';

interface SupplierCategoryListProps {
  supplierCategories: SupplierCategory[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (supplierCategory: SupplierCategory) => void;
  onDelete: (supplierCategory: SupplierCategory) => void;
}

const SupplierCategoryList: React.FC<SupplierCategoryListProps> = ({ supplierCategories, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = supplierCategories.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.description && i.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Tedarikçi kategorisi ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Tedarikçi Kategorisi'
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
              filtered.map((supplierCategory, idx) => (
                <tr key={supplierCategory.id ?? `supplier-category-row-${idx}`} className='border-b'>
                  <td className='py-2 px-4'>{supplierCategory.name}</td>
                  <td className='py-2 px-4'>{supplierCategory.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <SupplierCategoryActionsMenu supplierCategory={supplierCategory} onEdit={onEdit} onDelete={onDelete} />
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

export default SupplierCategoryList;
