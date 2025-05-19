import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contractSchema, ContractFormValues } from './contract-schema';

interface ContractFormProps {
  onSubmit: (data: ContractFormValues) => void;
  loading?: boolean;
  initialData?: Partial<ContractFormValues>;
}

const ContractForm: React.FC<ContractFormProps> = ({
  onSubmit,
  loading,
  initialData
}) => {
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: initialData || {
      contract_number: '',
      supplier: '',
      purchase_date: '',
      total_value: 0,
      notes: ''
    }
  });

  React.useEffect(() => {
    if (initialData) {
      let normalized = { ...initialData };
      // purchase_date: yyyy-mm-dd string'e çevir
      if (initialData.purchase_date) {
        let dateStr = initialData.purchase_date as string;
        if (typeof initialData.purchase_date !== 'string') {
          try {
            const d = new Date(initialData.purchase_date as any);
            if (!isNaN(d.getTime())) dateStr = d.toISOString().slice(0, 10);
          } catch {
            dateStr = '';
          }
        }
        const match =
          typeof dateStr === 'string'
            ? dateStr.match(/\d{4}-\d{2}-\d{2}/)
            : null;
        normalized.purchase_date = match ? match[0] : '';
      }
      // total_value: number'a çevir
      if (typeof initialData.total_value === 'string') {
        normalized.total_value = parseFloat(initialData.total_value) || 0;
      }
      form.reset(normalized);
    } else {
      form.reset({
        contract_number: '',
        supplier: '',
        purchase_date: '',
        total_value: 0,
        notes: ''
      });
    }
  }, [initialData]);

  return (
    <form
      id='contract-form'
      onSubmit={form.handleSubmit(onSubmit)}
      className='flex flex-col gap-4'
    >
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Sözleşme No</label>
        <input
          {...form.register('contract_number')}
          placeholder='2024-001'
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        {form.formState.errors.contract_number && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.contract_number.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Tedarikçi</label>
        <input
          {...form.register('supplier')}
          placeholder='Tedarikçi firma adı'
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        {form.formState.errors.supplier && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.supplier.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>
          Satın Alma Tarihi
        </label>
        <input
          type='date'
          {...form.register('purchase_date', { required: true })}
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        {form.formState.errors.purchase_date && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.purchase_date.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <label className='text-foreground font-semibold'>Toplam Tutar</label>
        <input
          type='number'
          {...form.register('total_value', { valueAsNumber: true })}
          placeholder='100000'
          className='border-border focus:ring-primary bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 focus:ring-2 focus:outline-none'
        />
        {form.formState.errors.total_value && (
          <span className='text-xs text-red-600'>
            {form.formState.errors.total_value.message}
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

export default ContractForm;
