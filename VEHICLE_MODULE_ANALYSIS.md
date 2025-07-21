# Araç Modülü Detaylı Analizi ve İyileştirme Raporu

## 1. Genel Bakış (Executive Summary)

Bu rapor, `arackira-frontend` projesindeki `features/vehicle` modülünün derinlemesine analizini içermektedir. Modül, `React Hook Form`, `Zod` ve `Context API` gibi modern ve güçlü araçları kullanarak iyi bir temel üzerine inşa edilmiştir. Ancak, zamanla artan iş mantığı ve karmaşık veri yapıları nedeniyle modülün bakımı zorlaşmış ve mimari olarak bazı zayıflıklar ortaya çıkmıştır.

**Güçlü Yönler:**
- **Modern Araç Seti:** `React Hook Form` ve `Zod` kullanımı, form yönetimi ve validasyon için en iyi pratikleri yansıtmaktadır.
- **Özellik Odaklı Yapı:** Modülün `hooks`, `components`, `services` gibi klasörlere ayrılması, kodun mantıksal olarak gruplanmasını sağlamıştır.
- **State Yönetimi Yaklaşımı:** Karmaşık bir form için `Context API` kullanma kararı doğrudur.

**Ana Sorun Alanları:**
- **Kırılgan Veri Katmanı:** Frontend ve backend arasındaki veri senkronizasyonu, manuel ve hataya açık yöntemlerle sağlanmaktadır.
- **Aşırı Sorumluluk Yüklenmiş Bileşenler:** Özellikle `VehicleCreateProvider`, birden çok sorumluluğu üstlenerek bir "God Object" haline gelmiştir.
- **Tutarsız ve Eksik Tip Güvenliği:** Zod'un sağladığı tip güvenliğinden tam olarak faydalanılmamaktadır.

Bu rapor, bu sorunların kök nedenlerini analiz edecek ve modülü daha **sağlam, sürdürülebilir ve geliştirici dostu** hale getirmek için somut bir yol haritası sunacaktır.

---

## 3. Adım Adım İyileştirme Planı

### Adım 1 (Uygulandı): Zod Şemalarını Modüler ve Sürdürülebilir Bir Yapıda Kurun

**Problem:** Tek bir dosyada tutulan devasa bir şema, zamanla yönetilmesi zor bir hale gelir.

**Çözüm:** Zod şemalarımızı, sorumluluklarına göre mantıksal dosyalara ayırdık. Bu amaçla `src/features/vehicle/` altında `schemas` adında yeni bir klasör oluşturduk. Bu yapı, projenin büyümesine paralel olarak kolayca genişletilebilir olacaktır.

**Uygulanan Dosya Yapısı:**

```
src/
└── features/
    └── vehicle/
        ├── schemas/
        │   ├── common.schemas.ts      # (Yardımcı ve genel amaçlı şemalar)
        │   ├── included.schemas.ts    # (İlişkisel veri şemaları: Sigorta, Muayene vb.)
        │   ├── vehicle.schemas.ts     # (Ana araç şemaları ve senaryoları)
        │   └── index.ts               # (Tüm şemaları ve tipleri tek noktadan ihraç etmek için)
        └── ... (diğer klasörler)
```

Bu modüler yapı, planın en kritik ve en değerli adımıdır. Bu sağlam temel üzerine diğer tüm iyileştirmeleri inşa etmek çok daha kolay olacaktır.

### Adım 2: Provider ve Hook'ları Sorumluluklarına Ayırın (Refactoring)

**Problem:** `VehicleCreateProvider`, form state'i, veri çekme (data fetching), veri gönderme (mutation) ve bildirim gösterme gibi birbiriyle alakasız birçok sorumluluğu üstlenmiştir. Bu durum, bileşeni karmaşık, test edilmesi zor ve kırılgan hale getirir.

**Çözüm:** "Single Responsibility Principle" (Tek Sorumluluk Prensibi) ilkesini benimseyerek, Provider'ı ve ilişkili hook'ları yeniden yapılandıracağız. Her parça, sadece kendi işine odaklanacak.

**Önerilen Yeni Mimari:**

1.  **`VehicleFormProvider.tsx` (Basit Form Sağlayıcı):**
    - **Tek Sorumluluğu:** `React Hook Form`'dan dönen `form` nesnesini oluşturmak ve bunu `Context` aracılığıyla alt bileşenlere (form tab'larına) sağlamak.
    - **İçermeyeceği Şeyler:** API çağrıları, state güncellemeleri (form dışında), `useEffect` ile veri çekme.

    ```typescript
    // Örnek: src/features/vehicle/create/context/VehicleFormProvider.tsx
    'use client';
    import { useForm, FormProvider } from 'react-hook-form';
    import { zodResolver } from '@hookform/resolvers/zod';
    import { vehicleFormValidationSchema, VehicleFormValues } from '../../schemas';

    export const VehicleFormProvider = ({ children, defaultValues }) => {
      const form = useForm<VehicleFormValues>({
        resolver: zodResolver(vehicleFormValidationSchema),
        defaultValues,
      });

      return <FormProvider {...form}>{children}</FormProvider>;
    };
    ```

2.  **`useVehicleQuery.ts` (Veri Çekme Hook'u):**
    - **Tek Sorumluluğu:** Belirli bir `vehicleId` için araç verilerini API'den çekmek.
    - `SWR` veya `React Query` gibi modern bir data-fetching kütüphanesi kullanmalıdır.
    - Gelen veriyi `vehicleApiResponseSchema` ile parse ederek tip güvenliği sağlar.

    ```typescript
    // Örnek: src/features/vehicle/hooks/useVehicleQuery.ts
    import useSWR from 'swr';
    import { fetcher } from '@/lib/fetcher'; // Projenizdeki fetcher
    import { vehicleApiResponseSchema } from '../schemas';

    export const useVehicleQuery = (vehicleId: number) => {
      const { data, error, isLoading } = useSWR(`/api/vehicles/${vehicleId}/complete`, fetcher);

      const parsedData = data ? vehicleApiResponseSchema.safeParse(data) : null;

      return {
        vehicleData: parsedData?.success ? parsedData.data : null,
        error,
        isLoading,
      };
    };
    ```

3.  **`useVehicleMutation.ts` (Veri Güncelleme/Oluşturma Hook'u):**
    - **Tek Sorumluluğu:** Yeni araç oluşturma (`create`) ve mevcut aracı güncelleme (`update`) işlemlerini yönetmek.
    - API isteklerini yapar, `loading` ve `error` durumlarını yönetir.
    - İşlem sonunda `sonner` ile başarı veya hata bildirimi gösterir.

    ```typescript
    // Örnek: src/features/vehicle/hooks/useVehicleMutation.ts
    import { toast } from 'sonner';
    import { api } from '@/lib/api'; // Projenizdeki api istemcisi

    export const useVehicleMutation = () => {
      const createVehicle = async (data) => {
        toast.promise(api.post('/api/vehicles', data), {
          loading: 'Araç oluşturuluyor...',
          success: 'Araç başarıyla oluşturuldu!',
          error: 'Bir hata oluştu.',
        });
      };

      // updateVehicle fonksiyonu da benzer şekilde burada yer alır.

      return { createVehicle, /* updateVehicle */ };
    };
    ```

Bu yapı, kodun daha okunabilir, test edilebilir ve sürdürülebilir olmasını sağlayacaktır. Bir sonraki adımda bu yeni yapıyı kodumuza uygulayacağız.

---

## 2. Detaylı Analiz ve Tespit Edilen Sorunlar

### Sorun 1: Kırılgan ve Karmaşık Veri Dönüşüm Katmanı

- **Tespit:** `utils/data-transformers.ts` dosyası, API'den gelen veriyi forma, formdan giden veriyi API'ye dönüştürmek için 450 satırdan fazla kod içermektedir. Bu katman, her bir alt modül (sigorta, muayene vb.) için ayrı `interface` tanımları, manuel alan eşleştirme konfigürasyonları ve dönüşüm fonksiyonları barındırır.
- **Kök Neden:** Frontend ve backend veri modelleri arasında ciddi bir uyumsuzluk (impedance mismatch) bulunmaktadır. Bu uyumsuzluk, kod seviyesinde karmaşık ve manuel dönüşümlerle çözülmeye çalışılmıştır. Zod şemaları, bu dönüşümleri yönetmek yerine sadece validasyon için kullanılmıştır.
- **Etkisi:**
  - **Yüksek Bakım Maliyeti:** Backend'de bir alan değiştiğinde, bu dosyada birden çok yerde (interface, mapping config) değişiklik yapmak gerekir. Bu, unutulmaya ve hataya çok açıktır.
  - **Düşük Okunabilirlik:** Bir verinin forma nasıl geldiğini veya API'ye nasıl gittiğini anlamak için birden çok fonksiyon ve konfigürasyonun takip edilmesi gerekir.
  - **Gizli Hatalar (Silent Bugs):** Eşleştirme unutulduğunda, veri sessizce kaybolur ve hata vermez.

### Sorun 2: "God Object" Provider (`VehicleCreateProvider`)

- **Tespit:** `VehicleCreateProvider.tsx` dosyası, tek başına state yönetimi, form başlatma, veri çekme (`useVehicleEdit`), taslak yönetimi (`useDraftManagement`), veri dönüşümü, API'ye gönderme ve bildirim gösterme gibi çok sayıda sorumluluğu üstlenmiştir.
- **Kök Neden:** İlgili tüm iş mantığı, kolaylık sağlaması amacıyla tek bir merkezi yerde toplanmıştır. Ancak bu, Single Responsibility Principle (Tek Sorumluluk Prensibi) ihlaline yol açmıştır.
- **Etkisi:**
  - **Test Edilebilirlik:** Bu devasa bileşeni izole bir şekilde test etmek neredeyse imkansızdır.
  - **Anlaşılabilirlik:** Bir geliştiricinin, sadece bir alanı güncelleme mantığını anlamak için bile yüzlerce satırlık kodu okuması gerekir.
  - **Yeniden Kullanılabilirlik:** İçindeki mantık parçalarının (örn: taslak yönetimi) başka yerlerde kullanılması mümkün değildir.

### Sorun 3: Zayıf ve Tutarsız Tip Güvenliği

- **Tespit:**
  1. Ana `vehicle/types.ts` dosyasındaki `VehicleSchema`, API'den gelen gerçek yanıta göre çok eksiktir ve `passthrough()` metodu ile tanımlanmıştır. Bu, Zod'un tip güvenliğini etkisiz kılar.
  2. `data-transformers.ts` içinde `ApiInsurance`, `TransformedInsurance` gibi manuel `interface`'ler tanımlanmıştır. Bu, proje içinde birden fazla "doğruluk kaynağı" yaratır.
  3. Kodun çeşitli yerlerinde `any` tipi kullanılmıştır.
- **Kök Neden:** Projenin farklı aşamalarında veya farklı geliştiriciler tarafından farklı tip tanımlama yaklaşımları benimsenmiş olabilir. Zod'un `transform` ve `preprocess` gibi güçlü özellikleri yeterince kullanılmamıştır.
- **Etkisi:**
  - **Beklenmedik `undefined` Hataları:** `passthrough()` nedeniyle, `vehicle.olmayan_bir_alan` gibi bir erişim derleme zamanında hata vermez ama çalışma zamanında `undefined` döner.
  - **Veri Tutarsızlığı:** Manuel interface'ler Zod şemalarıyla senkronize olmadığında, kodun farklı bölümleri veriyi farklı şekillerde yorumlayabilir.

---

## 3. Önerilen Çözüm ve Yol Haritası

Bu bölümde, yukarıdaki sorunları çözmek için 4 adımlık bir yol haritası sunulmuştur.

### Adım 1: Zod'u Tek Doğruluk Kaynağı Olarak Konumlandırın

Bu adımın amacı, `data-transformers.ts` dosyasını ve manuel `interface`'leri tamamen ortadan kaldırmaktır.

1.  **Oluşturun:** `features/vehicle/schemas/vehicle.schema.ts` adında yeni bir dosya oluşturun.
2.  **Birleştirin:** `types.ts` ve `create-tabs/schema.ts` içindeki tüm Zod şemalarını bu yeni dosyaya taşıyın ve tek, kapsamlı bir `vehicleSchema` oluşturun. Bu şema, sigorta, muayene gibi tüm alt modülleri içermelidir.
3.  **Dönüştürün:** Manuel veri dönüşümlerini Zod'un içine taşıyın.
    -   Boş string'i `null` yapma -> `z.preprocess((val) => val === '' ? null : val, ...)`
    -   String ID'yi `number` yapma -> `z.preprocess((val) => Number(val) || undefined, z.number())`
    -   Tarih formatlama -> `z.transform((val) => formatDateForAPI(val))`
4.  **Güvenliği Artırın:** `passthrough()` metodunu kaldırın ve yerine `strict()` kullanarak bilinmeyen alanların hata fırlatmasını sağlayın.

**Sonuç:** Artık veri yapısı, validasyon ve dönüşüm mantığı tek bir dosyada, tanımlandığı yerde durmaktadır.

### Adım 2: Provider'ı Sadeleştirin ve Sorumlulukları Ayırın

Bu adımın amacı, `VehicleCreateProvider`'ı sadece `react-hook-form`'u sağlayan basit bir bileşene dönüştürmektir.

1.  **Sadeleştirin:** `VehicleCreateProvider` içindeki tüm veri çekme, taslak yönetimi ve submit mantığını silin. Provider sadece `FormProvider`'ı sarmalamalıdır.
2.  **Ayrıştırın:** Sildiğiniz mantıkları kendi özel hook'larına taşıyın:
    -   `useVehicleQuery(vehicleId)`: Veri çekme ve `vehicleSchema.parse()` ile forma uygun hale getirme sorumluluğunu üstlenir.
    -   `useVehicleSubmit()`: Formdan gelen veriyi API'ye gönderme sorumluluğunu üstlenir.
    -   `useDraftManagement()`: Mevcut haliyle kalabilir, sadece `VehicleCreateProvider` içinden çağrılmak yerine formun olduğu ana bileşenden çağrılır.

### Adım 3: Yeni Mimaride Veri Akışını Kurun

1.  **Ana Form Bileşeni (`VehicleCreatePage.tsx` gibi):**
    -   `useForm` hook'unu burada çağırın.
    -   `VehicleCreateProvider` ile formu sarmalayın.
    -   `useVehicleQuery`'yi çağırarak veriyi çekin ve `form.reset(data)` ile formu doldurun.
    -   `useVehicleSubmit`'i çağırın ve formun `onSubmit` olayına bağlayın.

**Örnek Veri Akışı:**
1.  `useVehicleQuery`, API'den ham veriyi alır.
2.  `vehicleSchema.parse(apiData)` çağrılır. Zod, veriyi hem doğrular hem de `preprocess/transform` ile formun beklediği şekle (örn: tarih formatları) dönüştürür.
3.  Dönen temiz veri `form.reset()` ile forma basılır.
4.  Kullanıcı formu gönderdiğinde, `useVehicleSubmit` form verisini alır ve API'ye gönderir. Backend, ihtiyacı olan alanları seçmekle sorumludur.

### Adım 4: Dosya Yapısını Son Kez Temizleyin

1.  `utils/data-transformers.ts` dosyasını silin.
2.  `types.ts` dosyasını silin (tüm tipler artık `schemas` klasöründe Zod'dan `infer` edilecek).
3.  `create-tabs/context` klasörünü ve içindeki provider'ı yeni, sadeleştirilmiş haliyle `features/vehicle/context` altına taşıyabilirsiniz.

---

## 4. Sonuç

Bu değişiklikler, başlangıçta bir miktar yeniden yapılandırma (refactoring) çabası gerektirse de, uzun vadede şu faydaları sağlayacaktır:

- **Dayanıklılık (Robustness):** Manuel ve hataya açık kodlar ortadan kalkacak, sistem daha öngörülebilir çalışacaktır.
- **Bakım Kolaylığı (Maintainability):** Bir değişiklik gerektiğinde, sadece tek bir merkezi şema dosyasını güncellemek yeterli olacaktır.
- **Geliştirici Deneyimi (Developer Experience):** Kodun anlaşılması, test edilmesi ve yeni özellikler eklenmesi çok daha kolay hale gelecektir.

Bu yol haritası, `vehicle` modülünü projenin en sağlam ve en iyi yapılandırılmış parçalarından biri haline getirme potansiyeline sahiptir.
