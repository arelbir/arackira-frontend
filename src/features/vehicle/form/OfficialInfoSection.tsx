import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import FormInputField from './FormInputField';
import FormDateField from './FormDateField';
import { VehicleFormValues } from '../vehicle-schema';

interface OfficialInfoSectionProps {
  form: UseFormReturn<VehicleFormValues>;
}

const OfficialInfoSection: React.FC<OfficialInfoSectionProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormInputField
        label="Şasi No"
        name="chassis_number"
        value={form.watch('chassis_number')}
        onChange={form.register('chassis_number').onChange}
        error={form.formState.errors.chassis_number}
      />
      <FormInputField
        label="Motor No"
        name="engine_number"
        value={form.watch('engine_number')}
        onChange={form.register('engine_number').onChange}
        error={form.formState.errors.engine_number}
      />
      <FormDateField
        label="İlk Tescil Tarihi"
        name="first_registration_date"
        value={form.watch('first_registration_date')}
        onChange={form.register('first_registration_date').onChange}
        error={form.formState.errors.first_registration_date}
      />
      <FormInputField
        label="Ruhsat Belge No"
        name="registration_document_number"
        value={form.watch('registration_document_number')}
        onChange={form.register('registration_document_number').onChange}
        error={form.formState.errors.registration_document_number}
      />
      <FormDateField
        label="Satın Alma Tarihi"
        name="acquisition_date"
        value={form.watch('acquisition_date')}
        onChange={form.register('acquisition_date').onChange}
        error={form.formState.errors.acquisition_date}
      />
      <FormInputField
        label="Satın Alma Maliyeti"
        name="acquisition_cost"
        type="number"
        value={form.watch('acquisition_cost')}
        onChange={form.register('acquisition_cost').onChange}
        error={form.formState.errors.acquisition_cost}
      />
    </div>
  );
};

export default OfficialInfoSection;
