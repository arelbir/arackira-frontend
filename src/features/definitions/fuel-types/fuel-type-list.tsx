// Yakıt Tipleri Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import FuelTypeActionsMenu from './fuel-type-actions-menu';
import type { FuelType } from './fuelTypeService';

interface FuelTypeListProps {
  fuelTypes: FuelType[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (fuelType: FuelType) => void;
  onDelete: (fuelType: FuelType) => void;
}

const FuelTypeList: React.FC<FuelTypeListProps> = ({ fuelTypes, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = fuelTypes.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    (f.description && f.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Yakıt tipi ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Yakıt Tipi'
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
              filtered.map(fuelType => (
                <tr key={fuelType.id} className='border-b'>
                  <td className='py-2 px-4'>{fuelType.name}</td>
                  <td className='py-2 px-4'>{fuelType.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <FuelTypeActionsMenu fuelType={fuelType} onEdit={onEdit} onDelete={onDelete} />
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

export default FuelTypeList;
