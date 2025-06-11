'use client';

import { createDefinitionActionsMenu, createDefinitionList, createDefinitionForm, createDeleteConfirmDialog } from '../components/create-definition-components';
import { InsuranceCompanySchema, insuranceCompanySchema, InsuranceCompany, InsuranceCompanyFormValues } from './insurance-company-schema';

// Sigorta şirketi için eylem menüsünü oluştur
export const InsuranceCompanyActionsMenu = createDefinitionActionsMenu<InsuranceCompany>({
  displayNameSingular: 'Sigorta Şirketi'
});

// Liste sütunlarını tanımla
const columns = [
  {
    key: "name" as const,
    label: 'Şirket Adı'
  },
  {
    key: "description" as const,
    label: 'Açıklama'
  }
];

// Form alanlarını tanımla
const formFields = [
  {
    key: "name" as const,
    name: 'name',
    label: 'Sigorta Şirketi Adı',
    placeholder: 'Şirket adını girin',
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

// Sigorta şirketleri liste bileşenini oluştur
export const InsuranceCompanyList = createDefinitionList<InsuranceCompany>({
  entityName: 'insurance-company',
  displayNameSingular: 'Sigorta Şirketi',
  displayNamePlural: 'Sigorta Şirketleri',
  columns,
  ActionsMenu: InsuranceCompanyActionsMenu,
  searchFields: ['name', 'description']
});

// Sigorta şirketleri form bileşenini oluştur
export const InsuranceCompanyForm = createDefinitionForm<InsuranceCompanyFormValues>({
  displayName: 'Sigorta Şirketi',
  schema: insuranceCompanySchema,
  fields: formFields
});

// Silme onayı için dialog bileşeni
export const InsuranceCompanyDeleteConfirmDialog = createDeleteConfirmDialog<InsuranceCompany>({
  entityDisplayName: 'Sigorta Şirketi'
});
