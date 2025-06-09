"use client";

import React from 'react';
import {
  createDefinitionList,
  createDefinitionActionsMenu,
  createDefinitionForm,
  createDeleteConfirmDialog
} from '@/features/definitions/components/create-definition-components';
import { Agency, AgencyFormSchema, AgencyFormValues } from './agency-schema';

/**
 * Acente Form Bileşeni
 * Ekle/düzenle işlemleri için kullanılır
 */
export const AgencyForm = createDefinitionForm<AgencyFormValues>({
  displayName: 'Acente',
  schema: AgencyFormSchema,
  fields: [
    {
      key: 'name',
      label: 'Ad',
      placeholder: 'Acente adı',
      required: true
    },
    {
      key: 'description',
      label: 'Açıklama',
      placeholder: 'Açıklama (isteğe bağlı)',
      required: false
    }
  ]
});

/**
 * Acente Aksiyon Menüsü
 * Satır işlemleri için (düzenle, sil)
 */
export const AgencyActionsMenu = createDefinitionActionsMenu<Agency>({
  displayNameSingular: 'Acente'
});

/**
 * Acente Liste Bileşeni
 * Acenteleri listeler ve işlem düğmelerini içerir
 */
export const AgencyList = createDefinitionList<Agency>({
  entityName: 'agency',
  displayNameSingular: 'Acente',
  displayNamePlural: 'Acenteler',
  columns: [
    { key: 'name', label: 'Ad' },
    { key: 'description', label: 'Açıklama' }
  ],
  ActionsMenu: AgencyActionsMenu,
  searchFields: ['name', 'description']
});

/**
 * Acente silme onay dialogu
 */
export const AgencyDeleteConfirmDialog = createDeleteConfirmDialog<Agency>({
  entityDisplayName: 'Acente'
});
