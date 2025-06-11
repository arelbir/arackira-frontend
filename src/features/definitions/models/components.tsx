'use client';

import { createDefinitionActionsMenu, createDefinitionList, createDefinitionForm, createDeleteConfirmDialog } from '../components/create-definition-components';
import type { Model } from './model-schema';
import { modelSchema } from './model-schema';
import type { Brand } from '../brands/brand-service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';

// Model için eylem menüsünü oluştur
export const ModelActionsMenu = createDefinitionActionsMenu<Model>({
  displayNameSingular: 'Model'
});

// Model listesi bileşenini oluştur
export const ModelList = createDefinitionList<Model & { brand_name?: string; brand_id?: number }>({
  entityName: 'model',
  displayNameSingular: 'Model',
  displayNamePlural: 'Modeller',
  columns: [
    { key: 'name', label: 'Model Adı' },
    { key: 'brand_name', label: 'Marka' },
    { key: 'description', label: 'Açıklama' }
  ],
  ActionsMenu: ModelActionsMenu,
  searchFields: ['name', 'description', 'brand_name'],
  filterOptions: [
    {
      key: 'brand_id',
      label: 'Marka Filtresi',
      component: ({ value, onChange, items }) => {
        // Markalar listesini oluştur (tekrar eden markaları filtrele)
        const brands = Array.from(
          new Set(items.filter(item => item.brand_id).map(item => item.brand_id))
        ).map(brandId => {
          // Her marka için ilgili modeli bul ve brand_name'i al
          const modelWithBrand = items.find(item => item.brand_id === brandId);
          return {
            id: brandId!,
            name: modelWithBrand?.brand_name || `Marka ${brandId}`
          };
        }).sort((a, b) => a.name.localeCompare(b.name));
        
        return (
          <Select
            value={value === '' ? 'all' : String(value)}
            onValueChange={(newValue) => onChange(newValue === 'all' ? '' : parseInt(newValue))}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Marka Filtresi' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tüm Markalar</SelectItem>
              {brands.map(brand => (
                <SelectItem key={brand.id} value={String(brand.id)}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
      defaultValue: ''
    }
  ]
});

// Model form bileşenini oluştur - dinamik marka seçenekleriyle
export function ModelForm({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
  brands = [] // Marka seçenekleri dışarıdan geçiriliyor
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { brand_id: number; name: string; description?: string }) => void | Promise<void>;
  initialData?: Partial<{ brand_id: number; name: string; description?: string }>;
  loading?: boolean;
  brands?: Array<{ id: number; name: string }>;
}) {
  // createDefinitionForm'u kullanarak standart form yapısını oluştur
  const DefinitionForm = createDefinitionForm<{
    brand_id: number;
    name: string;
    description?: string;
  }>({
    displayName: 'Model',
    schema: modelSchema,
    fields: [
      { 
        key: 'brand_id', 
        label: 'Marka', 
        type: 'select', 
        required: true,
        options: brands.map(brand => ({ label: brand.name, value: brand.id }))
      },
      { key: 'name', label: 'Model Adı', required: true },
      { key: 'description', label: 'Açıklama', type: 'textarea' }
    ]
  });

  return (
    <DefinitionForm
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={initialData}
      loading={loading}
    />
  );
}

// Silme onayı için dialog bileşeni
export const ModelDeleteConfirmDialog = createDeleteConfirmDialog<Model>({
  entityDisplayName: 'Model'
});

// Markaya göre filtrelenebilen özelleştirilmiş model listesi
export const ModelListWithBrandFilter = ({
  items = [],
  brands = [],
  loading = false,
  onAdd,
  onEdit,
  onDelete,
}: {
  items: (Model & { brand_name: string })[];
  brands: Brand[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (item: Model) => void;
  onDelete: (item: Model) => void;
}) => {
  // Çerçeve artık createDefinitionList'ten geldiği için doğrudan ModelList bileşenini döndürüyoruz
  return (
    <ModelList
      items={items}
      loading={loading}
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
      customFilters={null}
    />
  );
};
