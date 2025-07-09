// Araç Tipleri Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import VehicleTypeActionsMenu from './vehicle-type-actions-menu';
import type { VehicleType } from './vehicleTypeService';

interface VehicleTypeListProps {
  vehicleTypes: VehicleType[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (vehicleType: VehicleType) => void;
  onDelete: (vehicleType: VehicleType) => void;
}

const VehicleTypeList: React.FC<VehicleTypeListProps> = ({ vehicleTypes, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = vehicleTypes.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    (v.description && v.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Araç tipi ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Araç Tipi'
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
              filtered.map(vehicleType => (
                <tr key={vehicleType.id} className='border-b'>
                  <td className='py-2 px-4'>{vehicleType.name}</td>
                  <td className='py-2 px-4'>{vehicleType.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <VehicleTypeActionsMenu vehicleType={vehicleType} onEdit={onEdit} onDelete={onDelete} />
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

export default VehicleTypeList;
