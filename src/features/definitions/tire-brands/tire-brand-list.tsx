// Lastik Markaları Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import TireBrandActionsMenu from './tire-brand-actions-menu';
import type { TireBrand } from './tireBrandService';

interface TireBrandListProps {
  tireBrands: TireBrand[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (tireBrand: TireBrand) => void;
  onDelete: (tireBrand: TireBrand) => void;
}

const TireBrandList: React.FC<TireBrandListProps> = ({ tireBrands, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = tireBrands.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.description && i.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Marka ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Marka'
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
              filtered.map((tireBrand, idx) => (
                <tr key={tireBrand.id ?? `tire-brand-row-${idx}`} className='border-b'>
                  <td className='py-2 px-4'>{tireBrand.name}</td>
                  <td className='py-2 px-4'>{tireBrand.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <TireBrandActionsMenu tireBrand={tireBrand} onEdit={onEdit} onDelete={onDelete} />
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

export default TireBrandList;
