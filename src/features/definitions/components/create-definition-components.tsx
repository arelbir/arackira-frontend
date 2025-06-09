'use client';

import React from 'react';
import { z, ZodType } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DefinitionListToolbar from '../DefinitionListToolbar';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/**
 * Liste bileşeni fabrika fonksiyonu
 * 
 * Herhangi bir tanım modülü için liste bileşeni oluşturur
 * 
 * @param options Liste yapılandırma seçenekleri
 * @returns Liste bileşeni
 */
/**
 * Filtre seçeneği konfigürasyon tipi
 */
export interface FilterOption<T> {
  key: keyof T;
  label: string;
  component: React.ReactNode | ((props: {
    value: any;
    onChange: (value: any) => void;
    items: T[];
  }) => React.ReactNode);
  defaultValue?: any;
}

export function createDefinitionList<T extends { id: number; name: string }>(options: {
  entityName: string;
  displayNameSingular: string;
  displayNamePlural: string;
  columns: Array<{key: keyof T; label: string}>;
  ActionsMenu: React.FC<{item: T; onEdit: (item: T) => void; onDelete: (item: T) => void}>;
  searchFields?: Array<keyof T>;
  filterOptions?: Array<FilterOption<T>>;
}) {
  const { 
    entityName, 
    displayNameSingular, 
    displayNamePlural, 
    columns, 
    ActionsMenu,
    searchFields = ['name'],
    filterOptions = []
  } = options;
  
  return function DefinitionList({
    items,
    loading,
    onAdd,
    onEdit,
    onDelete,
    customFilters,
  }: {
    items: T[];
    loading: boolean;
    onAdd: () => void;
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
    customFilters?: React.ReactNode;
  }) {
    const [search, setSearch] = React.useState('');
    const [filters, setFilters] = React.useState<Record<string, any>>(
      Object.fromEntries(filterOptions.map(option => [String(option.key), option.defaultValue || '']))
    );
    
    // Filtre değişiklik işleyici fonksiyonu
    const handleFilterChange = (key: string, value: any) => {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
    };
    
    // Arama ve filtreleme işlemi
    const filtered = items.filter(item => {
      // Arama filtresi
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        const matchesSearch = searchFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(searchLower);
        });
        if (!matchesSearch) return false;
      }
      
      // Özel filtreler
      for (const key in filters) {
        if (filters[key] && filters[key] !== '') {
          if (key === 'all') continue; // 'all' değeri özel bir durum (tümü seçimi)
          
          const itemValue = item[key as keyof T];
          // === operatörü yerine typeof kontrolü yapıyoruz çünkü değerler farklı tipte olabilir
          if (String(itemValue) !== String(filters[key]) && filters[key] !== 'all') {
            return false;
          }
        }
      }
      
      return true;
    });
    
    return (
      <div className='bg-background rounded shadow p-4 border border-border'>
        <div className='w-full'>
          <DefinitionListToolbar
            searchPlaceholder={`${displayNameSingular} ara...`}
            searchValue={search}
            onSearchChange={setSearch}
            onAdd={onAdd}
            addLabel={`Yeni ${displayNameSingular}`}
          >
            {/* Dinamik filtreler */}
            {filterOptions.map((filter, index) => (
              <div key={`filter-${index}`} className="flex-shrink-0">
                {typeof filter.component === 'function' 
                  ? filter.component({
                      value: filters[String(filter.key)],
                      onChange: (value) => handleFilterChange(String(filter.key), value),
                      items: items
                    })
                  : filter.component
                }
              </div>
            ))}
            
            {/* Özel filtreler */}
            {customFilters}
          </DefinitionListToolbar>
          <div className='relative w-full overflow-x-auto'>
            <table className='w-full caption-bottom text-sm'>
              <thead>
                <tr className='border-b bg-muted text-muted-foreground'>
                  {columns.map(col => (
                    <th key={col.key.toString()} className='text-left py-2 px-4'>{col.label}</th>
                  ))}
                  <th className='text-right py-2 px-4 w-12'></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={columns.length + 1} className='text-center py-8'>Yükleniyor...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={columns.length + 1} className='text-center py-8'>Kayıt bulunamadı.</td></tr>
                ) : (
                  filtered.map(item => (
                    <tr key={item.id} className='border-b'>
                      {columns.map(col => (
                        <td key={`${item.id}-${col.key.toString()}`} className='py-2 px-4'>
                          {item[col.key] !== undefined ? String(item[col.key]) : '-'}
                        </td>
                      ))}
                      <td className='py-2 px-4 text-right'>
                        <ActionsMenu item={item} onEdit={onEdit} onDelete={onDelete} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
}

/**
 * Form alanı tipi
 */
type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox';

/**
 * Form alanı yapılandırması
 */
interface FieldConfig<T> {
  key: keyof T;
  label: string;
  placeholder?: string;
  type?: FieldType;
  required?: boolean;
  options?: { label: string; value: string | number }[];
}

/**
 * Form bileşeni fabrika fonksiyonu
 * 
 * Herhangi bir tanım modülü için form bileşeni oluşturur
 * 
 * @param options Form yapılandırma seçenekleri 
 * @returns Form bileşeni
 */
export function createDefinitionForm<T extends Record<string, any>>(options: {
  displayName: string;
  schema: ZodType<T>;
  fields: Array<FieldConfig<T>>;
}) {
  const { displayName, schema, fields } = options;
  
  return function DefinitionForm({
    open,
    onClose,
    onSubmit,
    initialData,
    loading = false
  }: {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: T) => void | Promise<void>;
    initialData?: Partial<T>;
    loading?: boolean;
  }) {
    const { 
      register, 
      handleSubmit, 
      formState: { errors }, 
      reset, 
      setValue,
      watch
    } = useForm<T>({
      resolver: zodResolver(schema),
      defaultValues: (initialData || {}) as any
    });
    
    React.useEffect(() => {
      if (initialData && open) {
        reset(initialData as T);
      } else if (open) {
        reset({} as T);
      }
    }, [open, initialData, reset]);

    // Alan türüne göre uygun form bileşeni render et
    const renderField = (field: FieldConfig<T>) => {
      switch (field.type) {
        case 'textarea':
          return (
            <Textarea
              {...register(field.key as any)}
              required={field.required}
              disabled={loading}
              placeholder={field.placeholder || ''}
              className="w-full p-3"
            />
          );
        case 'select':
          return (
            <Select
              disabled={loading}
              onValueChange={(value) => {
                // Select always returns string values, but we need to convert to number for some fields
                try {
                  // 'brand_id' ve number tipindeki alanları sayıya dönüştürmeliyiz
                  if (field.key === 'brand_id' || field.type === 'number') {
                    const numValue = parseInt(value, 10);
                    if (!isNaN(numValue)) {
                      setValue(field.key as any, numValue as any);
                    } else {
                      console.error(`Sayıya dönüştürme başarısız oldu: ${value}`);
                    }
                  } else {
                    // Diğer alanlar string olarak kalabilir
                    setValue(field.key as any, value as any);
                  }
                } catch (err) {
                  console.error('Form değeri ayarlanırken hata oluştu:', err);
                }
              }}
              value={String(watch(field.key as any) || '')}
              defaultValue={initialData ? String(initialData[field.key as keyof typeof initialData] || '') : ''}
            >
              <SelectTrigger className="w-full px-3 py-2">
                <SelectValue placeholder={field.placeholder || `${field.label} seçin...`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        default:
          return (
            <Input
              {...register(field.key as any)}
              type={field.type || 'text'}
              required={field.required}
              disabled={loading}
              placeholder={field.placeholder || ''}
              className="w-full px-3 py-2 h-10"
            />
          );
      }
    };
    
    return (
      <Sheet open={open} onOpenChange={v => !v && onClose()}>
        <SheetContent side='right' className='w-full max-w-lg sm:max-w-xl md:max-w-2xl p-6'>
          <SheetHeader>
            <SheetTitle>
              {initialData ? `${displayName} Düzenle` : `Yeni ${displayName}`}
            </SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-6 px-4">
            {fields.map(field => (
              <div key={field.key.toString()} className='flex flex-col gap-2'>
                <label className='text-foreground font-semibold'>{field.label}</label>
                {renderField(field)}
                {errors[field.key as keyof typeof errors] ? (
                  <span className="text-destructive text-xs">
                    {String(errors[field.key as keyof typeof errors]?.message || '')}
                  </span>
                ) : null}
              </div>
            ))}
            <div className='flex justify-end gap-3 pt-6 mt-4'>
              <Button type='button' variant='outline' onClick={onClose} disabled={loading}>
                İptal
              </Button>
              <Button type='submit' disabled={loading}>
                {initialData ? 'Kaydet' : 'Ekle'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    );
  };
}

/**
 * Aksiyonlar menüsü fabrika fonksiyonu
 * 
 * Herhangi bir tanım modülü için aksiyonlar menüsü bileşeni oluşturur
 * 
 * @param options Menü yapılandırma seçenekleri
 * @returns Aksiyonlar menüsü bileşeni
 */
/**
 * Silme onay dialog fabrika fonksiyonu
 * 
 * Herhangi bir tanım modülü için silme onayı dialog bileşeni oluşturur
 * 
 * @param options Dialog yapılandırma seçenekleri
 * @returns Onay dialog bileşeni
 */
export function createDeleteConfirmDialog<T extends { id: number; name: string }>(options: {
  entityDisplayName: string;
}) {
  const { entityDisplayName } = options;
  
  return function DeleteConfirmDialog({
    open,
    onOpenChange,
    itemToDelete,
    isDeleting,
    onConfirm,
    onCancel,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    itemToDelete: T | null;
    isDeleting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{entityDisplayName} Silme Onayı</DialogTitle>
            <DialogDescription>
              <span className="text-destructive font-semibold">{itemToDelete?.name}</span> {entityDisplayName.toLowerCase()}ini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
              İptal
            </Button>
            <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
              {isDeleting ? 'Siliniyor...' : 'Sil'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
}

export function createDefinitionActionsMenu<T extends { id: number }>(options: {
  displayNameSingular: string;
}) {
  const { displayNameSingular } = options;
  
  return function DefinitionActionsMenu({
    item,
    onEdit,
    onDelete,
  }: {
    item: T;
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
  }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className='hover:bg-muted rounded p-2'>
            <MoreVertical size={18} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={() => onEdit(item)}>
            <Edit className='mr-2 h-4 w-4' /> Düzenle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(item)} className='text-destructive'>
            <Trash2 className='mr-2 h-4 w-4' /> Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
}
