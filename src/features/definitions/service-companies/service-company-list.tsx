// Servis Şirketleri Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import ServiceCompanyActionsMenu from './service-company-actions-menu';
import type { ServiceCompany } from './serviceCompanyService';

interface ServiceCompanyListProps {
  serviceCompanies: ServiceCompany[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (serviceCompany: ServiceCompany) => void;
  onDelete: (serviceCompany: ServiceCompany) => void;
}

const ServiceCompanyList: React.FC<ServiceCompanyListProps> = ({ serviceCompanies, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = serviceCompanies.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.description && i.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Servis şirketi ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Servis Şirketi'
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
              filtered.map(serviceCompany => (
                <tr key={serviceCompany.id} className='border-b'>
                  <td className='py-2 px-4'>{serviceCompany.name}</td>
                  <td className='py-2 px-4'>{serviceCompany.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <ServiceCompanyActionsMenu serviceCompany={serviceCompany} onEdit={onEdit} onDelete={onDelete} />
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

export default ServiceCompanyList;
