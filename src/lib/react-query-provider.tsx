'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Merkezi QueryClient yapılandırması
// Tüm React Query sorguları için varsayılan ayarlar burada yapılandırılabilir
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default staleTime ayarı - 5 dakika
      staleTime: 1000 * 60 * 5,
      // Default cacheTime ayarı - 10 dakika
      gcTime: 1000 * 60 * 10,
      // Hata durumunda tekrar deneme ayarları
      retry: 1,
      retryDelay: 1000,
      // Varsayılan olarak refetch davranışı
      refetchOnWindowFocus: false
    },
    mutations: {
      // Mutation ayarları
      retry: 0,
    },
  },
});

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

// React Query Provider bileşeni
// Tüm uygulamada tankey/react-query kullanmak için _app.tsx veya layout.tsx içinde kullanılmalı
export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}

// Query Client'a erişim için export edilir
export { queryClient };
