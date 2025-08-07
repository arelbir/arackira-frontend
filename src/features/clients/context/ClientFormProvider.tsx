'use client';

import { createContext, useContext, ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useClientForm } from '../hooks/useClientForm';
import type { ClientCompanyFormValues } from '../schemas/client.schema';

interface ClientFormContextProps extends UseFormReturn<ClientCompanyFormValues> {}

const ClientFormContext = createContext<ClientFormContextProps | undefined>(undefined);

export const useClientFormContext = () => {
  const context = useContext(ClientFormContext);
  if (!context) {
    throw new Error('useClientFormContext must be used within a ClientFormProvider');
  }
  return context;
};

interface ClientFormProviderProps {
  children: ReactNode;
  initialData?: Partial<ClientCompanyFormValues>;
}

export const ClientFormProvider = ({ children, initialData }: ClientFormProviderProps) => {
  const form = useClientForm(initialData || {});

  return (
    <ClientFormContext.Provider value={form}>
      {children}
    </ClientFormContext.Provider>
  );
};
