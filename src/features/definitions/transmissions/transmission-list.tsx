// Vites Tipleri Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import TransmissionActionsMenu from './transmission-actions-menu';
import type { Transmission } from './transmissionService';

interface TransmissionListProps {
  transmissions: Transmission[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (transmission: Transmission) => void;
  onDelete: (transmission: Transmission) => void;
}

const TransmissionList: React.FC<TransmissionListProps> = ({ transmissions, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = transmissions.filter(t =>
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
              filtered.map(transmission => (
                <tr key={transmission.id} className='border-b'>
                  <td className='py-2 px-4'>{transmission.name}</td>
                  <td className='py-2 px-4'>{transmission.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <TransmissionActionsMenu transmission={transmission} onEdit={onEdit} onDelete={onDelete} />
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

export default TransmissionList;
