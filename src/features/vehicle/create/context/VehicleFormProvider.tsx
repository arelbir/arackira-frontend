'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { createContext, useContext } from 'react';

import { vehicleFormValidationSchema, VehicleFormValues } from '../../schemas';

// Sadece form instance'ını tutacak olan Context'i oluşturuyoruz.
const VehicleFormContext = createContext<UseFormReturn<VehicleFormValues> | null>(
  null
);

// Diğer bileşenlerin forma erişmesini sağlayacak olan hook.
export const useVehicleFormContext = () => {
  const context = useContext(VehicleFormContext);
  if (!context) {
    throw new Error(
      'useVehicleFormContext must be used within a VehicleFormProvider'
    );
  }
  return context;
};

interface VehicleFormProviderProps {
  children: React.ReactNode;
  defaultValues?: Partial<VehicleFormValues>;
}

/**
 * Bu Provider'ın tek sorumluluğu, react-hook-form tarafından oluşturulan
 * form state'ini ve metodlarını (form instance) alt bileşenlere sağlamaktır.
 * API çağrıları, veri dönüşümleri veya diğer yan etkiler burada yer almaz.
 */
export const VehicleFormProvider = ({
  children,
  defaultValues = {},
}: VehicleFormProviderProps) => {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormValidationSchema),
    mode: 'onBlur',
    defaultValues: {
      inspections: [],
      insurances: [],
      ...defaultValues,
    },
  });

  return (
    <VehicleFormContext.Provider value={form}>
      <FormProvider {...form}>{children}</FormProvider>
    </VehicleFormContext.Provider>
  );
};
