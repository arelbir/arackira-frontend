// Servis Tipleri Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import ServiceTypeActionsMenu from './service-type-actions-menu';
import type { ServiceType } from './serviceTypeService';

interface ServiceTypeListProps {
  serviceTypes: ServiceType[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (serviceType: ServiceType) => void;
  onDelete: (serviceType: ServiceType) => void;
}

const ServiceTypeList: React.FC<ServiceTypeListProps> = ({ serviceTypes, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = serviceTypes.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.description && i.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Servis tipi ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Servis Tipi'
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
              filtered.map((serviceType, idx) => (
                <tr key={serviceType.id ?? `service-type-row-${idx}`} className='border-b'>
                  <td className='py-2 px-4'>{serviceType.name}</td>
                  <td className='py-2 px-4'>{serviceType.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <ServiceTypeActionsMenu serviceType={serviceType} onEdit={onEdit} onDelete={onDelete} />
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

export default ServiceTypeList;
