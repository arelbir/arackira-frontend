'use client';

import { createDefinitionActionsMenu, createDefinitionList, createDefinitionForm, createDeleteConfirmDialog } from '../components/create-definition-components';
import type { Branch } from './branch-schema';
import { branchSchema } from './branch-schema';

// Şube için eylem menüsünü oluştur
export const BranchActionsMenu = createDefinitionActionsMenu<Branch>({
  displayNameSingular: 'Şube'
});

// Şube listesi bileşenini oluştur
export const BranchList = createDefinitionList<Branch>({
  entityName: 'branch',
  displayNameSingular: 'Şube',
  displayNamePlural: 'Şubeler',
  columns: [
    { key: 'name', label: 'Şube Adı' },
    { key: 'address', label: 'Adres' },
    { key: 'phone', label: 'Telefon' }
  ],
  ActionsMenu: BranchActionsMenu,
  searchFields: ['name', 'address', 'phone']
});

// Şube form bileşenini oluştur
export const BranchForm = createDefinitionForm<{
  name: string;
  address?: string;
  phone?: string;
}>({
  displayName: 'Şube',
  schema: branchSchema,
  fields: [
    { key: 'name', label: 'Şube Adı', required: true },
    { key: 'address', label: 'Adres', type: 'textarea' },
    { key: 'phone', label: 'Telefon' }
  ]
});

// Silme onayı için dialog bileşeni
export const BranchDeleteConfirmDialog = createDeleteConfirmDialog<Branch>({
  entityDisplayName: 'Şube'
});
