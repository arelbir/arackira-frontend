// Sağdan kayan modal form - tedarikçi ekle/düzenle
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SupplierFormValues, supplierSchema } from './supplier-schema';
import { Supplier } from './supplierService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface SupplierFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SupplierFormValues) => Promise<void>;
  initialData?: Supplier;
  loading: boolean;
}

export const SupplierForm: React.FC<SupplierFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  initialData, 
  loading 
}) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: initialData?.name || '',
      tax_number: initialData?.tax_number || '',
      contact_person: initialData?.contact_person || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      address: initialData?.address || '',
      is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
    },
  });
  
  // Form değerlerini güncelle
  React.useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name || '',
        tax_number: initialData?.tax_number || '',
        contact_person: initialData?.contact_person || '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        address: initialData?.address || '',
        is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
      });
    }
  }, [open, initialData, reset]);

  const submitHandler = async (data: SupplierFormValues) => {
    await onSubmit(data);
    reset();
  };
  
  const isActiveValue = watch('is_active');

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent side='right' className='w-full max-w-lg sm:max-w-xl md:max-w-2xl'>
        <SheetHeader>
          <SheetTitle>{initialData ? 'Tedarikçiyi Düzenle' : 'Yeni Tedarikçi Ekle'}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-4 mt-6'>
          <div>
            <label className='block mb-1 font-medium'>Tedarikçi Adı</label>
            <Input
              {...register('name')}
              disabled={loading}
              className='w-full'
              placeholder='Tedarikçi adını girin'
            />
            {errors.name && <span className='text-destructive text-xs'>{errors.name.message}</span>}
          </div>
          
          <div>
            <label className='block mb-1 font-medium'>Vergi Numarası</label>
            <Input
              {...register('tax_number')}
              disabled={loading}
              className='w-full'
              placeholder='Vergi numarasını girin'
            />
            {errors.tax_number && <span className='text-destructive text-xs'>{errors.tax_number.message}</span>}
          </div>
          
          <div>
            <label className='block mb-1 font-medium'>İlgili Kişi</label>
            <Input
              {...register('contact_person')}
              disabled={loading}
              className='w-full'
              placeholder='İlgili kişi adını girin'
            />
            {errors.contact_person && <span className='text-destructive text-xs'>{errors.contact_person.message}</span>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className='block mb-1 font-medium'>Telefon</label>
              <Input
                {...register('phone')}
                disabled={loading}
                className='w-full'
                placeholder='Telefon numarası'
              />
              {errors.phone && <span className='text-destructive text-xs'>{errors.phone.message}</span>}
            </div>
            
            <div>
              <label className='block mb-1 font-medium'>E-posta</label>
              <Input
                {...register('email')}
                disabled={loading}
                className='w-full'
                type='email'
                placeholder='E-posta adresi'
              />
              {errors.email && <span className='text-destructive text-xs'>{errors.email.message}</span>}
            </div>
          </div>
          
          <div>
            <label className='block mb-1 font-medium'>Adres</label>
            <Textarea
              {...register('address')}
              disabled={loading}
              className='w-full'
              placeholder='Tedarikçi adresini girin'
              rows={3}
            />
            {errors.address && <span className='text-destructive text-xs'>{errors.address.message}</span>}
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              {...register('is_active')}
              checked={isActiveValue}
              onCheckedChange={(checked) => setValue('is_active', checked as boolean)}
              disabled={loading}
            />
            <label htmlFor="is_active" className="text-sm font-medium leading-none cursor-pointer">Aktif</label>
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
