import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { disposalSchema, DisposalFormValues } from './disposal-schema';
import { useVehicle } from '@/features/vehicle/hooks/useVehicle';

interface DisposalFormProps {
  onSubmit: (data: DisposalFormValues) => void;
  loading?: boolean;
  initialData?: Partial<DisposalFormValues>;
}

const DISPOSAL_TYPES = [
  { value: 'sold', label: 'Satıldı' },
  { value: 'scrapped', label: 'Hurda' }
];

const DisposalForm: React.FC<DisposalFormProps> = ({
  onSubmit,
  loading,
  initialData
}) => {
  const {
    vehicles,
    loading: vehiclesLoading,
    error: vehiclesError
  } = useVehicle();
  const form = useForm<DisposalFormValues>({
    resolver: zodResolver(disposalSchema),
    defaultValues: initialData || {
      vehicle_id: 0,
      disposal_type: '',
      disposal_date: '',
      amount: undefined,
      notes: ''
    }
  });

  React.useEffect(() => {
    if (initialData) {
      let normalized = { ...initialData };
      if (typeof initialData.vehicle_id === 'string') {
        normalized.vehicle_id = parseInt(initialData.vehicle_id) || 0;
      }
      if (initialData.disposal_date) {
        let dateStr = initialData.disposal_date as string;
        if (typeof initialData.disposal_date !== 'string') {
          try {
            const d = new Date(initialData.disposal_date as any);
            if (!isNaN(d.getTime())) dateStr = d.toISOString().slice(0, 10);
          } catch {
            dateStr = '';
          }
        }
        const match =
          typeof dateStr === 'string'
            ? dateStr.match(/\d{4}-\d{2}-\d{2}/)
            : null;
        normalized.disposal_date = match ? match[0] : '';
      }
      form.reset(normalized);
    } else {
      form.reset({
        vehicle_id: 0,
        disposal_type: '',
        disposal_date: '',
        amount: undefined,
        notes: ''
      });
    }
  }, [initialData]);

  return (
    <form
      id='disposal-form'
      onSubmit={form.handleSubmit(onSubmit)}
      className='flex flex-col gap-4'
    >
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
            className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
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
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Tür</label>
        <select
          {...form.register('disposal_type')}
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        >
          <option value=''>Tür seçin</option>
          {DISPOSAL_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {form.formState.errors.disposal_type && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.disposal_type?.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Tarih</label>
        <input
          type='date'
          {...form.register('disposal_date')}
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        {form.formState.errors.disposal_date && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.disposal_date?.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Tutar</label>
        <input
          type='number'
          {...form.register('amount', { valueAsNumber: true })}
          placeholder='Tutar'
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        {form.formState.errors.amount && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.amount?.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Notlar</label>
        <textarea
          {...form.register('notes')}
          placeholder='Ek açıklamalar...'
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
          rows={2}
        />
        {form.formState.errors.notes && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.notes?.message}
          </span>
        )}
      </div>
    </form>
  );
};

export default DisposalForm;
