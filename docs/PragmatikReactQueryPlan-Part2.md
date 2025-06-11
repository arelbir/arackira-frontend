# Pragmatik React Query Implementasyon Planı - Bölüm 2

## Aşama 2: Model Servisi ve Hook İmplementasyonu (2-3 saat)

### 2.1. Model Servisi

```tsx
// src/features/definitions/models/model-service.ts
import { z } from 'zod';
import { apiRequest } from '@/lib/api-client';

// Model için Zod şeması
export const ModelSchema = z.object({
  id: z.number(),
  name: z.string(),
  brand_id: z.number(),
});

export type Model = z.infer<typeof ModelSchema>;

// Model listesini getiren fonksiyon
export async function getModelsByBrand(brandId: number): Promise<Model[]> {
  return apiRequest<Model[]>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/vehicle-models?brand_id=${brandId}`,
    schema: z.array(ModelSchema),
  });
}
```

### 2.2. React Query ile Model Hook'u

```tsx
// src/features/definitions/models/use-models.ts
"use client";

import { useQuery } from '@tanstack/react-query';
import { Model, getModelsByBrand } from './model-service';
import { toast } from '@/components/ui/use-toast';

export function useModelsByBrand(brandId: number | null) {
  return useQuery({
    queryKey: ['models', brandId],
    queryFn: async () => {
      if (!brandId) return [];
      return getModelsByBrand(brandId);
    },
    enabled: !!brandId, // Sadece geçerli bir brandId varsa sorgu çalışsın
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Model listesi yüklenirken bir hata oluştu",
        variant: "destructive",
      });
      console.error('Model listesi yükleme hatası:', error);
    },
  });
}
```

### 2.3. Diğer Bağımlı Veriler için Benzer Hook'lar

```tsx
// src/features/definitions/packages/package-service.ts
import { z } from 'zod';
import { apiRequest } from '@/lib/api-client';

export const PackageSchema = z.object({
  id: z.number(),
  name: z.string(),
  model_id: z.number(),
});

export type Package = z.infer<typeof PackageSchema>;

export async function getPackagesByModel(modelId: number): Promise<Package[]> {
  return apiRequest<Package[]>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/vehicle-packages?model_id=${modelId}`,
    schema: z.array(PackageSchema),
  });
}

// src/features/definitions/packages/use-packages.ts
"use client";

import { useQuery } from '@tanstack/react-query';
import { Package, getPackagesByModel } from './package-service';
import { toast } from '@/components/ui/use-toast';

export function usePackagesByModel(modelId: number | null) {
  return useQuery({
    queryKey: ['packages', modelId],
    queryFn: async () => {
      if (!modelId) return [];
      return getPackagesByModel(modelId);
    },
    enabled: !!modelId,
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Paket listesi yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    },
  });
}
```
