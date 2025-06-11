import React from 'react';
import DisposalList from '@/features/disposal/disposal-list';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DisposalPage() {
  return (
    <ProtectedRoute>
      <div className='p-4'>
        <h1 className='mb-4 text-2xl font-bold'>Elden Çıkarma Kayıtları</h1>
        <DisposalList />
      </div>
    </ProtectedRoute>
  );
}
