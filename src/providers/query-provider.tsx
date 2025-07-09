"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 dakika önbellek süresi
        refetchOnWindowFocus: false, // Sekme odağı değiştiğinde yenileme yapma
        retry: 1, // Hata durumunda sadece 1 kez yeniden dene
        // Not: React Query 4 ile suspense ve useErrorBoundary özellikleri
        // type sistemine tam entegre olacak. Şimdilik bileşen-seviyesinde
        // kullanılabilir: useQuery({ suspense: true })
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
    </QueryClientProvider>
  );
}
