import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { maintenanceSchema, MaintenanceFormValues } from './maintenance-schema';
import { useVehicle } from '@/hooks/useVehicle';

interface MaintenanceFormProps {
  onSubmit: (data: MaintenanceFormValues) => void;
  loading?: boolean;
  initialData?: Partial<MaintenanceFormValues>;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({
  onSubmit,
  loading,
  initialData
}) => {
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: initialData || {
      vehicle_id: 0,
      description: '',
      date: '',
      cost: 0,
      notes: ''
    }
  });
  // useVehicle hook'u en üstte çağırılıyor
  const { vehicles, loading: vehiclesLoading, error: vehiclesError } = useVehicle();

  React.useEffect(() => {
    if (initialData) {
      let normalized = { ...initialData };
      // date: yyyy-mm-dd string'e çevir
      if (initialData.date) {
        let dateStr = initialData.date as string;
        if (typeof initialData.date !== 'string') {
          try {
            const d = new Date(initialData.date as any);
            if (!isNaN(d.getTime())) dateStr = d.toISOString().slice(0, 10);
          } catch {
            dateStr = '';
          }
        }
        const match =
          typeof dateStr === 'string'
            ? dateStr.match(/\d{4}-\d{2}-\d{2}/)
            : null;
        normalized.date = match ? match[0] : '';
      }
      // cost: number'a çevir
      if (typeof initialData.cost === 'string') {
        normalized.cost = parseFloat(initialData.cost) || 0;
      }
      // vehicle_id: number'a çevir
      if (typeof initialData.vehicle_id === 'string') {
        normalized.vehicle_id = parseInt(initialData.vehicle_id) || 0;
      }
      form.reset(normalized);
    } else {
      form.reset({
        vehicle_id: 0,
        description: '',
        date: '',
        cost: 0,
        notes: ''
      });
    }
  }, [initialData]);

  return (
    <form
      id='maintenance-form'
      onSubmit={form.handleSubmit(onSubmit)}
      className='flex flex-col gap-4'
    >
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Araç</label>
        {/** Araçlar select'i */}
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
            {form.formState.errors.vehicle_id.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Açıklama</label>
        <input
          {...form.register('description')}
          placeholder='Bakım açıklaması'
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        {form.formState.errors.description && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.description.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Bakım Tarihi</label>
        <input
          type='date'
          {...form.register('date', { required: true })}
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        {form.formState.errors.date && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.date.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Tutar</label>
        <input
          type='number'
          {...form.register('cost', { valueAsNumber: true })}
          placeholder='1000'
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        {form.formState.errors.cost && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.cost.message}
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
            {form.formState.errors.notes.message}
          </span>
        )}
      </div>
    </form>
  );
};

export default MaintenanceForm;
