// Vites Tipleri Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import useTransmissionActionsMenu from './useTransmission-actions-menu';
import type { useTransmission } from './useTransmission';

interface useTransmissionListProps {
  useTransmissions: useTransmission[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (useTransmission: useTransmission) => void;
  onDelete: (useTransmission: useTransmission) => void;
}

const useTransmissionList: React.FC<useTransmissionListProps> = ({ useTransmissions, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = useTransmissions.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Vites tipi ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Vites Tipi'
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
              filtered.map(useTransmission => (
                <tr key={useTransmission.id} className='border-b'>
                  <td className='py-2 px-4'>{useTransmission.name}</td>
                  <td className='py-2 px-4'>{useTransmission.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <useTransmissionActionsMenu useTransmission={useTransmission} onEdit={onEdit} onDelete={onDelete} />
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

export default useTransmissionList;
