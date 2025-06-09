# React Query Implementasyon Planı - Bölüm 1: Temel Yapılandırma ve Altyapı

## 1. Kurulum ve Temel Yapılandırma (1 saat)

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

```tsx
// src/providers/query-provider.tsx
"use client"; // Next.js App Router için client directive

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 dakika
        refetchOnWindowFocus: false,
        retry: 1,
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

## 2. Next.js App Router Entegrasyonu (30 dakika)

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

## 3. Tip Güvenli API İstemcisi (1.5 saat)

```tsx
// src/lib/api-client.ts
import { z } from 'zod';

// API yanıt tipi için Zod şeması
const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
  error: z.string().optional(),
});

type ApiResponse<T> = z.infer<typeof ApiResponseSchema> & { data: T };

class ApiError extends Error {
  status?: number;
  data?: unknown;
  
  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiClient<T>({
  url,
  method = 'GET',
  body,
  headers = {},
}: {
  url: string;
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}): Promise<T> {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      throw new ApiError(
        `API error: ${res.status} ${res.statusText}`,
        res.status,
        await res.text()
      );
    }

    const json = await res.json();
    
    // API yanıt şemasını doğrula
    const parsed = ApiResponseSchema.safeParse(json);
    
    if (!parsed.success) {
      throw new ApiError('Invalid API response format', undefined, json);
    }
    
    if (!json.success) {
      throw new ApiError(json.error || 'Unknown API error', undefined, json);
    }

    return json.data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : 'Unknown error');
  }
}
```

## 4. Tip Güvenli React Query Hook'ları (2 saat)

```tsx
// src/hooks/queries/use-query.ts
"use client";

import {
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useQuery as useReactQuery,
} from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast'; // shadcn/ui toast
import { ApiError } from '@/lib/api-client';

export function useQuery<TData = unknown, TError = ApiError>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: Omit<
    UseQueryOptions<TData, TError, TData, QueryKey>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<TData, TError> {
  return useReactQuery({
    queryKey,
    queryFn,
    ...options,
    onError: (error) => {
      // Varsayılan hata işleme
      const isApiError = error instanceof ApiError;
      
      toast({
        title: "Hata",
        description: isApiError 
          ? error.message
          : "Veri yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
      
      // Kullanıcının kendi hata işleyicisini çağır
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
}

// src/hooks/queries/use-mutation.ts
"use client";

import {
  UseMutationOptions,
  UseMutationResult,
  useMutation as useReactMutation,
} from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { ApiError } from '@/lib/api-client';

export function useMutation<TData = unknown, TError = ApiError, TVariables = void, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    'mutationFn'
  >
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useReactMutation({
    mutationFn,
    ...options,
    onError: (error, variables, context) => {
      // Varsayılan hata işleme
      const isApiError = error instanceof ApiError;
      
      toast({
        title: "İşlem Hatası",
        description: isApiError
          ? error.message
          : "İşlem gerçekleştirilirken bir hata oluştu.",
        variant: "destructive",
      });
      
      // Kullanıcının kendi hata işleyicisini çağır
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
  });
}
```

## 5. Veri Servisleri (1.5 saat)

```tsx
// src/features/definitions/models/model-service.ts
import { z } from 'zod';
import { apiClient } from '@/lib/api-client';

// Model için Zod şeması
export const ModelSchema = z.object({
  id: z.number(),
  name: z.string(),
  brand_id: z.number(),
});

export type Model = z.infer<typeof ModelSchema>;

export const getModelsByBrand = async (brandId: number): Promise<Model[]> => {
  const models = await apiClient<unknown>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/vehicle-models?brand_id=${brandId}`,
  });
  
  // Gelen veriyi şema ile doğrula
  return z.array(ModelSchema).parse(models);
};
```
