'use client';

import React from 'react';
import { useParams } from 'next/navigation';

// Bu component, URL'den gelen parametreleri `useParams` hook'u ile alır.
const ClientViewPage = () => {
  const params = useParams();
  const id = params.id as string; // Gelen parametreyi string olarak alıyoruz.

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Müşteri Detay Sayfası</h1>
      <p className="mt-4">
        Görüntülenen müşteri ID: <strong>{id}</strong>
      </p>
      {/* 
        Burada, bu ID'yi kullanarak müşterinin detaylarını 
        API'den çekecek ve gösterecek bir bileşen (örn. <ClientDetail id={id} />)
        kullanılabilir.
      */}
    </div>
  );
};

export default ClientViewPage;
