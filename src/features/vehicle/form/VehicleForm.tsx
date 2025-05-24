"use client";

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VehicleFormValues, vehicleSchema } from '../vehicle-schema';
import GeneralInfoSection from './GeneralInfoSection';
import OfficialInfoSection from './OfficialInfoSection';
import OwnershipInfoSection from './OwnershipInfoSection';


interface VehicleFormProps {
  initialData?: Partial<VehicleFormValues>;
  onSubmit: (data: VehicleFormValues) => void;
  loading?: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ initialData, onSubmit, loading }) => {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initialData || {}
  });

  const handleSubmit: SubmitHandler<VehicleFormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      <section>
        <h2 className="font-bold text-lg mb-2">Genel Bilgiler</h2>
        <GeneralInfoSection form={form} />
      </section>
      <section>
        <h2 className="font-bold text-lg mb-2">Resmi Bilgiler</h2>
        <OfficialInfoSection form={form} />
      </section>
      <section>
        <h2 className="font-bold text-lg mb-2">Haklama ve Bakım Bilgileri</h2>
        <OwnershipInfoSection form={form} />
      </section>
      <div>
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;
