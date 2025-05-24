// Sigorta Tipleri Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import InsuranceTypeActionsMenu from './insurance-type-actions-menu';
import type { InsuranceType } from './insuranceTypeService';

interface InsuranceTypeListProps {
  insuranceTypes: InsuranceType[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (insuranceType: InsuranceType) => void;
  onDelete: (insuranceType: InsuranceType) => void;
}

const InsuranceTypeList: React.FC<InsuranceTypeListProps> = ({ insuranceTypes, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = insuranceTypes.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.description && i.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Sigorta tipi ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Sigorta Tipi'
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
              filtered.map(insuranceType => (
                <tr key={insuranceType.id} className='border-b'>
                  <td className='py-2 px-4'>{insuranceType.name}</td>
                  <td className='py-2 px-4'>{insuranceType.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <InsuranceTypeActionsMenu insuranceType={insuranceType} onEdit={onEdit} onDelete={onDelete} />
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

export default InsuranceTypeList;
