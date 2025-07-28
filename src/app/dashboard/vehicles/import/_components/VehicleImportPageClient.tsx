'use client';

import React from 'react';
import { VehicleImportExport } from '@/features/vehicle/VehicleList/VehicleImportExport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VehicleImportPageClient() {
  return (

      <Card>
        <CardHeader>
          <CardTitle>Araçları Toplu İçe Aktar / Dışa Aktar</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleImportExport />
        </CardContent>
      </Card>

  );
}
