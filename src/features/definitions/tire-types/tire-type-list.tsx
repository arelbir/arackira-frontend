// Lastik Tipleri Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import TireTypeActionsMenu from './tire-type-actions-menu';
import type { TireType } from './tireTypeService';

interface TireTypeListProps {
  tireTypes: TireType[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (tireType: TireType) => void;
  onDelete: (tireType: TireType) => void;
}

const TireTypeList: React.FC<TireTypeListProps> = ({ tireTypes, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = tireTypes.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.description && i.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Tip ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Tip'
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
              filtered.map((tireType, idx) => (
                <tr key={tireType.id ?? `tire-type-row-${idx}`} className='border-b'>
                  <td className='py-2 px-4'>{tireType.name}</td>
                  <td className='py-2 px-4'>{tireType.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <TireTypeActionsMenu tireType={tireType} onEdit={onEdit} onDelete={onDelete} />
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

export default TireTypeList;
