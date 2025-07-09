'use client';
import ClientList from '@/features/clients/ClientList';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function ClientsPage() {
  return (
    <ProtectedRoute>
      <ClientList />
    </ProtectedRoute>
  );
}