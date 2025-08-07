'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

import { useClientById } from '@/features/clients/hooks/useClientById';
import { ClientFormProvider, useClientFormContext } from '@/features/clients/context/ClientFormProvider';
import { ClientForm } from '@/features/clients/components/ClientForm';
import { useClientMutation } from '@/features/clients/hooks/useClientMutation';
import type { ClientCompanyFormValues } from '@/features/clients/schemas/client.schema';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const EditClientForm = () => {
  const { handleSubmit } = useClientFormContext();
  const { updateClient, isUpdating } = useClientMutation();
  const params = useParams();
  const id = params.id as string;

  const onSave = (data: ClientCompanyFormValues) => {
    updateClient({ id, data });
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
            <h1 className="text-lg font-semibold">Müşteri Düzenle</h1>
          </div>
          <Button onClick={handleSubmit(onSave)} disabled={isUpdating}>
            {isUpdating ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-0">
        <Card className="p-6 mt-2 mb-10 shadow-lg w-full mx-auto">
          <ClientForm clientId={id} />
        </Card>
      </div>
    </div>
  );
};

export default function EditClientPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const { client, isLoading, isError } = useClientById(id);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-12 w-1/4 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-destructive">
        <h2 className="text-xl font-semibold mb-4">Hata</h2>
        <p>Müşteri verileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
        <Button onClick={() => router.back()} className="mt-4">Geri Dön</Button>
      </div>
    );
  }

  return (
    <ClientFormProvider initialData={client}>
      <EditClientForm />
    </ClientFormProvider>
  );
}
