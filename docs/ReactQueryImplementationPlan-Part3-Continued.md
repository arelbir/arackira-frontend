# React Query Implementasyon Planı - Bölüm 3: İleri Düzey Özellikler ve Uygulama Stratejisi (Devam)

## 3. Optimistic Updates ve Mutation (1.5 saat)

```tsx
// src/hooks/queries/use-optimistic-mutation.ts
import { useMutation, useQueryClient, MutationFunction } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

interface UseOptimisticMutationProps<TData, TVariable> {
  mutationFn: MutationFunction<TData, TVariable>;
  queryKey: string[];
  optimisticUpdate: (variables: TVariable, oldData: any) => any;
  rollbackOnError?: boolean;
  onSuccess?: (data: TData) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useOptimisticMutation<TData, TVariable>({
  mutationFn,
  queryKey,
  optimisticUpdate,
  rollbackOnError = true,
  onSuccess,
  successMessage,
  errorMessage = "İşlem sırasında bir hata oluştu",
}: UseOptimisticMutationProps<TData, TVariable>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn,
    
    // İyimser güncelleme
    onMutate: async (variables) => {
      // Eski sorgu verilerini yakala
      const oldData = queryClient.getQueryData(queryKey);
      
      // İyimser güncellemeyi uygula
      queryClient.setQueryData(queryKey, (old: any) => 
        optimisticUpdate(variables, old)
      );
      
      return { oldData };
    },
    
    onSuccess: (data, _, context) => {
      if (successMessage) {
        toast({
          title: "Başarılı",
          description: successMessage,
        });
      }
      
      if (onSuccess) {
        onSuccess(data);
      }
    },
    
    onError: (error, _, context) => {
      // Hata durumunda eski verilere geri dön
      if (rollbackOnError && context?.oldData) {
        queryClient.setQueryData(queryKey, context.oldData);
      }
      
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : errorMessage,
        variant: "destructive",
      });
    },
    
    onSettled: () => {
      // İşlem tamamlandığında sorgu verilerini yeniden getir
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
```

## 4. Infinite Queries için Destek (1.5 saat)

```tsx
// src/hooks/queries/use-infinite-query.ts
import {
  useInfiniteQuery as useInfiniteReactQuery,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

interface UseInfiniteQueryOptions<TData, TError> {
  queryKey: string[];
  queryFn: (page: number) => Promise<{
    data: TData[];
    nextPage: number | null;
  }>;
  enabled?: boolean;
  getNextPageParam?: (lastPage: any) => number | null | undefined;
}

export function useInfiniteQuery<TData = unknown, TError = Error>({
  queryKey,
  queryFn,
  enabled = true,
}: UseInfiniteQueryOptions<TData, TError>): InfiniteQueryObserverResult<{
  data: TData[];
  nextPage: number | null;
}, TError> {
  return useInfiniteReactQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => queryFn(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled,
    onError: (error) => {
      toast({
        title: "Veri yükleme hatası",
        description: error instanceof Error ? error.message : "Bilinmeyen hata",
        variant: "destructive",
      });
    },
  });
}
```

## 5. Performans Optimizasyonları (1.5 saat)

```tsx
// src/hooks/queries/use-optimized-query.ts
"use client";

import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

export function useOptimizedQuery(/* parametreler */) {
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const result = useQuery({
    // Standart konfigürasyon...
    queryFn: async () => {
      // Önceki isteği iptal et
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Yeni istek için AbortController
      abortControllerRef.current = new AbortController();
      
      return fetch(url, {
        signal: abortControllerRef.current.signal,
        // Diğer fetch options...
      }).then(res => res.json());
    },
  });
  
  // Unmount işleminde isteği iptal et
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  return result;
}
```

## 6. Error Boundaries ve Retry Stratejileri (1 saat)

```tsx
// src/components/error-boundary.tsx
"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error boundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center border rounded-lg shadow-sm bg-background">
          <AlertTriangle size={48} className="text-destructive" />
          <h2 className="text-xl font-semibold">Bir şeyler ters gitti</h2>
          <p className="text-muted-foreground">
            {this.state.error?.message || "Beklenmeyen bir hata oluştu."}
          </p>
          <Button onClick={() => this.setState({ hasError: false, error: null })}>
            Yeniden Dene
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// src/hooks/queries/use-query-config.ts - Global query konfigürasyonu
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export const useQueryErrorHandler = () => {
  return (error: unknown) => {
    console.error("Query error:", error);
    
    toast({
      variant: "destructive",
      title: "Bağlantı Hatası",
      description: error instanceof Error 
        ? error.message 
        : "Veri yüklenirken beklenmeyen bir hata oluştu",
    });
  };
};

export const defaultQueryRetry = (failureCount: number, error: unknown) => {
  // Bazı hata türleri için retry yapmayı devre dışı bırak
  if (error instanceof Error) {
    // 401, 403 gibi auth hataları için retry yapma
    if (error.message.includes('401') || error.message.includes('403')) {
      return false;
    }
    
    // 404 hataları için retry yapma
    if (error.message.includes('404')) {
      return false;
    }
  }
  
  // Max 3 retry
  return failureCount < 3;
};

export const getQueryRetryDelay = (attempt: number) => {
  // Exponential backoff: 1s, 2s, 4s...
  return Math.min(1000 * 2 ** attempt, 30000);
};
```
