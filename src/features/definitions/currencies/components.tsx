'use client';

import { createDefinitionActionsMenu, createDefinitionList, createDefinitionForm, createDeleteConfirmDialog } from '../components/create-definition-components';
import { currencySchema, Currency, CurrencyFormValues } from './currency-schema';

// Para birimi için eylem menüsünü oluştur
export const CurrencyActionsMenu = createDefinitionActionsMenu<Currency>({
  displayNameSingular: 'Para Birimi'
});

// Para birimi listesi bileşenini oluştur
export const CurrencyList = createDefinitionList<Currency>({
  entityName: 'currency',
  displayNameSingular: 'Para Birimi',
  displayNamePlural: 'Para Birimleri',
  columns: [
    { key: 'code', label: 'Para Birimi Kodu' },
    { key: 'name', label: 'Para Birimi Adı' },
    { key: 'symbol', label: 'Para Birimi Sembolü' },
    { key: 'description', label: 'Açıklama' }
  ],
  ActionsMenu: CurrencyActionsMenu,
  searchFields: ['code', 'name', 'symbol', 'description']
});

// Form alanlarını tanımla
const formFields = [
  {
    key: "code" as const,
    name: 'code',
    label: 'Para Birimi Kodu',
    placeholder: 'TRY, USD, EUR gibi kod girin',
    required: true,
  },
  {
    key: "name" as const,
    name: 'name',
    label: 'Para Birimi Adı',
    placeholder: 'Para birimi adını girin',
    required: true,
  },
  {
    key: "symbol" as const,
    name: 'symbol',
    label: 'Para Birimi Sembolü',
    placeholder: '₺, $, € gibi sembol girin',
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

// Para birimi form bileşenini oluştur
export const CurrencyForm = createDefinitionForm<CurrencyFormValues>({
  displayName: 'Para Birimi',
  schema: currencySchema,
  fields: formFields
});

// Silme onayı için dialog bileşeni
export const CurrencyDeleteConfirmDialog = createDeleteConfirmDialog<Currency>({
  entityDisplayName: 'Para Birimi'
});

