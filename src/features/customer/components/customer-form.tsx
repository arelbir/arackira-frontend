import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema, CustomerFormValues } from '../utils/customer-schema';

interface CustomerFormProps {
  initialData?: CustomerFormValues;
  onSubmit: (data: CustomerFormValues) => void;
  loading?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  initialData,
  onSubmit,
  loading
}) => {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData || {
      company_name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: ''
    }
  });

  // initialData değiştiğinde formu resetle
  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: ''
      });
    }
  }, [initialData]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Firma Adı</label>
        <input
          {...form.register('company_name')}
          placeholder='Örn. Test Şirketi'
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        <span className='text-muted-foreground text-xs'>
          Firma adı zorunludur.
        </span>
        {form.formState.errors.company_name && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.company_name.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Yetkili Kişi</label>
        <input
          {...form.register('contact_person')}
          placeholder='Örn. Ali Veli'
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        <span className='text-muted-foreground text-xs'>
          Yetkili kişi adı gereklidir.
        </span>
        {form.formState.errors.contact_person && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.contact_person.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>E-posta</label>
        <input
          {...form.register('email')}
          placeholder='ornek@firma.com'
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        <span className='text-muted-foreground text-xs'>
          Geçerli bir e-posta adresi girin.
        </span>
        {form.formState.errors.email && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.email.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Telefon</label>
        <input
          {...form.register('phone')}
          placeholder='05xx xxx xx xx'
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        <span className='text-muted-foreground text-xs'>
          Telefon numarası gereklidir.
        </span>
        {form.formState.errors.phone && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.phone.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Adres</label>
        <input
          {...form.register('address')}
          placeholder='Adres giriniz'
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        <span className='text-muted-foreground text-xs'>Adres zorunludur.</span>
        {form.formState.errors.address && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.address.message}
          </span>
        )}
      </div>
      <div className='mt-4 flex gap-3'>
        <button
          type='button'
          onClick={() => form.reset()}
          className='bg-muted text-foreground hover:bg-muted/80 border-border rounded-xl border px-6 py-3 font-semibold'
        >
          İptal
        </button>
        <button
          type='submit'
          disabled={loading}
          className='rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow transition-all hover:bg-blue-700 disabled:opacity-60'
        >
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
