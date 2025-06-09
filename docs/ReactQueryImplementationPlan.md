# React Query Implementasyon Planı

## Proje Bilgileri

**Teknoloji Stack:**
- Framework: Next.js 15
- Language: TypeScript
- Styling: Tailwind CSS v4
- Components: Shadcn-ui
- Schema Validations: Zod
- State Management: Zustand
- Search params state manager: Nuqs
- Tables: TanStack Data Tables
- Forms: React Hook Form
- Command+k interface: kbar

## Genel Bakış

Bu plan, modern Next.js 15 uygulamanızda bağımlı veri fetching işlemlerini optimize etmek için React Query (TanStack Query) entegrasyonunu detaylandırmaktadır. TanStack ailesinden Data Tables halihazırda kullandığınız için, React Query entegrasyonu doğal bir adım olacaktır.

## Implementasyon Hedefleri

- Dependent select fields için yükleme durumlarının doğru yönetimi
- Form veri akışlarında optimizasyon ve gereksiz render'ların önlenmesi
- Shadcn-UI bileşenleriyle (Skeleton, Spinner) tutarlı loading durumları
- Veri önbelleğe alma ve stale-while-revalidate stratejisi
- TypeScript ile uçtan uca tip güvenliği
- Next.js 15 App Router ile SSR entegrasyonu

## Dokümantasyon Yapısı

Bu plan üç bölümden oluşmaktadır:

1. [Temel Yapılandırma ve Altyapı](./ReactQueryImplementationPlan-Part1.md) - Kurulum, provider yapılandırması ve temel hook'lar
2. [Form Entegrasyonu ve Bileşenler](./ReactQueryImplementationPlan-Part2.md) - Form bileşenleri, loading states ve örnek implementasyonlar
3. [İleri Düzey Özellikler ve Uygulama Stratejisi](./ReactQueryImplementationPlan-Part3.md) - Optimizasyonlar, SSR, zustand entegrasyonu ve uygulama planı (1 saat)

## 1. React Query Kurulumu ve Yapılandırması (1 saat)

**Paket kurulumu:**

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

**React Query Provider oluşturma:**

```tsx
// src/providers/ReactQueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 dakika
      refetchOnWindowFocus: false
    }
  }
});

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## 2. Uygulama Entegrasyonu (30 dakika)

Next.js uygulaması içine React Query Provider'ı ekleyin:

```tsx
// src/app/providers.tsx (veya benzeri bir dosya)
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      {/* Diğer sağlayıcılar */}
      {children}
    </ReactQueryProvider>
  );
}
```

## 3. FormController Güncellemesi (1 saat)

Mevcut FormController bileşenini yükleme durumu desteği ekleyerek güncelleyin:

```tsx
// src/features/vehicle/common/FormController.tsx
import { Spinner } from "@/components/ui/spinner";

interface FormControllerProps {
  // Mevcut props
  isLoading?: boolean; // Yeni prop
}

export const FormController = ({
  // Mevcut props
  isLoading = false,
  ...rest
}: FormControllerProps) => {
  // Mevcut kod

  // Select elementi için yükleme durumu gösterimi
  if (fieldType === "select") {
    return (
      <div className="relative">
        <FormSelectField
          {...commonProps}
          options={options}
          placeholder={isLoading ? "Yükleniyor..." : placeholder}
          disabled={disabled || isLoading}
        />
        {isLoading && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <Spinner size="sm" />
          </div>
        )}
      </div>
    );
  }
  
  // Diğer durumlar için mevcut kod
};
```

## 4. Veri Çekme Hook'larının Oluşturulması (2 saat)

Genel bir React Query wrapper hook'u:

```tsx
// src/hooks/api/useQuery.ts
import { useQuery as useReactQuery } from '@tanstack/react-query';

export function useQuery(key, fetchFn, options = {}) {
  return useReactQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: fetchFn,
    ...options
  });
}
```

Model veri çekme hook'unu güncelleme:

```tsx
// src/features/definitions/models/useModelsByBrand.ts
import { useQuery } from '@/hooks/api/useQuery';
import { getModelsByBrand } from './modelService';

export function useModelsByBrand(brandId: number | null) {
  return useQuery(
    ['models', brandId], 
    () => brandId ? getModelsByBrand(brandId) : [],
    {
      enabled: !!brandId,
      staleTime: 1000 * 60 * 15 // 15 dakika
    }
  );
}
```

## 5. VehicleDetailsTab - İlk Entegrasyon (1.5 saat)

```tsx
// src/features/vehicle/tabs/VehicleDetailsTab.tsx
// ...mevcut importlar
import { Skeleton } from '@/components/ui/skeleton';

const VehicleDetailsTab = ({ form }) => {
  const selectedBrandId = Number(form.watch("brand_id")) || null;
  
  // React Query ile model verilerini çekme
  const { data: models = [], isLoading: loadingModels } = useModelsByBrand(selectedBrandId);
  const modelOptions = models.map(m => ({ label: m.name, value: m.id }));

  return (
    <BaseTabPanel form={form} title="Araç Detayları" breadcrumb={["Araç", "Araç Detayları"]} columns={3}>
      <FormFieldGroup title="Temel Bilgiler">
        {/* Brand (Marka) seçimi */}
        <FormController
          form={form}
          name="brand_id"
          label="Marka"
          fieldType="select"
          options={brandOptions}
          disabled={loadingBrands}
        />
        
        {/* Model seçimi - Artık yükleme durumunu gösterecek */}
        <FormController
          form={form}
          name="model_id"
          label="Model"
          fieldType="select"
          options={modelOptions}
          disabled={!selectedBrandId}
          isLoading={loadingModels}
          placeholder={loadingModels && selectedBrandId ? "Modeller yükleniyor..." : "Model seçin"}
        />
        
        {/* ... diğer form alanları */}
      </FormFieldGroup>
    </BaseTabPanel>
  );
};
```

## 6. Diğer Bağımlı Select Bileşenlerinin Güncellenmesi (2 saat)

Tüm bağımlı veri çekme işlemleri için benzer React Query hook'ları oluşturup uygulanmalı:
- Paket seçimleri (model seçimine bağlı)
- Şehir-ilçe seçimleri
- Tüm diğer hiyerarşik veya bağımlı veri gerektiren form seçenekleri

## 7. Zustand ile Entegrasyon - Önbelleğe Alma Stratejisi (1.5 saat)

React Query ve mevcut Zustand yapısını birlikte verimli kullanmak için bir wrapper hook oluşturabilirsiniz:

```tsx
// src/hooks/api/useCachedQuery.ts
import { useQuery } from '@/hooks/api/useQuery';
import { useApiCache } from '@/store/apiCache'; // Zustand store

export function useCachedQuery(key, fetchFn, options = {}) {
  const { getCache, setCache } = useApiCache();
  const cachedData = getCache(key);
  
  // Cache'te veri varsa, initialData olarak kullan
  return useQuery(key, fetchFn, {
    ...options,
    initialData: cachedData,
    onSuccess: (data) => {
      setCache(key, data);
      if (options.onSuccess) options.onSuccess(data);
    }
  });
}
```

## 8. Optimizasyon: İlk Yükleme için Skeleton Kullanımı (1 saat)

```tsx
// src/features/vehicle/tabs/VehicleDetailsTab.tsx
{isInitialLoading ? (
  <div className="space-y-3">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
  </div>
) : (
  <FormFieldGroup title="Temel Bilgiler">
    {/* Form alanları */}
  </FormFieldGroup>
)}
```

## Zamanlama ve Öncelikler

- **Toplam Süre**: Yaklaşık 10 saat
- **Kritik Yol**:
  1. React Query kurulumu ve temel altyapı (1.5 saat)
  2. FormController ve FormSelectField güncellemesi (1 saat) 
  3. VehicleDetailsTab entegrasyonu (1.5 saat)

## Beklenen Faydalar

1. Daha iyi kullanıcı deneyimi - bağımlı veri yüklemeleri sırasında tüm form sıfırlanmayacak
2. İyileştirilmiş performans - tekrarlanan API çağrıları önbelleğe alınacak
3. Yükleme durumu göstergeleri - kullanıcılar veri yükleme süreçleri hakkında bilgilendirilecek
4. Tutarlı veri yönetimi - React Query ile durum yönetimi standartlaştırılacak

## Test ve Doğrulama

Her entegrasyon aşamasından sonra, aşağıdaki kontroller yapılmalıdır:

1. Bağımlı form alanlarının doğru yüklenip yüklenmediği
2. Yükleme durumu göstergelerinin düzgün çalışıp çalışmadığı
3. Ön belleğe alma mekanizmasının çalışıp çalışmadığı
4. Sayfa yenilendiğinde durumun korunup korunmadığı

## Sonuç

Bu plan, modern React projelerinde etkin veri yönetimi için endüstri standardı olan React Query'yi uygulamanıza entegre ederek bağımlı veri yükleme sorunlarını çözecek ve kullanıcı deneyimini iyileştirecektir. Ayrıca mevcut shadcn UI bileşenlerini ve form yapılarını koruyarak, tutarlı ve sürdürülebilir bir kod tabanı sağlayacaktır.
