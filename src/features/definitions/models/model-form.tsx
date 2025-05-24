// Model ekle/düzenle formu
'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { modelSchema, ModelFormValues } from './model-schema';
import type { Brand } from '../brands/brandService';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface ModelFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ModelFormValues) => Promise<void>;
  initialData?: Partial<ModelFormValues>;
  brands: Brand[];
  loading: boolean;
}

const ModelForm: React.FC<ModelFormProps> = ({ open, onClose, onSubmit, initialData, brands, loading }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ModelFormValues>({
    resolver: zodResolver(modelSchema),
    defaultValues: initialData || { brand_id: undefined, name: '', description: '' }
  });

  React.useEffect(() => {
    if (open) {
      reset(initialData || { brand_id: undefined, name: '', description: '' });
    }
  }, [open, initialData, reset]);

  const submitHandler = async (data: ModelFormValues) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent side='right' className='w-full max-w-lg sm:max-w-xl md:max-w-2xl'>
        <SheetHeader>
          <SheetTitle>{initialData ? 'Modeli Düzenle' : 'Yeni Model Ekle'}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-4 mt-4'>
          <div>
            <label className='block mb-1 font-medium'>Marka</label>
            <select
              {...register('brand_id', { valueAsNumber: true })}
              className='border border-input bg-background text-foreground rounded px-2 py-1 w-full focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 outline-none transition-colors'
              disabled={loading}
              defaultValue={initialData?.brand_id || ''}
            >
              <option value=''>Marka seçiniz</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            {errors.brand_id && <span className='text-destructive text-xs'>{errors.brand_id.message}</span>}
          </div>
          <div>
            <label className='block mb-1 font-medium'>Model Adı</label>
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
            <Button type='submit' disabled={loading}>{loading ? 'Kaydediliyor...' : (initialData ? 'Kaydet' : 'Ekle')}</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ModelForm;
