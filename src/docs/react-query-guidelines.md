# React Query Entegrasyon Rehberi

Bu rehber, Araç Kira projesindeki React Query entegrasyonunu anlatmak ve tutarlı geliştirme yapmak için hazırlanmıştır.

## Mimari Yapı

Her entity için aşağıdaki dosya yapısını takip ediyoruz:

```
src/features/[entity-name]/
  |- [entity-name]-service.ts    // API istekleri ve Zod şemaları
  |- use-[entity-name].ts        // React Query hooks
```

## Dosya İsimlendirme

- Dosya isimleri kebab-case kullanır: `vehicle-type-service.ts`, `use-vehicle-types.ts`
- React Query hook'ları genellikle `use` prefixi ile başlar
- Servis dosyaları genellikle entity-name + `-service` şeklinde isimlendirilir

## Servis Dosyaları

Servis dosyaları şunları içerir:

1. **Zod Şemaları**: Tip güvenliği ve runtime validasyon için
2. **API Fonksiyonları**: CRUD işlemleri için
3. **Tipler**: TypeScript arayüzleri (Zod şemalarından otomatik çıkarım)

Örnek:

```typescript
import { z } from 'zod';
import { apiRequest } from '@/lib/api';

// Şema
export const VehicleTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  // ...
});

// Tipler
export type VehicleType = z.infer<typeof VehicleTypeSchema>;

// API fonksiyonları
export async function getAllVehicleTypes() {
  return apiRequest<VehicleType[]>({
    url: '/vehicle-types',
    schema: z.array(VehicleTypeSchema),
  });
}

// ...diğer CRUD işlemleri
```

## React Query Hooks

React Query hook'ları şunları içerir:

1. **Veri Çekme (Queries)**: `useQuery` kullanarak veri çekme işlemleri
2. **Veri Mutasyonları (Mutations)**: `useMutation` kullanarak veri değiştirme işlemleri
3. **Toast Bildirimleri**: Başarı ve hata durumları için
4. **Önbellek Yönetimi**: invalidateQueries için query keys

Örnek:

```typescript
export function useAllVehicleTypes() {
  return useQuery({
    queryKey: ['vehicleTypes'],
    queryFn: () => getAllVehicleTypes(),
  });
}

export function useVehicleTypeMutations() {
  const queryClient = useQueryClient();
  
  const addMutation = useMutation({
    mutationFn: (data: Partial<VehicleType>) => createVehicleType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicleTypes'] });
      toast.success("Başarılı", { description: "Araç tipi eklendi" });
    },
    onError: (error) => {
      toast.error("Hata", { description: "Araç tipi eklenirken hata oluştu" });
    }
  });
  
  // ...diğer mutasyonlar

  return {
    addVehicleType: addMutation.mutate,
    isAddingVehicleType: addMutation.isPending,
    // ...diğer mutasyon özellikleri
  };
}
```

## Optimistik Güncellemeler

Kullanıcı deneyimini iyileştirmek için optimistik güncellemeler kullanıyoruz:

```typescript
const updateMutation = useMutation({
  mutationFn: (data) => updateEntity(data),
  onMutate: async (newData) => {
    // Önceki sorguları iptal et
    await queryClient.cancelQueries({ queryKey: ['entity'] });
    
    // Mevcut verileri al
    const previousData = queryClient.getQueryData(['entity']);
    
    // Optimistik güncelleme yap
    queryClient.setQueryData(['entity'], (old) => [...]);
    
    // Önceki verileri döndür
    return { previousData };
  },
  onError: (error, newData, context) => {
    // Hata durumunda eski verileri geri yükle
    queryClient.setQueryData(['entity'], context.previousData);
  },
  onSettled: () => {
    // İşlem tamamlandığında sorguları yenile
    queryClient.invalidateQueries({ queryKey: ['entity'] });
  }
});
```

## Prefetching (Ön Yükleme)

Detay sayfalarını daha hızlı yüklemek için prefetching kullanımı:

```typescript
// Mouse ile üzerine gelindiğinde veriyi ön yükle
const prefetchEntity = (id) => {
  queryClient.prefetchQuery({
    queryKey: ['entity', id],
    queryFn: () => getEntityById(id),
    staleTime: 1000 * 60 * 5, // 5 dakika önbellekleme
  });
};

<Link 
  href={`/entities/${entity.id}`}
  onMouseEnter={() => prefetchEntity(entity.id)}
>
  {entity.name}
</Link>
```

## Context Entegrasyonu

React Query hook'larını varolan context'lerle birleştirme:

```tsx
export function EntityProvider({ children }) {
  // React Query hook'u
  const { data, isLoading, error } = useEntityById(id);
  
  // Context state
  const [formState, setFormState] = useState({...});
  
  // ...context logic

  return (
    <EntityContext.Provider value={{...}}>
      {children}
    </EntityContext.Provider>
  );
}
```

## Genel Kurallar

1. **Tip Güvenliği**: Her zaman Zod şemaları kullanın ve tip çıkarımı yapın
2. **Toast Bildirimler**: Tüm başarı ve hata durumlarında toast bildirimleri kullanın
3. **Query Keys**: Tutarlı query key yapısı kullanın (örn: ['entity'], ['entity', id])
4. **StaleTime**: Genellikle 5 dakika staleTime kullanın (değişime açık)
5. **Optimistik Güncellemeler**: Kullanıcı deneyimini iyileştirmek için optimistik güncellemeler ekleyin
6. **Error Handling**: Hataları yakalayın ve kullanıcıya bilgi verin

## Yeni Entity Eklerken

1. Entity için Zod şeması oluşturun
2. API servis fonksiyonlarını yazın
3. React Query hook'larını oluşturun
4. UI bileşenlerinde hook'ları kullanın
5. Toast bildirimleri ekleyin
6. Önbellek yönetimini yapılandırın
7. Optimistik güncellemeler ekleyin (gerekirse)

## Query Client Yapılandırması

```tsx
// src/providers/query-provider.tsx
const [queryClient] = useState(() => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 dakika önbellek
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
}));
```

Bu rehber, React Query entegrasyonuyla ilgili soruları cevaplayacak ve ekip genelinde tutarlı bir yaklaşım sağlayacaktır.
