'use client';

import { createDefinitionActionsMenu, createDefinitionList, createDefinitionForm, createDeleteConfirmDialog } from '../components/create-definition-components';
import type { Agency } from './agency-schema';
import { agencySchema } from './agency-schema';

// Acente için eylem menüsünü oluştur
export const AgencyActionsMenu = createDefinitionActionsMenu<Agency>({
  displayNameSingular: 'Acente'
});

// Acente listesi bileşenini oluştur
export const AgencyList = createDefinitionList<Agency>({
  entityName: 'agency',
  displayNameSingular: 'Acente',
  displayNamePlural: 'Acenteler',
  columns: [
    { key: 'name', label: 'Acente Adı' },
    { key: 'description', label: 'Açıklama' }
  ],
  ActionsMenu: AgencyActionsMenu,
  searchFields: ['name', 'description']
});

// Acente form bileşenini oluştur
export const AgencyForm = createDefinitionForm<{
  name: string;
  description?: string;
}>({
  displayName: 'Acente',
  schema: agencySchema,
  fields: [
    { key: 'name', label: 'Acente Adı', required: true },
    { key: 'description', label: 'Açıklama', type: 'textarea' }
  ]
});

// Silme onayı için dialog bileşeni
export const AgencyDeleteConfirmDialog = createDeleteConfirmDialog<Agency>({
  entityDisplayName: 'Acente'
});

