'use client';

import { createDefinitionActionsMenu, createDefinitionList, createDefinitionForm, createDeleteConfirmDialog } from '../components/create-definition-components';
import { clientTypeSchema, ClientType, ClientTypeFormValues } from './client-type-schema';

// Müşteri tipi için eylem menüsünü oluştur
export const ClientTypeActionsMenu = createDefinitionActionsMenu<ClientType>({
  displayNameSingular: 'Müşteri Tipi'
});

// Müşteri tipi listesi bileşenini oluştur
export const ClientTypeList = createDefinitionList<ClientType>({
  entityName: 'client-type',
  displayNameSingular: 'Müşteri Tipi',
  displayNamePlural: 'Müşteri Tipleri',
  columns: [
    { key: 'name', label: 'Tip Adı' },
    { key: 'description', label: 'Açıklama' }
  ],
  ActionsMenu: ClientTypeActionsMenu,
  searchFields: ['name', 'description']
});

// Form alan tanımları
const formFields = [
  {
    key: "name" as const,
    name: 'name',
    label: 'Müşteri Tipi Adı',
    placeholder: 'Müşteri tipi adını girin',
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

// Müşteri tipi form bileşenini oluştur
export const ClientTypeForm = createDefinitionForm<ClientTypeFormValues>({
  displayName: 'Müşteri Tipi',
  schema: clientTypeSchema,
  fields: formFields
});

// Silme onayı için dialog bileşeni
export const ClientTypeDeleteConfirmDialog = createDeleteConfirmDialog<ClientType>({
  entityDisplayName: 'Müşteri Tipi'
});

