// Araç ekleme/düzenleme formu (iskele)
import React from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleSchema, VehicleFormValues } from './vehicle-schema';
import { useCustomer } from '@/hooks/useCustomer';

interface VehicleFormProps {
  onSubmit: (data: VehicleFormValues) => void;
  loading?: boolean;
  initialData?: Partial<VehicleFormValues>;
  layout?: 'single' | 'grid';
}

const VehicleForm: React.FC<VehicleFormProps> = ({
  onSubmit,
  loading,
  initialData,
  layout = 'single'
}) => {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initialData || {
      plate_number: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      current_status: 'available',
      chassis_number: '',
      acquisition_cost: 0,
      acquisition_date: '',
      notes: ''
    }
  });

  React.useEffect(() => {
    if (initialData) {
      // Edinim tarihi ve maliyeti normalize et
      let normalized = { ...initialData };
      // acquisition_date: yyyy-mm-dd string'e çevir
      if (initialData.acquisition_date) {
        let dateStr = initialData.acquisition_date as string;
        // Eğer Date objesi gelirse stringe çevir
        if (typeof initialData.acquisition_date !== 'string') {
          try {
            const d = new Date(initialData.acquisition_date as any);
            if (!isNaN(d.getTime())) dateStr = d.toISOString().slice(0, 10);
          } catch {
            dateStr = '';
          }
        }
        // yyyy-mm-dd formatı değilse düzelt
        const match =
          typeof dateStr === 'string'
            ? dateStr.match(/\d{4}-\d{2}-\d{2}/)
            : null;
        normalized.acquisition_date = match ? match[0] : '';
      }
      // acquisition_cost: number'a çevir
      if (typeof initialData.acquisition_cost === 'string') {
        normalized.acquisition_cost =
          parseFloat(initialData.acquisition_cost) || 0;
      }
      form.reset(normalized);
    } else {
      form.reset({
        plate_number: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        current_status: 'available',
        chassis_number: '',
        acquisition_cost: 0,
        acquisition_date: '',
        notes: ''
      });
    }
  }, [initialData]);

  const { customers: customerList, loading: customersLoading } = useCustomer();

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={
        layout === 'grid'
          ? 'grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2'
          : 'space-y-6'
      }
      id='vehicle-form'
    >
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Müşteri Firma</label>
        <select
          {...form.register('current_client_company_id', {
            valueAsNumber: true,
            required: true
          })}
          className='border-border bg-muted text-foreground focus:ring-primary w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
          disabled={customersLoading || customerList.length === 0}
          defaultValue={form.getValues('current_client_company_id') || ''}
        >
          <option value='' disabled>
            {customersLoading
              ? 'Yükleniyor...'
              : customerList.length === 0
                ? 'Kayıtlı müşteri yok'
                : 'Firma seçin'}
          </option>
          {customerList.map((c) => (
            <option key={c.id} value={c.id}>
              {c.company_name}
            </option>
          ))}
        </select>
        {form.formState.errors.current_client_company_id && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.current_client_company_id.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Plaka</label>
        <input
          {...form.register('plate_number')}
          placeholder='34ABC123'
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        <span className='text-muted-foreground text-xs'>
          Zorunlu alan. Araç plakası benzersiz olmalıdır.
        </span>
        {form.formState.errors.plate_number && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.plate_number.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Marka</label>
        <input
          {...form.register('brand')}
          placeholder='Toyota'
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        <span className='text-muted-foreground text-xs'>Zorunlu alan.</span>
        {form.formState.errors.brand && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.brand.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Model</label>
        <input
          {...form.register('model')}
          placeholder='Corolla'
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        <span className='text-muted-foreground text-xs'>Zorunlu alan.</span>
        {form.formState.errors.model && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.model.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Yıl</label>
        <input
          type='number'
          {...form.register('year', { valueAsNumber: true })}
          placeholder='2020'
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        <span className='text-muted-foreground text-xs'>
          Zorunlu alan. 4 haneli yıl giriniz.
        </span>
        {form.formState.errors.year && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.year.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Durum</label>
        <select
          {...form.register('current_status')}
          className='border-border bg-muted text-foreground focus:ring-primary w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        >
          <option value='available'>Uygun</option>
          <option value='leased'>Kirada</option>
          <option value='maintenance'>Bakımda</option>
          <option value='sold'>Satıldı</option>
          <option value='scrapped'>Hurda</option>
        </select>
        <span className='text-muted-foreground text-xs'>
          Aracın mevcut durumu.
        </span>
        {form.formState.errors.current_status && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.current_status.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Şasi No</label>
        <input
          {...form.register('chassis_number')}
          placeholder='XXXXXXXXXXXXXXX'
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        <span className='text-muted-foreground text-xs'>
          Opsiyonel. Araç şasi numarası.
        </span>
        {form.formState.errors.chassis_number && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.chassis_number.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Edinim Maliyeti</label>
        <input
          type='number'
          {...form.register('acquisition_cost', { valueAsNumber: true })}
          placeholder='500000'
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        <span className='text-muted-foreground text-xs'>
          Opsiyonel. Araç için ödenen toplam tutar.
        </span>
        {form.formState.errors.acquisition_cost && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.acquisition_cost.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Edinim Tarihi</label>
        <input
          type='date'
          {...form.register('acquisition_date', { required: true })}
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        <span className='text-muted-foreground text-xs'>
          Zorunlu. Aracın şirkete dahil olduğu tarih (YYYY-AA-GG).
        </span>
        {form.formState.errors.acquisition_date && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.acquisition_date.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1 md:col-span-2'>
        <label className='text-foreground font-semibold'>Notlar</label>
        <textarea
          {...form.register('notes')}
          placeholder='Ek açıklamalar...'
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
          rows={2}
        />
        <span className='text-muted-foreground text-xs'>
          Opsiyonel. Araçla ilgili ek notlar.
        </span>
        {form.formState.errors.notes && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.notes.message}
          </span>
        )}
      </div>
    </form>
  );
};

export default VehicleForm;
