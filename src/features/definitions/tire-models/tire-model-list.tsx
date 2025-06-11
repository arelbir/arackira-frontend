// Lastik Modelleri Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import TireModelActionsMenu from './tire-model-actions-menu';
import type { TireModel } from './tireModelService';

interface TireModelListProps {
  tireModels: TireModel[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (tireModel: TireModel) => void;
  onDelete: (tireModel: TireModel) => void;
}

const TireModelList: React.FC<TireModelListProps> = ({ tireModels, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const filtered = tireModels.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.description && i.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Model ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Model'
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
              filtered.map((tireModel, idx) => (
                <tr key={tireModel.id ?? `tire-model-row-${idx}`} className='border-b'>
                  <td className='py-2 px-4'>{tireModel.name}</td>
                  <td className='py-2 px-4'>{tireModel.description || '-'}</td>
                  <td className='py-2 px-4 text-right'>
                    <TireModelActionsMenu tireModel={tireModel} onEdit={onEdit} onDelete={onDelete} />
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

export default TireModelList;
