'use client';
import { ClientForm } from '@/features/clients/components/ClientForm';
import { useRouter } from 'next/navigation';
import { useCreateClient } from '@/features/clients/hooks/useCreateClient';
import { toast } from 'sonner';

export default function NewClientPage() {
  const router = useRouter();
  const { createClient, isCreating } = useCreateClient();

  async function handleSubmit(values: any) {
    try {
      await createClient(values);
      toast.success('Müşteri başarıyla eklendi');
      router.push('/dashboard/clients');
    } catch (err: any) {
      toast.error(err?.message || 'Müşteri kaydedilemedi');
    }
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Yeni Müşteri Ekle</h1>
      <ClientForm onSubmit={handleSubmit} disabled={isCreating} />
    </div>
  );
}
