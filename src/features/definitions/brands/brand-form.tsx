// Sağdan kayan modal form - marka ekle/düzenle (color-form yapısında)
'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { brandSchema, BrandFormValues } from './brand-schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface BrandFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BrandFormValues) => void;
  initialData?: Partial<BrandFormValues>;
  loading?: boolean;
}

const BrandForm: React.FC<BrandFormProps> = ({ open, onClose, onSubmit, initialData, loading }) => {
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: initialData || { name: '', description: '' }
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form, open]);

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent side='right' className='w-full max-w-lg sm:max-w-xl md:max-w-2xl'>
        <SheetHeader>
          <SheetTitle>{initialData ? 'Marka Düzenle' : 'Yeni Marka'}</SheetTitle>
        </SheetHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-4 mt-6 px-0 md:px-4'
        >
          <div className='flex flex-col gap-1'>
            <label className='text-foreground font-semibold'>Marka Adı</label>
            <Input
              {...form.register('name')}
              required
              disabled={loading}
              placeholder='Marka adı'
            />
            {form.formState.errors.name && (
              <span className='text-xs text-red-600'>{form.formState.errors.name.message}</span>
            )}
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-foreground font-semibold'>Açıklama</label>
            <Input
              {...form.register('description')}
              disabled={loading}
              placeholder='Açıklama (isteğe bağlı)'
            />
            {form.formState.errors.description && (
              <span className='text-xs text-red-600'>{form.formState.errors.description.message}</span>
            )}
          </div>
          <div className='flex justify-end gap-2 pt-4'>
            <Button type='button' variant='outline' onClick={onClose} disabled={loading}>İptal</Button>
            <Button type='submit' disabled={loading}>{initialData ? 'Kaydet' : 'Ekle'}</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default BrandForm;
