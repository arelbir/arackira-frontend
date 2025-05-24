import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import FormInputField from './FormInputField';
import FormSelectField from './FormSelectField';
import FormDateField from './FormDateField';
import { VehicleFormValues } from '../vehicle-schema';

interface OwnershipInfoSectionProps {
  form: UseFormReturn<VehicleFormValues>;
}

const OwnershipInfoSection: React.FC<OwnershipInfoSectionProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormSelectField
        label="Araç Sorumlusu"
        name="vehicle_responsible_id"
        value={form.watch('vehicle_responsible_id') || ''}
        onChange={form.register('vehicle_responsible_id').onChange}
        options={[]}
        error={form.formState.errors.vehicle_responsible_id}
        placeholder="Seçiniz"
      />
      <FormSelectField
        label="Müşteri"
        name="current_client_company_id"
        value={form.watch('current_client_company_id') || ''}
        onChange={form.register('current_client_company_id').onChange}
        options={[]}
        error={form.formState.errors.current_client_company_id}
        placeholder="Seçiniz"
      />
      <FormInputField
        label="Araç KM"
        name="vehicle_km"
        type="number"
        value={form.watch('vehicle_km')}
        onChange={form.register('vehicle_km').onChange}
        error={form.formState.errors.vehicle_km}
      />
      <FormDateField
        label="Sonraki Bakım Tarihi"
        name="next_maintenance_date"
        value={form.watch('next_maintenance_date')}
        onChange={form.register('next_maintenance_date').onChange}
        error={form.formState.errors.next_maintenance_date}
      />
      <FormDateField
        label="Muayene Bitiş Tarihi"
        name="inspection_expiry_date"
        value={form.watch('inspection_expiry_date')}
        onChange={form.register('inspection_expiry_date').onChange}
        error={form.formState.errors.inspection_expiry_date}
      />
      <FormDateField
        label="Sigorta Bitiş Tarihi"
        name="insurance_expiry_date"
        value={form.watch('insurance_expiry_date')}
        onChange={form.register('insurance_expiry_date').onChange}
        error={form.formState.errors.insurance_expiry_date}
      />
      <FormDateField
        label="Kasko Bitiş Tarihi"
        name="casco_expiry_date"
        value={form.watch('casco_expiry_date')}
        onChange={form.register('casco_expiry_date').onChange}
        error={form.formState.errors.casco_expiry_date}
      />
      <FormDateField
        label="Egzoz Pulu Bitiş Tarihi"
        name="exhaust_stamp_expiry_date"
        value={form.watch('exhaust_stamp_expiry_date')}
        onChange={form.register('exhaust_stamp_expiry_date').onChange}
        error={form.formState.errors.exhaust_stamp_expiry_date}
      />
    </div>
  );
};

export default OwnershipInfoSection;
