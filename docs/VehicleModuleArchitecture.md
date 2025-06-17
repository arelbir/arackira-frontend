# Araç Modülü Mimarisi ve Dokümantasyonu

## 1. Genel Mimari Yapısı

Araç modülü, modern ve ölçeklenebilir bir React/TypeScript mimarisi üzerine kurulmuştur. Ana yapı şu bileşenlerden oluşmaktadır:

```
features/vehicle/
├── common/               # Ortak UI bileşenleri
│   ├── BaseTabPanel.tsx  # Tab içeriği için standart panel
│   ├── FormController.tsx # Form alanları için standart controller
│   ├── FormFieldGroup.tsx # Form alanlarını gruplandırma 
│   └── ErrorBoundary.tsx  # Hata sınırları
├── context/
│   └── VehicleContext.tsx # Araç state yönetimi
├── registry/
│   └── VehicleTabsRegistry.tsx # Tab tanımları ve yönlendirme kuralları
├── schemas/
│   └── vehicleSchema.ts   # Form validasyon şemaları
├── tabs/                  # Tab bileşenleri
│   ├── VehicleBasicInfoTab.tsx
│   ├── VehicleDetailsTab.tsx
│   ├── VehicleInsuranceTab.tsx
│   └── ...
├── VehicleCreatePage.tsx  # Ana sayfa bileşeni
└── VehicleCreateTabs.tsx  # Tab yönetim bileşeni
```

## 2. Temel Mimari Prensipleri

### 2.1. Tab-Bazlı Dinamik Mimari

Araç modülü, sekme (tab) bazlı bir kullanıcı arayüzü sunar. Her sekme ayrı bir içerik ve işlevsellik barındırır:

- **Merkezi Tab Kayıt Sistemi**: `VehicleTabsRegistry.tsx` tüm tabları, özelliklerini ve yükleme koşullarını tanımlar
- **Dinamik Bileşen Yükleme**: Tab bileşenleri lazy-loading ile ihtiyaç duyulduğunda yüklenir
- **Koşullu Navigasyon**: Tablar arasındaki geçişler, form değerlerinin durumuna göre kontrol edilir

### 2.2. Form Yönetim Mimarisi

Form yönetimi, standardize edilmiş bileşenlerle gerçekleştirilir:

- **FormController**: Form alanlarını standartlaştıran wrapper bileşen
- **BaseTabPanel**: Her tab için standart header ve layout sağlar
- **FormFieldGroup**: Form alanlarını mantıklı gruplar halinde organize eder

## 3. Bileşen Yapısı ve Hiyerarşi

```
VehicleCreatePage
└── VehicleContext.Provider
    └── VehicleCreateTabs
        ├── TabsTrigger (Navigation)
        └── TabsContent
            └── TabComponent (Lazy loaded)
                └── BaseTabPanel
                    └── FormFieldGroup
                        └── FormController (Form fields)
```

## 4. Tab Sistemi ve Dinamik Yükleme

### 4.1. Tab Tanımları

Tüm tablar, `VehicleTabsRegistry.tsx` içinde merkezi olarak tanımlanır:

```typescript
export const vehicleTabs: TabDefinition[] = [
  { 
    id: "temel-kayit", 
    label: "Temel Kayıt", 
    component: "VehicleBasicInfoTab", 
    priority: 10,
    requiredFields: ["branch_id", "chassis_number", "vehicle_status_id"],
  },
  // Diğer tab tanımları...
];
```

Her tab tanımı şunları içerir:
- **id**: URL ve state için benzersiz kimlik
- **label**: Kullanıcıya gösterilen etiket
- **component**: Yüklenecek bileşenin adı
- **priority**: Görüntüleme sırası
- **requiredFields**: Bu taba geçiş için doldurulması gereken alanlar
- **visible**: Tab görünürlüğü (varsayılan: true)

### 4.2. Dinamik Yükleme Mekanizması

```typescript
export const loadTabComponent = (tabId: string) => {
  const tab = vehicleTabs.find(t => t.id === tabId);
  if (!tab) return null;
  
  return lazy(() => import(`../tabs/${tab.component}`));
};
```

Bu yapı, React.lazy ve dynamic import kullanarak tabları sadece gerektiğinde yükler. Bu sayede uygulama performansı artırılmış olur.

## 5. Form Alanı Standardizasyonu

Her tab, form alanlarını şu standart yapı ile oluşturur:

```tsx
<FormFieldGroup title="Grup Başlığı" columns={3}>
  <FormController
    form={form}
    name="field_name"
    label="Alan Etiketi"
    fieldType="input|select|date"
    placeholder="Açıklayıcı metin"
    options={selectOptions}  // Sadece select için
  />
</FormFieldGroup>
```

## 6. Kod Standartları ve İsimlendirme Kuralları

### 6.1. İsimlendirme Kuralları

- **Tab Bileşenleri**: `Vehicle[TabAdı]Tab.tsx` formatında (örn. VehicleBasicInfoTab.tsx)
- **Tab ID'leri**: Kebab-case formatında (örn. "temel-kayit", "arac-detaylari")
- **Form Alanları**: Snake_case formatında (DB yapısına uyumlu) (örn. "chassis_number", "vehicle_status_id")
- **Prop Tipleri**: [BileşenAdı]Props formatında (örn. VehicleBasicInfoTabProps)

### 6.2. Tab Bileşen Yapısı

Her tab bileşeni şu yapıya uymalıdır:

```typescript
interface [TabAdı]TabProps {
  form: UseFormReturn<VehicleFormValues>;
}

const [TabAdı]Tab: React.FC<[TabAdı]TabProps> = ({ form }) => {
  // Hook ve state tanımlamaları
  
  return (
    <BaseTabPanel 
      form={form} 
      title="Tab Başlığı" 
      breadcrumb={["Araç", "Tab Adı"]} 
    >
      {/* Form alanları */}
      <FormFieldGroup title="Grup 1">
        {/* Form controller'lar */}
      </FormFieldGroup>
      
      <FormFieldGroup title="Grup 2">
        {/* Form controller'lar */}
      </FormFieldGroup>
    </BaseTabPanel>
  );
};

export default [TabAdı]Tab;
```

## 7. Refactoring Önerileri

Mevcut durumda şu iyileştirmeler yapılmalıdır:

1. **Kullanılmayan Bileşenlerin Temizlenmesi**: 
   - VehicleGeneralInfoTab.tsx gibi kullanılmayan dosyaları silin

2. **Tab İsimlerinde Tutarlılık**:
   - Tab bileşen adları, tab id'leri ile tutarlı olmalı
   - Örnek: "temel-kayit" id'sine sahip tab için VehicleBasicInfoTab yerine VehicleBasicRegistrationTab gibi daha tutarlı bir isim

3. **Form Alan Tipleri İçin TypeScript Geliştirmeleri**:
   - VehicleFormValues tipinde tüm alan isimleri net bir şekilde tanımlanmalı
   - Form alan adları için string literallerden kaçının, keyof VehicleFormValues tipini kullanın

4. **Belgeleme**:
   - Her tab bileşeni için JSDoc ile açıklamalar ekleyin

## 8. Tab Yapısı ve Sorumlulukları

### 8.1. Mevcut Tablar

| Tab ID | Bileşen Adı | Sorumluluk |
|--------|-------------|------------|
| temel-kayit | VehicleBasicInfoTab | Araç temel kayıt bilgileri (Ruhsat Sahibi Firma, şasi no, durum vb.) |
| arac-detaylari | VehicleDetailsTab | Araç teknik özellikleri, marka/model bilgileri |
| belge-bilgileri | VehicleDocumentsTab | Araç belge bilgileri |
| sigorta-kasko | VehicleInsuranceTab | Sigorta ve kasko bilgileri |
| lastik | VehicleTiresTab | Lastik bilgileri (geliştirme aşamasında) |
| bakim-masraf | VehicleMaintenanceTab | Bakım ve masraf bilgileri (geliştirme aşamasında) |
| hgs-ceza | VehicleHgsFineTab | HGS ve ceza bilgileri (geliştirme aşamasında) |
| arac-kullanim | VehicleUsageTab | Araç kullanım bilgileri (geliştirme aşamasında) |

## 9. İleriye Dönük Gelişim

1. **Unit ve Integration Testleri**: 
   - Her tab bileşeni için temel işlevselliği test eden birim testler ekleyin
   - Tab geçişleri için integration testleri geliştirin

2. **Performance Optimizasyonları**:
   - Büyük form alanlarında React.memo kullanımı
   - Form hook'larının optimizasyonu (shouldValidate, shouldTouch ayarları)

3. **Geliştirme Aşamasındaki Tablar**:
   - visible:false olarak işaretlenmiş tablar için geliştirme önceliklerini belirleyin
   - Her bir tab için gereksinim analizi yapın

---

Bu dokümantasyon, araç modülünün mevcut durumunu, mimarisini ve gelecekteki gelişim yönünü özetlemektedir. Projenin büyümesi ve değişimleriyle birlikte bu dokümanın da güncel tutulması gerekmektedir.
