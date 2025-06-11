'use client';

import { createDefinitionActionsMenu, createDefinitionList, createDefinitionForm, createDeleteConfirmDialog } from '../components/create-definition-components';
import { FuelTypeSchema, fuelTypeFormSchema, FuelType, FuelTypeFormValues } from './fuel-type-schema';

// Yakıt tipi için eylem menüsünü oluştur
export const FuelTypeActionsMenu = createDefinitionActionsMenu<FuelType>({
  displayNameSingular: 'Yakıt Tipi'
});

// Yakıt tipi listesi bileşeni
export const FuelTypeList = createDefinitionList<FuelType>({
  entityName: 'fuel-type',
  displayNameSingular: 'Yakıt Tipi',
  displayNamePlural: 'Yakıt Tipleri',
  columns: [
    { key: 'name', label: 'Ad' },
    { key: 'description', label: 'Açıklama' },
  ],
  ActionsMenu: FuelTypeActionsMenu,
  searchFields: ['name', 'description']
});

// Form alanlarını tanımla
const formFields = [
  {
    key: "name" as const,
    name: 'name',
    label: 'Yakıt Tipi Adı',
    placeholder: 'Yakıt tipi adını girin',
    required: true,
  },
  {
    key: "description" as const,
    name: 'description',
    label: 'Açıklama',
    placeholder: 'Açıklama girin (opsiyonel)',
    required: false,
  }
];

// Yakıt tipi form bileşenini oluştur
export const FuelTypeForm = createDefinitionForm<FuelTypeFormValues>({
  displayName: 'Yakıt Tipi',
  schema: fuelTypeFormSchema,
  fields: formFields
});

// Silme onayı için dialog bileşeni
export const FuelTypeDeleteConfirmDialog = createDeleteConfirmDialog<FuelType>({
  entityDisplayName: 'Yakıt Tipi'
});
