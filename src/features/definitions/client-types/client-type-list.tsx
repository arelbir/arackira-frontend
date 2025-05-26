// Müşteri Tipleri Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import ClientTypeActionsMenu from './client-type-actions-menu';
import type { ClientType } from './clientTypeService';

interface ClientTypeListProps {
  clientTypes: ClientType[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (clientType: ClientType) => void;
  onDelete: (clientType: ClientType) => void;
}

const ClientTypeList: React.FC<ClientTypeListProps> = ({ clientTypes, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = clientTypes.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Müşteri tipi ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Müşteri Tipi'
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
              filtered.map(clientType => (
                <tr key={clientType.id} className='border-b'>
                  <td className='py-2 px-4'>{clientType.name}</td>
                  <td className='py-2 px-4'>{clientType.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <ClientTypeActionsMenu clientType={clientType} onEdit={onEdit} onDelete={onDelete} />
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

export default ClientTypeList;
