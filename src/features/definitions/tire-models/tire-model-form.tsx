// Sağdan kayan modal form - lastik modeli ekle/düzenle
'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tireModelSchema, TireModelFormValues } from './tire-model-schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface TireModelFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TireModelFormValues) => Promise<void>;
  initialData?: Partial<TireModelFormValues>;
  loading: boolean;
}

const TireModelForm: React.FC<TireModelFormProps> = ({ open, onClose, onSubmit, initialData, loading }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TireModelFormValues>({
    resolver: zodResolver(tireModelSchema),
    defaultValues: initialData || { brand_id: 0, name: '', description: '' }
  });

  React.useEffect(() => {
    if (open) {
      reset(initialData || { brand_id: 0, name: '', description: '' });
    }
  }, [open, initialData, reset]);

  const submitHandler = async (data: TireModelFormValues) => {
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
            <label className='block mb-1 font-medium'>Ad</label>
            <Input
              {...register('name')}
              disabled={loading}
              className='w-full'
              placeholder='Model adı'
            />
            {errors.name && <span className='text-destructive text-xs'>{errors.name.message}</span>}
          </div>
          <div>
            <label className='block mb-1 font-medium'>Açıklama</label>
            <Input
              {...register('description')}
              disabled={loading}
              className='w-full'
              placeholder='Açıklama (isteğe bağlı)'
            />
            {errors.description && <span className='text-destructive text-xs'>{errors.description.message}</span>}
          </div>
          <div className='flex justify-end gap-2 pt-4'>
            <Button type='button' variant='outline' onClick={onClose} disabled={loading}>İptal</Button>
            <Button type='submit' disabled={loading}>{loading ? 'Kaydediliyor...' : (initialData ? 'Kaydet' : 'Ekle')}</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default TireModelForm;
