// Sağdan kayan modal form - şube ekle/düzenle
'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { branchSchema, BranchFormValues } from './branch-schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface BranchFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BranchFormValues) => void;
  initialData?: Partial<BranchFormValues>;
  loading?: boolean;
}

const BranchForm: React.FC<BranchFormProps> = ({ open, onClose, onSubmit, initialData, loading }) => {
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: initialData || { name: '', address: '', phone: '' }
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
          <SheetTitle>{initialData ? 'Şube Düzenle' : 'Yeni Şube'}</SheetTitle>
        </SheetHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-4 mt-6 px-0 md:px-4'
        >
          <div className='flex flex-col gap-1'>
            <label className='text-foreground font-semibold'>Şube Adı</label>
            <Input
              {...form.register('name')}
              required
              disabled={loading}
              placeholder='Şube adı'
            />
            {form.formState.errors.name && (
              <span className='text-xs text-red-600'>{form.formState.errors.name.message}</span>
            )}
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-foreground font-semibold'>Adres</label>
            <Input
              {...form.register('address')}
              disabled={loading}
              placeholder='Adres (isteğe bağlı)'
            />
            {form.formState.errors.address && (
              <span className='text-xs text-red-600'>{form.formState.errors.address.message}</span>
            )}
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-foreground font-semibold'>Telefon</label>
            <Input
              {...form.register('phone')}
              disabled={loading}
              placeholder='Telefon (isteğe bağlı)'
            />
            {form.formState.errors.phone && (
              <span className='text-xs text-red-600'>{form.formState.errors.phone.message}</span>
            )}
          </div>
          <Button type='submit' disabled={loading} className='mt-4'>Kaydet</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default BranchForm;
