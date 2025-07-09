'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ClientForm } from '@/features/clients/components/ClientForm';
import { Skeleton } from '@/components/ui/skeleton';
import { useClientById } from '@/features/clients/hooks/useClientById';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function EditClientPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === 'string' ? params.id : '';
  
  const { client, isLoading, isError } = useClientById(id);
  
  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-[40px] w-[250px] mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-[60px] w-full" />
          <Skeleton className="h-[60px] w-full" />
          <Skeleton className="h-[60px] w-full" />
        </div>
      </div>
    );
  }
  
  if (isError || !client) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold mb-4">Hata</h2>
        <p className="text-destructive">
          Müşteri bilgileri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          onClick={() => router.back()}
        >
          Geri Dön
        </button>
      </div>
    );
  }
  
  return (
    <ProtectedRoute>
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-6">Müşteri Düzenle</h2>
        <ClientForm 
          initial={client} 
          onSubmit={() => router.push('/dashboard/clients')} 
          disabled={false}
        />
      </div>
    </ProtectedRoute>
  );
}
