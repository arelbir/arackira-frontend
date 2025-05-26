// Lastik Pozisyonları Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import TirePositionActionsMenu from './tire-position-actions-menu';
import type { TirePosition } from './tirePositionService';

interface TirePositionListProps {
  tirePositions: TirePosition[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (tirePosition: TirePosition) => void;
  onDelete: (tirePosition: TirePosition) => void;
}

const TirePositionList: React.FC<TirePositionListProps> = ({ tirePositions, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = tirePositions.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.description && i.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Pozisyon ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Pozisyon'
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
              filtered.map((tirePosition, idx) => (
                <tr key={tirePosition.id ?? `tire-position-row-${idx}`} className='border-b'>
                  <td className='py-2 px-4'>{tirePosition.name}</td>
                  <td className='py-2 px-4'>{tirePosition.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <TirePositionActionsMenu tirePosition={tirePosition} onEdit={onEdit} onDelete={onDelete} />
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

export default TirePositionList;
