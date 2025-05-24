import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { packageSchema, PackageFormValues } from './package-schema';
import { useEffect } from 'react';
import { useModelsByBrand } from '../hooks';
import { getPackagesByModel, createPackage, updatePackage } from './packageService';

interface PackageFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PackageFormValues) => Promise<void>;
  initialData?: Partial<PackageFormValues>;
  brandId: number | null;
  loading: boolean;
}

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

import React from 'react';

export function PackageForm({ open, onClose, onSubmit, initialData, brandId, loading }: PackageFormProps) {
  const { models, loading: loadingModels } = useModelsByBrand(brandId);
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: initialData || { model_id: undefined, name: '', description: '' }
  });

  React.useEffect(() => {
    if (open) {
      reset(initialData || { model_id: undefined, name: '', description: '' });
    }
  }, [open, initialData, reset]);

  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <SheetContent side='right' className='w-full max-w-lg sm:max-w-xl md:max-w-2xl'>
        <SheetHeader>
          <SheetTitle>{initialData ? 'Paketi Düzenle' : 'Yeni Paket Ekle'}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 mt-4'>
          <div>
            <label className='block mb-1 font-medium'>Model</label>
            <select
              {...register('model_id', { valueAsNumber: true })}
              className='border border-input bg-background text-foreground rounded px-2 py-1 w-full focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 outline-none transition-colors'
              disabled={!brandId || loadingModels || loading}
              defaultValue={initialData?.model_id || ''}
            >
              <option value=''>Model Seçiniz</option>
              {models.map((m: { id: number; name: string }) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            {errors.model_id && <span className='text-destructive text-xs'>{errors.model_id.message}</span>}
          </div>
          <div>
            <label className='block mb-1 font-medium'>Paket Adı</label>
            <input
              type='text'
              {...register('name')}
              className='border border-input bg-background text-foreground rounded px-2 py-1 w-full focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 outline-none transition-colors'
              disabled={loading}
            />
            {errors.name && <span className='text-destructive text-xs'>{errors.name.message}</span>}
          </div>
          <div>
            <label className='block mb-1 font-medium'>Açıklama</label>
            <input
              type='text'
              {...register('description')}
              className='border border-input bg-background text-foreground rounded px-2 py-1 w-full focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 outline-none transition-colors'
              disabled={loading}
            />
            {errors.description && <span className='text-destructive text-xs'>{errors.description.message}</span>}
          </div>
          <div className='flex gap-2 justify-end pt-4'>
            <Button type='button' variant='outline' onClick={onClose} disabled={loading}>İptal</Button>
            <Button type='submit' disabled={loading || !watch('model_id')}>
              {loading ? 'Kaydediliyor...' : (initialData ? 'Kaydet' : 'Ekle')}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
