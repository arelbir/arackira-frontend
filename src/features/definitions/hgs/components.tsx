'use client';

import {
  createDefinitionActionsMenu,
  createDefinitionList,
  createDefinitionForm,
  createDeleteConfirmDialog
} from '../components/create-definition-components';
import type { HGS } from './hgs-schema';
import { hgsSchema } from './hgs-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';

// HGS için eylem menüsü
export const HGSActionsMenu = createDefinitionActionsMenu<HGS>({
  displayNameSingular: 'HGS'
});

// HGS listesi bileşeni
export const HGSList = createDefinitionList<HGS>({
  entityName: 'hgs',
  displayNameSingular: 'HGS',
  displayNamePlural: 'HGS Kayıtları',
  columns: [
    { key: 'vehicle_id', label: 'Araç ID' },
    { key: 'hgs_place', label: 'Alındığı Yer' },
    { key: 'hgs_tag_no', label: 'Etiket No' },
    { key: 'hgs_vehicle_class', label: 'Araç Sınıfı' },
    { key: 'is_active', label: 'Aktif mi?' }
  ],
  ActionsMenu: HGSActionsMenu,
  searchFields: ['hgs_tag_no', 'hgs_place', 'hgs_vehicle_class'],
  filterOptions: []
});

// HGS form bileşeni
export const HGSForm = createDefinitionForm<any>({
  displayName: 'HGS',
  schema: hgsSchema as any,
  fields: [
    {
      key: 'vehicle_id',
      label: 'Araç ID',
      type: 'number',
      required: true
    },
    {
      key: 'hgs_place',
      label: 'Alındığı Yer',
      type: 'text',
      required: true
    },
    {
      key: 'hgs_tag_no',
      label: 'Etiket No',
      type: 'text',
      required: true
    },
    {
      key: 'hgs_vehicle_class',
      label: 'Araç Sınıfı',
      type: 'text',
      required: true
    }
  ]
});

// Silme onayı için dialog bileşeni
export const HGSDeleteConfirmDialog = createDeleteConfirmDialog<HGS>({
  entityDisplayName: 'HGS',
  getItemLabel: (item: HGS | null) => item?.hgs_tag_no || String(item?.id)
});
