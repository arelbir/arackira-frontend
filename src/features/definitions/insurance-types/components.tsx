'use client';

import { createDefinitionActionsMenu, createDefinitionList, createDefinitionForm, createDeleteConfirmDialog } from '../components/create-definition-components';
import { InsuranceTypeSchema, insuranceTypeSchema, InsuranceType, InsuranceTypeFormValues } from './insurance-type-schema';

// Sigorta tipi için eylem menüsünü oluştur
export const InsuranceTypeActionsMenu = createDefinitionActionsMenu<InsuranceType>({
  displayNameSingular: 'Sigorta Tipi'
});

// Sigorta tipi listesi bileşeni
export const InsuranceTypeList = createDefinitionList<InsuranceType>({
  entityName: 'insurance-type',
  displayNameSingular: 'Sigorta Tipi',
  displayNamePlural: 'Sigorta Tipleri',
  columns: [
    { key: 'name', label: 'Ad' },
    { key: 'description', label: 'Açıklama' },
  ],
  ActionsMenu: InsuranceTypeActionsMenu,
  searchFields: ['name', 'description']
});

// Form alanlarını tanımla
const formFields = [
  {
    key: "name" as const,
    name: 'name',
    label: 'Sigorta Tipi Adı',
    placeholder: 'Sigorta tipi adını girin',
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

// Sigorta tipi form bileşenini oluştur
export const InsuranceTypeForm = createDefinitionForm<InsuranceTypeFormValues>({
  displayName: 'Sigorta Tipi',
  schema: insuranceTypeSchema,
  fields: formFields
});

// Silme onayı için dialog bileşeni
export const InsuranceTypeDeleteConfirmDialog = createDeleteConfirmDialog<InsuranceType>({
  entityDisplayName: 'Sigorta Tipi'
});
