# React Query Implementasyon Planı - Bölüm 3: İleri Düzey Özellikler ve Uygulama Stratejisi

## 1. Server Side Rendering (SSR) Desteği (2 saat)

```tsx
// src/app/vehicle/page.tsx - Next.js App Router için
import { Hydrate, dehydrate, QueryClient } from '@tanstack/react-query';
import { getVehicles } from '@/features/vehicle/vehicle-service';
import { VehicleList } from '@/features/vehicle/VehicleList';

// Server Component
export default async function VehiclesPage() {
  const queryClient = new QueryClient();
  
  // SSR sırasında veriyi prefetch
  await queryClient.prefetchQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles,
  });
  
  return (
    <Hydrate state={dehydrate(queryClient)}>
      <VehicleList />
    </Hydrate>
  );
}
```

```tsx
// src/app/vehicle/[id]/page.tsx - Dinamik rotalar için
import { Hydrate, dehydrate, QueryClient } from '@tanstack/react-query';
import { getVehicleById } from '@/features/vehicle/vehicle-service';
import { VehicleDetail } from '@/features/vehicle/VehicleDetail';

interface Params {
  id: string;
}

// Server Component
export default async function VehicleDetailPage({ params }: { params: Params }) {
  const queryClient = new QueryClient();
  
  // SSR sırasında veriyi prefetch
  await queryClient.prefetchQuery({
    queryKey: ['vehicle', params.id],
    queryFn: () => getVehicleById(parseInt(params.id, 10)),
  });
  
  return (
    <Hydrate state={dehydrate(queryClient)}>
      <VehicleDetail id={parseInt(params.id, 10)} />
    </Hydrate>
  );
}
```

## 2. Zustand ile React Query Entegrasyonu (2 saat)

```tsx
// src/store/api-cache-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// API önbellek için tip tanımı
interface ApiCache {
  [key: string]: {
    data: any;
    timestamp: number;
  };
}

interface ApiCacheStore {
  cache: ApiCache;
  getCache: (key: string | string[]) => any;
  setCache: (key: string | string[], data: any) => void;
  clearCache: (key?: string | string[]) => void;
  getCacheExpiry: (key: string | string[]) => number | null;
}

// Yardımcı fonksiyonlar
const getCacheKey = (key: string | string[]) => 
  Array.isArray(key) ? key.join('-') : key;

export const useApiCacheStore = create<ApiCacheStore>()(
  persist(
    (set, get) => ({
      cache: {},
      
      getCache: (key) => {
        const cacheKey = getCacheKey(key);
        const cachedItem = get().cache[cacheKey];
        return cachedItem?.data || null;
      },
      
      setCache: (key, data) => {
        const cacheKey = getCacheKey(key);
        set((state) => ({
          cache: {
            ...state.cache,
            [cacheKey]: {
              data,
              timestamp: Date.now(),
            },
          },
        }));
      },
      
      clearCache: (key) => {
        if (!key) {
          set({ cache: {} });
          return;
        }
        
        const cacheKey = getCacheKey(key);
        set((state) => {
          const newCache = { ...state.cache };
          delete newCache[cacheKey];
          return { cache: newCache };
        });
      },
      
      getCacheExpiry: (key) => {
        const cacheKey = getCacheKey(key);
        const cachedItem = get().cache[cacheKey];
        return cachedItem?.timestamp || null;
      },
    }),
    {
      name: 'api-cache-storage',
    }
  )
);
```

```tsx
// src/hooks/queries/use-cached-query.ts
"use client";

import { QueryKey, UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from './use-query';
import { useApiCacheStore } from '@/store/api-cache-store';
import { useMemo } from 'react';

export function useCachedQuery<TData = unknown, TError = Error>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: Omit<
    UseQueryOptions<TData, TError, TData, QueryKey>,
    'queryKey' | 'queryFn' | 'initialData'
  > & {
    cacheTime?: number; // Önbellekte tutulacak süre (ms)
  }
) {
  const { getCache, setCache, getCacheExpiry } = useApiCacheStore();
  
  // Önbellekteki veri geçerli mi kontrol et
  const cachedData = useMemo(() => {
    const data = getCache(queryKey);
    const timestamp = getCacheExpiry(queryKey);
    
    if (!data || !timestamp) return undefined;
    
    // Önbellek süresi dolmuş mu?
    const cacheTime = options?.cacheTime || 1000 * 60 * 5; // Varsayılan 5 dakika
    if (Date.now() - timestamp > cacheTime) return undefined;
    
    return data;
  }, [queryKey, getCache, getCacheExpiry, options?.cacheTime]);
  
  return useQuery<TData, TError>(queryKey, queryFn, {
    ...options,
    initialData: cachedData,
    onSuccess: (data) => {
      setCache(queryKey, data);
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    }
  });
}
```
