// Kiralama modülü sayfası
import React from 'react';
import RentalList from '@/features/rental/rental-list';
import ProtectedRoute from '@/components/ProtectedRoute';

const RentalPage = () => (
  <ProtectedRoute>
    <RentalList />
  </ProtectedRoute>
);

export default RentalPage;
