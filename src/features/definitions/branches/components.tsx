'use client';

import { createDefinitionActionsMenu, createDefinitionList, createDefinitionForm, createDeleteConfirmDialog } from '../components/create-definition-components';
import type { Branch } from './branch-schema';
import { branchSchema } from './branch-schema';

// Ruhsat Sahibi Firma için eylem menüsünü oluştur
export const BranchActionsMenu = createDefinitionActionsMenu<Branch>({
  displayNameSingular: 'Ruhsat Sahibi Firma'
});

// Ruhsat Sahibi Firma listesi bileşenini oluştur
export const BranchList = createDefinitionList<Branch>({
  entityName: 'branch',
  displayNameSingular: 'Ruhsat Sahibi Firma',
  displayNamePlural: 'Ruhsat Sahibi Firmaler',
  columns: [
    { key: 'name', label: 'Ruhsat Sahibi Firma Adı' },
    { key: 'address', label: 'Adres' },
    { key: 'phone', label: 'Telefon' }
  ],
  ActionsMenu: BranchActionsMenu,
  searchFields: ['name', 'address', 'phone']
});

// Ruhsat Sahibi Firma form bileşenini oluştur
export const BranchForm = createDefinitionForm<{
  name: string;
  address?: string;
  phone?: string;
}>({
  displayName: 'Ruhsat Sahibi Firma',
  schema: branchSchema,
  fields: [
    { key: 'name', label: 'Ruhsat Sahibi Firma Adı', required: true },
    { key: 'address', label: 'Adres', type: 'textarea' },
    { key: 'phone', label: 'Telefon' }
  ]
});

// Silme onayı için dialog bileşeni
export const BranchDeleteConfirmDialog = createDeleteConfirmDialog<Branch>({
  entityDisplayName: 'Ruhsat Sahibi Firma'
});
