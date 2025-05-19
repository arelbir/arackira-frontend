// Kiralama formu - MaintenanceForm örnek alınarak
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rentalSchema, RentalFormValues } from './rental-schema';
import { useVehicle } from '@/hooks/useVehicle';
import { useCustomer } from '@/hooks/useCustomer';

interface RentalFormProps {
  onSubmit: (data: RentalFormValues) => void;
  loading?: boolean;
  initialData?: Partial<RentalFormValues>;
}

const RentalForm: React.FC<RentalFormProps> = ({
  onSubmit,
  loading,
  initialData
}) => {
  const {
    customers,
    loading: customersLoading,
    error: customersError
  } = useCustomer();
  const form = useForm<RentalFormValues>({
    resolver: zodResolver(rentalSchema),
    defaultValues: initialData || {
      vehicle_id: 0,
      client_company_id: 0,
      contract_number: '',
      start_date: '',
      end_date: '',
      terms: '',
      status: 'aktif'
    }
  });

  React.useEffect(() => {
    if (initialData) {
      let normalized = { ...initialData };
      // Tarihleri string'e çevir
      if (initialData.start_date) {
        let dateStr = initialData.start_date as string;
        if (typeof initialData.start_date !== 'string') {
          try {
            const d = new Date(initialData.start_date as any);
            if (!isNaN(d.getTime())) dateStr = d.toISOString().slice(0, 10);
          } catch {
            dateStr = '';
          }
        }
        const match =
          typeof dateStr === 'string'
            ? dateStr.match(/\d{4}-\d{2}-\d{2}/)
            : null;
        normalized.start_date = match ? match[0] : '';
      }
      if (initialData.end_date) {
        let dateStr = initialData.end_date as string;
        if (typeof initialData.end_date !== 'string') {
          try {
            const d = new Date(initialData.end_date as any);
            if (!isNaN(d.getTime())) dateStr = d.toISOString().slice(0, 10);
          } catch {
            dateStr = '';
          }
        }
        const match =
          typeof dateStr === 'string'
            ? dateStr.match(/\d{4}-\d{2}-\d{2}/)
            : null;
        normalized.end_date = match ? match[0] : '';
      }
      if (typeof initialData.client_company_id === 'string') {
        normalized.client_company_id =
          parseInt(initialData.client_company_id) || 0;
      }
      if (typeof initialData.vehicle_id === 'string') {
        normalized.vehicle_id = parseInt(initialData.vehicle_id) || 0;
      }

      form.reset(normalized);
    } else {
      form.reset({
        vehicle_id: 0,
        client_company_id: 0,
        contract_number: '',
        start_date: '',
        end_date: '',
        terms: '',
        status: 'aktif'
      });
    }
  }, [initialData]);

  const {
    vehicles,
    loading: vehiclesLoading,
    error: vehiclesError
  } = useVehicle();

  // --- FORM ---
  return (
    <form
      id='rental-form'
      onSubmit={form.handleSubmit(onSubmit)}
      className='flex flex-col gap-4'
    >
      {/* Araç seçimi */}
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Araç</label>
        {vehiclesLoading ? (
          <div className='text-muted-foreground text-xs'>
            Araçlar yükleniyor...
          </div>
        ) : vehiclesError ? (
          <div className='text-xs text-red-600'>
            Araçlar alınamadı: {vehiclesError}
          </div>
        ) : (
          <select
            {...form.register('vehicle_id', { valueAsNumber: true })}
            className='border-border focus:ring-primary bg-muted text-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
          >
            <option value=''>Araç seçin</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.plate} - {v.brand} {v.model}
              </option>
            ))}
          </select>
        )}
        {form.formState.errors.vehicle_id && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.vehicle_id?.message}
          </span>
        )}
      </div>

      {/* Müşteri seçimi */}
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Müşteri Şirketi</label>
        <select
          {...form.register('client_company_id', { valueAsNumber: true })}
          className='border-border focus:ring-primary bg-muted text-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        >
          <option value=''>Müşteri seçin</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.company_name}
            </option>
          ))}
        </select>
        {form.formState.errors.client_company_id && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.client_company_id?.message}
          </span>
        )}
      </div>

      {/* Sözleşme No */}
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Sözleşme No</label>
        <input
          type='text'
          {...form.register('contract_number')}
          className='border-border focus:ring-primary bg-muted text-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        {form.formState.errors.contract_number && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.contract_number?.message}
          </span>
        )}
      </div>

      {/* Başlangıç ve Bitiş Tarihi */}
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>
          Başlangıç Tarihi
        </label>
        <input
          type='date'
          {...form.register('start_date')}
          className='border-border focus:ring-primary bg-muted text-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        {form.formState.errors.start_date && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.start_date?.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Bitiş Tarihi</label>
        <input
          type='date'
          {...form.register('end_date')}
          className='border-border focus:ring-primary bg-muted text-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        {form.formState.errors.end_date && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.end_date?.message}
          </span>
        )}
      </div>

      {/* Açıklama (terms) */}
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>
          Açıklama / Koşullar
        </label>
        <textarea
          {...form.register('terms')}
          className='border-border focus:ring-primary bg-muted text-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
          rows={3}
        />
        {form.formState.errors.terms && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.terms?.message}
          </span>
        )}
      </div>

      {/* Durum seçimi */}
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Durum</label>
        <select
          {...form.register('status')}
          className='border-border focus:ring-primary bg-muted text-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        >
          <option value='aktif'>Aktif</option>
          <option value='tamamlandı'>Tamamlandı</option>
          <option value='iptal'>İptal</option>
        </select>
        {form.formState.errors.status && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.status?.message}
          </span>
        )}
      </div>
    </form>
  );
};

export default RentalForm;
