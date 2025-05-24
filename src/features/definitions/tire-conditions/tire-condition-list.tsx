// Lastik Durumları Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import TireConditionActionsMenu from './tire-condition-actions-menu';
import type { TireCondition } from './tireConditionService';

interface TireConditionListProps {
  tireConditions: TireCondition[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (tireCondition: TireCondition) => void;
  onDelete: (tireCondition: TireCondition) => void;
}

const TireConditionList: React.FC<TireConditionListProps> = ({ tireConditions, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = tireConditions.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.description && i.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Durum ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Durum'
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
              filtered.map((tireCondition, idx) => (
                <tr key={tireCondition.id ?? `tire-condition-row-${idx}`} className='border-b'>
                  <td className='py-2 px-4'>{tireCondition.name}</td>
                  <td className='py-2 px-4'>{tireCondition.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <TireConditionActionsMenu tireCondition={tireCondition} onEdit={onEdit} onDelete={onDelete} />
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

export default TireConditionList;
