import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import FormInputField from './FormInputField';
import FormSelectField from './FormSelectField';
import { VehicleFormValues } from '../vehicle-schema';
import { useBrand, useModel, useColor, useFuelType, useTransmission, useVehicleType } from '@/features/definitions/hooks';

interface GeneralInfoSectionProps {
  form: UseFormReturn<VehicleFormValues>;
}

const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({ form }) => {
  const { brands } = useBrand();
  const { models } = useModel();
  const { colors } = useColor();
  const { fuelTypes } = useFuelType(null);
  const { transmissions } = useTransmission(null);
  const { vehicleTypes } = useVehicleType(null);
  // Select için {label, value} formatına dönüştür
  const brandOptions = (brands || []).map(b => ({ label: b.name, value: b.id }));
  const modelOptions = (models || []).map(m => ({ label: m.name, value: m.id }));
  const colorOptions = (colors || []).map(c => ({ label: c.name, value: c.id }));
  const fuelTypeOptions = (fuelTypes || []).map(f => ({ label: f.name, value: f.id }));
  const transmissionOptions = (transmissions || []).map(t => ({ label: t.name, value: t.id }));
  const vehicleTypeOptions = (vehicleTypes || []).map(v => ({ label: v.name, value: v.id }));
  // groups ve bodyTypes ileride API'den gelecek
  const groups: { label: string; value: number }[] = [];
  const bodyTypes: { label: string; value: string }[] = [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormInputField
        label="Plaka"
        name="plate_number"
        value={form.watch('plate_number')}
        onChange={form.register('plate_number').onChange}
        error={form.formState.errors.plate_number}
      />
      <FormInputField
        label="Şasi No"
        name="branch_id"
        type="number"
        value={form.watch('branch_id')}
        onChange={form.register('branch_id').onChange}
        error={form.formState.errors.branch_id}
        placeholder="Şasi ID giriniz"
      />
      <FormSelectField
        label="Cins"
        name="vehicle_type_id"
        value={form.watch('vehicle_type_id') || ''}
        onChange={form.register('vehicle_type_id').onChange}
        options={vehicleTypeOptions}
        error={form.formState.errors.vehicle_type_id}
        placeholder="Seçiniz"
      />
      <FormSelectField
        label="Marka"
        name="brand_id"
        value={form.watch('brand_id') || ''}
        onChange={form.register('brand_id').onChange}
        options={brandOptions}
        error={form.formState.errors.brand_id}
        placeholder="Seçiniz"
      />
      <FormSelectField
        label="Model"
        name="model_id"
        value={form.watch('model_id') || ''}
        onChange={form.register('model_id').onChange}
        options={modelOptions}
        error={form.formState.errors.model_id}
        placeholder="Seçiniz"
      />
      <FormInputField
        label="Versiyon"
        name="version"
        value={form.watch('version')}
        onChange={form.register('version').onChange}
        error={form.formState.errors.version}
      />
      <FormInputField
        label="Paket"
        name="package"
        value={form.watch('package')}
        onChange={form.register('package').onChange}
        error={form.formState.errors.package}
      />
      <FormSelectField
        label="Grup"
        name="vehicle_group_id"
        value={form.watch('vehicle_group_id') || ''}
        onChange={form.register('vehicle_group_id').onChange}
        options={groups}
        error={form.formState.errors.vehicle_group_id}
        placeholder="Seçiniz"
      />
      <FormSelectField
        label="Kasa Tipi"
        name="body_type"
        value={form.watch('body_type') || ''}
        onChange={form.register('body_type').onChange}
        options={bodyTypes}
        error={form.formState.errors.body_type}
        placeholder="Seçiniz"
      />
      <FormSelectField
        label="Yakıt Tipi"
        name="fuel_type_id"
        value={form.watch('fuel_type_id') || ''}
        onChange={form.register('fuel_type_id').onChange}
        options={fuelTypeOptions}
        error={form.formState.errors.fuel_type_id}
        placeholder="Seçiniz"
      />
      <FormSelectField
        label="Vites Tipi"
        name="transmission_id"
        value={form.watch('transmission_id') || ''}
        onChange={form.register('transmission_id').onChange}
        options={transmissionOptions}
        error={form.formState.errors.transmission_id}
        placeholder="Seçiniz"
      />
      <FormInputField
        label="Model Yılı"
        name="model_year"
        type="number"
        value={form.watch('model_year')}
        onChange={form.register('model_year').onChange}
        error={form.formState.errors.model_year}
      />
      <FormSelectField
        label="Renk"
        name="color_id"
        value={form.watch('color_id') || ''}
        onChange={form.register('color_id').onChange}
        options={colorOptions}
        error={form.formState.errors.color_id}
        placeholder="Seçiniz"
      />
      <FormInputField
        label="Motor Gücü (hp)"
        name="engine_power_hp"
        type="number"
        value={form.watch('engine_power_hp')}
        onChange={form.register('engine_power_hp').onChange}
        error={form.formState.errors.engine_power_hp}
      />
      <FormInputField
        label="Motor Hacmi (cc)"
        name="engine_volume_cc"
        type="number"
        value={form.watch('engine_volume_cc')}
        onChange={form.register('engine_volume_cc').onChange}
        error={form.formState.errors.engine_volume_cc}
      />
    </div>
  );
};

export default GeneralInfoSection;
