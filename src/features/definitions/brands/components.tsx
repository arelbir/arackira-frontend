'use client';

import { 
  createDeleteConfirmDialog, 
  createDefinitionActionsMenu, 
  createDefinitionList, 
  createDefinitionForm
} from '@/features/definitions/components/create-definition-components';
import { z } from 'zod';
import type { Brand } from './brand-service';

/**
 * Silme onayı için dialog bileşeni
 * 
 * Marka silme işlemleri için reusable onay dialog bileşeni
 */
export const BrandDeleteConfirmDialog = createDeleteConfirmDialog<Brand>({
  entityDisplayName: 'Marka'
});

/**
 * Marka için eylem menüsü
 */
export const BrandActionsMenu = createDefinitionActionsMenu<Brand>({
  displayNameSingular: 'Marka'
});

/**
 * Marka listesi bileşeni
 */
export const BrandList = createDefinitionList<Brand>({
  entityName: 'brand',
  displayNameSingular: 'Marka',
  displayNamePlural: 'Markalar',
  columns: [
    { key: 'name', label: 'Marka Adı' },
    { key: 'description', label: 'Açıklama' }
  ],
  ActionsMenu: BrandActionsMenu,
  searchFields: ['name', 'description']
});

/**
 * Marka form bileşeni
 */
export function BrandForm({
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
  // Import BrandSchema from brand-schema.ts if it exists, or define it inline
  // For simplicity, I'm using a simple schema here
  const BrandSchema = z.object({
    name: z.string().min(1, 'Marka adı zorunludur'),
    description: z.string().optional()
  });

  const DefinitionForm = createDefinitionForm<{
    name: string;
    description?: string;
  }>({
    displayName: 'Marka',
    schema: BrandSchema,
    fields: [
    { 
      key: 'name', 
      label: 'Marka Adı', 
      placeholder: 'Marka adını girin', 
      required: true,
      type: 'text'
    },
    { 
      key: 'description', 
      label: 'Açıklama', 
      placeholder: 'Açıklama girin', 
      required: false,
      type: 'textarea'
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
