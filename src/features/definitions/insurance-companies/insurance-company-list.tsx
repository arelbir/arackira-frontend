// Sigorta Şirketleri Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import InsuranceCompanyActionsMenu from './insurance-company-actions-menu';
import type { InsuranceCompany } from './insuranceCompanyService';

interface InsuranceCompanyListProps {
  insuranceCompanies: InsuranceCompany[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (insuranceCompany: InsuranceCompany) => void;
  onDelete: (insuranceCompany: InsuranceCompany) => void;
}

const InsuranceCompanyList: React.FC<InsuranceCompanyListProps> = ({ insuranceCompanies, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = insuranceCompanies.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.description && i.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Sigorta şirketi ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Sigorta Şirketi'
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
              filtered.map(insuranceCompany => (
                <tr key={insuranceCompany.id} className='border-b'>
                  <td className='py-2 px-4'>{insuranceCompany.name}</td>
                  <td className='py-2 px-4'>{insuranceCompany.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <InsuranceCompanyActionsMenu insuranceCompany={insuranceCompany} onEdit={onEdit} onDelete={onDelete} />
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

export default InsuranceCompanyList;
