'use client';

import { 
  createDeleteConfirmDialog, 
  createDefinitionActionsMenu, 
  createDefinitionList, 
  createDefinitionForm
} from '@/features/definitions/components/create-definition-components';
import { colorFormSchema, ColorSchema } from './color-schema';
import type { Color } from './color-schema';

/**
 * Silme onayı için dialog bileşeni
 * 
 * Renk silme işlemleri için reusable onay dialog bileşeni
 */
export const ColorDeleteConfirmDialog = createDeleteConfirmDialog<Color>({
  entityDisplayName: 'Renk'
});

/**
 * Renk için eylem menüsü
 */
export const ColorActionsMenu = createDefinitionActionsMenu<Color>({
  displayNameSingular: 'Renk'
});

/**
 * Renk listesi bileşeni
 */
export const ColorList = createDefinitionList<Color>({
  entityName: 'color',
  displayNameSingular: 'Renk',
  displayNamePlural: 'Renkler',
  columns: [
    { key: 'name', label: 'Renk Adı' },
    { key: 'description', label: 'Açıklama' },
  ],
  ActionsMenu: ColorActionsMenu,
  searchFields: ['name', 'description']
});

/**
 * Renk form bileşeni - Manual implementation similar to ModelForm
 */
export function ColorForm({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string }) => void | Promise<void>;
  initialData?: Partial<{ name: string; description?: string }>;
  loading?: boolean;
}) {
  // createDefinitionForm'u kullanarak standart form yapısını oluştur
  const DefinitionForm = createDefinitionForm<{
    name: string;
    description?: string;
  }>({
    displayName: 'Renk',
    schema: colorFormSchema,
    fields: [
      { 
        key: 'name', 
        label: 'Renk Adı',
        placeholder: 'Renk adını giriniz',
        required: true
      },
      { 
        key: 'description', 
        label: 'Açıklama',
        placeholder: 'Açıklama giriniz',
        required: false
      }
    ]
  });

  return (
    <DefinitionForm 
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={initialData}
      loading={loading}
    />
  );
}
