# Pragmatik React Query Implementasyon Planı - Bölüm 1

## Genel Bakış

Bu plan, React Query'nin minimum gereken özelliklerini projemize entegre ederek form deneyimini iyileştirmeyi hedeflemektedir. Özellikle bağımlı veri çekme işlemleri (örn. marka seçildiğinde model listesinin yüklenmesi) üzerine odaklanmaktadır.

## Aşama 1: Temel Kurulum (1-2 saat)

### 1.1. Paketlerin Kurulumu

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### 1.2. QueryProvider Oluşturma

```tsx
// src/providers/query-provider.tsx
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
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
```

### 1.3. Next.js App Router'a Entegrasyon

```tsx
// src/app/layout.tsx
import { QueryProvider } from '@/providers/query-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <QueryProvider>
          {/* Diğer sağlayıcılar */}
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

### 1.4. Basit API İstemcisi

```tsx
// src/lib/api-client.ts
import { z } from 'zod';

// Basit API İstekler için yardımcı fonksiyon
export async function apiRequest<T>({
  url,
  method = 'GET',
  body,
  schema,
}: {
  url: string;
  method?: string;
  body?: any;
  schema?: z.ZodType<T>;
}): Promise<T> {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      throw new Error(`API Hatası: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    // Zod şeması verilmişse validasyon yap
    if (schema) {
      return schema.parse(data);
    }
    
    return data as T;
  } catch (error) {
    console.error('API isteği sırasında hata:', error);
    throw error;
  }
}
```
