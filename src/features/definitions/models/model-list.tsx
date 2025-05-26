// Model listeleme ve arama componenti
'use client';
import React, { useState } from 'react';
import type { Model } from './modelService';
import type { Brand } from '../brands/brandService';
import ModelActionsMenu from './model-actions-menu';
import DefinitionListToolbar from '../DefinitionListToolbar';

interface ModelListProps {
  models: Model[];
  brands: Brand[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (model: Model) => void;
  onDelete: (model: Model) => void;
}

const ModelList: React.FC<ModelListProps> = ({ models, brands, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<number | ''>('');

  const filtered = models.filter(m => {
    const matchesBrand = selectedBrand === '' || m.brand_id === selectedBrand;
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  return (
    <div className='bg-background rounded shadow p-4 border border-border'>
      <DefinitionListToolbar
        searchPlaceholder='Model ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Model'
      >
        <select
          className='border border-input bg-background text-foreground rounded px-2 py-1 w-full md:w-1/4 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 outline-none transition-colors'
          value={selectedBrand}
          onChange={e => setSelectedBrand(e.target.value === '' ? '' : Number(e.target.value))}
        >
          <option value=''>Tüm Markalar</option>
          {brands.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </DefinitionListToolbar>
      <div className='overflow-x-auto'>
        <table className='min-w-full border text-sm'>
          <thead>
            <tr className='bg-muted text-muted-foreground'>
              <th className='py-2 px-2 text-left'>Model Adı</th>
              <th className='py-2 px-2 text-left'>Marka</th>
              <th className='py-2 px-2 text-left'>Açıklama</th>
              <th className='py-2 px-2'></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(model => {
              const brand = brands.find(b => b.id === model.brand_id);
              return (
                <tr key={model.id} className='border-b'>
                  <td className='py-2 px-2'>{model.name}</td>
                  <td className='py-2 px-2'>{brand?.name || '-'}</td>
                  <td className='py-2 px-2'>{model.description}</td>
                  <td className='py-2 px-2 text-right'>
                    <ModelActionsMenu
                      model={model}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className='text-center py-4 text-muted'>Kayıt bulunamadı</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {loading && <div className='mt-4 text-center text-muted'>Yükleniyor...</div>}
    </div>
  );
};

export default ModelList;
