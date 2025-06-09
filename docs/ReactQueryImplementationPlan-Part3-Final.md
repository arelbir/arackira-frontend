# React Query Implementasyon Planı - Bölüm 3: İleri Düzey Özellikler ve Uygulama Stratejisi (Final)

## 7. React Query DevTools ve Debug (1 saat)

```tsx
// src/providers/query-provider.tsx sayfasına ek olarak:

// Sadece development ortamında DevTools ekleyin
const ReactQueryDevToolsProduction = lazy(() =>
  import('@tanstack/react-query-devtools/production').then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

// Kullanım
export function QueryProvider({ children }: { children: ReactNode }) {
  const [showDevtools, setShowDevtools] = useState(false);
  
  useEffect(() => {
    // Alt+D tuş kombinasyonu ile DevTools'u göster/gizle
    window.addEventListener('keydown', (event) => {
      if (event.altKey && event.key === 'd') {
        setShowDevtools((prev) => !prev);
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {showDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevToolsProduction buttonPosition="bottom-left" />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}
```

## 8. Paralel Queries ve Aggregated Results (1.5 saat)

```tsx
// src/hooks/queries/use-parallel-queries.ts
"use client";

import { useQueries } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

export function useParallelQueries<T extends any[]>(
  queries: {
    queryKey: string[];
    queryFn: () => Promise<T[number]>;
    enabled?: boolean;
  }[]
) {
  const results = useQueries({
    queries: queries.map((query) => ({
      queryKey: query.queryKey,
      queryFn: query.queryFn,
      enabled: query.enabled !== false,
      onError: (error: unknown) => {
        toast({
          title: "Veri yükleme hatası",
          description: error instanceof Error ? error.message : "Bilinmeyen hata",
          variant: "destructive",
        });
      },
    })),
  });
  
  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);
  const data = results.map((result) => result.data);
  
  return { results, isLoading, isError, data };
}

// Kullanım örneği
function VehicleTab() {
  const { data, isLoading } = useParallelQueries([
    {
      queryKey: ['brands'],
      queryFn: () => getBrands(),
    },
    {
      queryKey: ['colors'],
      queryFn: () => getColors(),
    },
    {
      queryKey: ['fuelTypes'],
      queryFn: () => getFuelTypes(),
    },
  ]);
  
  const [brands, colors, fuelTypes] = data;
  
  if (isLoading) {
    return <FormSkeleton />;
  }
  
  // UI
}
```

## 9. Uygulama Stratejisi ve Zamanlama

### Aşama 1: Altyapı ve Temel Kurulum (2 gün)

1. React Query ve DevTools kurulumu
2. QueryProvider oluşturma ve Next.js App Router'a entegre etme
3. Tip güvenli API istemcisi oluşturma
4. Temel useQuery ve useMutation hook'larını implemente etme
5. Zod şemaları ve hata yakalama mekanizmalarını oluşturma

### Aşama 2: Form Bileşenlerinin Entegrasyonu (2-3 gün)

1. FormController bileşenini React Query ile uyumlu hale getirme
2. SelectWithStatus, InputWithStatus gibi bileşenleri oluşturma
3. Loading durumlarını doğru şekilde yönetme (Skeleton, Spinner)
4. Form ve React Query arasında veri senkronizasyonunu sağlama
5. Bağımlı seçim kutuları (dependent selects) için özel hook'ları oluşturma

### Aşama 3: Geçiş ve Test (3-4 gün)

1. Mevcut useModelsByBrand gibi hook'ları React Query kullanacak şekilde refactor etme
2. VehicleDetailsTab ve diğer tab'ları yeni sistem ile güncelleme
3. Zustand ile önbellek yönetimi entegrasyonu (gerekiyorsa)
4. Optimistic updates ve error recovery mekanizmalarını ekleme
5. SSR desteğini implemente etme

### Aşama 4: İleri Düzey Özellikler ve Optimizasyon (2 gün)

1. Infinite queries desteği
2. Paralel queries ve veri agregasyonu
3. DevTools entegrasyonu ve debug araçları
4. Performans optimizasyonları ve abort controller entegrasyonu
5. Kullanıcı deneyimini iyileştirme (toast mesajları, hata sınırları, vb.)

### Aşama 5: Belgelendirme ve Eğitim (1 gün)

1. Yeni API ve hook'lar için belgelendirme
2. Örnek kullanım senaryoları
3. Mevcut vs yeni sistem karşılaştırması
4. En iyi uygulama önerileri
5. Sorun giderme kılavuzu

## 10. Test ve Kalite Güvencesi

1. Yeni hook'lar için birim testleri
2. Entegrasyon testleri (React Testing Library)
3. API mocking ve test coverage artışı
4. Edge case'ler ve hata durumları için testler
5. Kullanıcı arayüzü ve erişilebilirlik testleri

## 11. Sonuç ve Beklenen Faydalar

React Query entegrasyonu sayesinde:

1. Form alanlarındaki yükleme durumları daha tutarlı ve kullanıcı dostu olacak
2. Veri önbellekleme sayesinde gereksiz ağ istekleri azalacak
3. Tip güvenliği ve hata yakalama mekanizmaları gelişecek
4. SSR desteği ile ilk yükleme performansı artacak
5. Yeniden kullanılabilir ve bakımı kolay kod tabanı oluşacak
6. Zustand ile entegrasyon sayesinde offline destek eklenebilecek
7. Dependent data fetching performansı artacak
8. Form tab'ları arasında geçiş daha akıcı olacak
9. Skeleton, Spinner gibi UI bileşenleriyle tutarlı bir deneyim sunulacak
10. DevTools ile debug ve izleme yetenekleri gelişecek
