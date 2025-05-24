// Araç Statüleri Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import type { VehicleStatus } from './vehicleStatusService';
import VehicleStatusActionsMenu from './vehicle-status-actions-menu';

interface VehicleStatusListProps {
  vehicleStatuses: VehicleStatus[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (vehicleStatus: VehicleStatus) => void;
  onDelete: (vehicleStatus: VehicleStatus) => void;
}

const VehicleStatusList: React.FC<VehicleStatusListProps> = ({ vehicleStatuses, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = vehicleStatuses.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    (v.description && v.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='bg-background rounded shadow p-4 border border-border'>
      <DefinitionListToolbar
        searchPlaceholder='Araç statüsü ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Araç Statüsü'
      />
      <div className='overflow-x-auto'>
        <table className='min-w-full border text-sm'>
          <thead>
            <tr className='bg-muted text-muted-foreground'>
              <th className='py-2 px-2 text-left'>Ad</th>
              <th className='py-2 px-2 text-left'>Açıklama</th>
              <th className='py-2 px-2'></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className='text-center py-4 text-muted'>Yükleniyor...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={3} className='text-center py-4 text-muted'>Kayıt bulunamadı.</td></tr>
            ) : (
              filtered.map(vehicleStatus => (
                <tr key={vehicleStatus.id} className='border-b'>
                  <td className='py-2 px-2'>{vehicleStatus.name}</td>
                  <td className='py-2 px-2'>{vehicleStatus.description || '-'}</td>
                  <td className='py-2 px-2 text-right'>
                    <VehicleStatusActionsMenu vehicleStatus={vehicleStatus} onEdit={onEdit} onDelete={onDelete} />
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

export default VehicleStatusList;
