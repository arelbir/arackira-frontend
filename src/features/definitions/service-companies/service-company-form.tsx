// Sağdan kayan modal form - servis şirketi ekle/düzenle
'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceCompanySchema, ServiceCompanyFormValues } from './service-company-schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface ServiceCompanyFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceCompanyFormValues) => Promise<void>;
  initialData?: Partial<ServiceCompanyFormValues>;
  loading: boolean;
}

const ServiceCompanyForm: React.FC<ServiceCompanyFormProps> = ({ open, onClose, onSubmit, initialData, loading }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ServiceCompanyFormValues>({
    resolver: zodResolver(serviceCompanySchema),
    defaultValues: initialData || { name: '', description: '' }
  });

  React.useEffect(() => {
    if (open) {
      reset(initialData || { name: '', description: '' });
    }
  }, [open, initialData, reset]);

  const submitHandler = async (data: ServiceCompanyFormValues) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent side='right' className='w-full max-w-lg sm:max-w-xl md:max-w-2xl'>
        <SheetHeader>
          <SheetTitle>{initialData ? 'Servis Şirketini Düzenle' : 'Yeni Servis Şirketi Ekle'}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-4 mt-4'>
          <div>
            <label className='block mb-1 font-medium'>Ad</label>
            <Input
              {...register('name')}
              disabled={loading}
              className='w-full'
              placeholder='Servis şirketi adı'
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

export default ServiceCompanyForm;
