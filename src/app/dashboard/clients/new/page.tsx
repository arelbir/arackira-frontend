'use client';

import Link from 'next/link';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

import { ClientFormProvider, useClientFormContext } from '@/features/clients/context/ClientFormProvider';
import { ClientForm } from '@/features/clients/components/ClientForm';
import { useClientMutation } from '@/features/clients/hooks/useClientMutation';
import type { ClientCompanyFormValues } from '@/features/clients/schemas/client.schema';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const NewClientForm = () => {
  const { handleSubmit } = useClientFormContext();
  const { createClient, isCreating } = useClientMutation();

  const onSave = (data: ClientCompanyFormValues) => {
    createClient(data);
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-30 bg-background/95 p-4 mb-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" aria-label="Geri dön">
              <Link href="/dashboard/clients">
                <ArrowLeftIcon />
              </Link>
            </Button>
            <h1 className="text-lg font-semibold">Yeni Müşteri Ekle</h1>
          </div>
          <Button onClick={handleSubmit(onSave)} disabled={isCreating}>
            {isCreating ? 'Kaydediliyor...' : 'Müşteriyi Kaydet'}
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-0">
        <Card className="p-6 mt-2 mb-10 shadow-lg w-full mx-auto">
          <ClientForm />
        </Card>
      </div>
    </div>
  );
};

export default function NewClientPage() {
  return (
    <ClientFormProvider>
      <NewClientForm />
    </ClientFormProvider>
  );
}
