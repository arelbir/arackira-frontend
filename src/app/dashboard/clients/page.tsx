'use client';
import { ClientTable } from '@/features/clients/components/ClientTable';
import { useClients } from '@/features/clients/hooks/useClients';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ClientsPage() {
  const { clients, isLoading, isError } = useClients();

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Müşteriler</h1>
        <Button asChild>
          <Link href="/dashboard/clients/new">Yeni Müşteri</Link>
        </Button>
      </div>
      {isLoading ? (
        <div>Yükleniyor...</div>
      ) : isError ? (
        <div>Hata oluştu.</div>
      ) : (
        <ClientTable data={clients} />
      )}
    </div>
  );
}
