// Sağdan kayan modal form - araç statüsü ekle/düzenle
'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleStatusSchema, VehicleStatusFormValues } from './vehicle-status-schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface VehicleStatusFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleStatusFormValues) => Promise<void>;
  initialData?: Partial<VehicleStatusFormValues>;
  loading: boolean;
}

const VehicleStatusForm: React.FC<VehicleStatusFormProps> = ({ open, onClose, onSubmit, initialData, loading }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<VehicleStatusFormValues>({
    resolver: zodResolver(vehicleStatusSchema),
    defaultValues: initialData || { name: '', description: '' }
  });

  React.useEffect(() => {
    if (open) {
      reset(initialData || { name: '', description: '' });
    }
  }, [open, initialData, reset]);

  const submitHandler = async (data: VehicleStatusFormValues) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent side='right' className='w-full max-w-lg sm:max-w-xl md:max-w-2xl'>
        <SheetHeader>
          <SheetTitle>{initialData ? 'Araç Statüsünü Düzenle' : 'Yeni Araç Statüsü Ekle'}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-4 mt-4'>
          <div>
            <label className='block mb-1 font-medium'>Ad</label>
            <Input
              {...register('name')}
              disabled={loading}
              className='w-full'
              placeholder='Araç statüsü adı'
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
          <Button type='submit' disabled={loading}>{initialData ? 'Güncelle' : 'Ekle'}</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default VehicleStatusForm;
