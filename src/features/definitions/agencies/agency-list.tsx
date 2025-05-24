// Ajanslar Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import AgencyActionsMenu from './agency-actions-menu';
import type { Agency } from './agencyService';

interface AgencyListProps {
  agencies: Agency[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (agency: Agency) => void;
  onDelete: (agency: Agency) => void;
}

const AgencyList: React.FC<AgencyListProps> = ({ agencies, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = agencies.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.description && i.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Ajans ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Ajans'
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
              filtered.map(agency => (
                <tr key={agency.id} className='border-b'>
                  <td className='py-2 px-4'>{agency.name}</td>
                  <td className='py-2 px-4'>{agency.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <AgencyActionsMenu agency={agency} onEdit={onEdit} onDelete={onDelete} />
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

export default AgencyList;
