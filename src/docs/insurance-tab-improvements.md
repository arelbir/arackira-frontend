# InsuranceTab Geliştirme Planı (DRY Prensibi)

Bu doküman `InsuranceTab.tsx` bileşenini DRY (Don't Repeat Yourself) prensibine göre yeniden düzenlemek için bir yol haritası sunmaktadır.

## Mevcut Sorunlar

1. Lookup verilerinin tekrarlı çekilmesi ve dönüştürülmesi
2. Tarih işlemleri için tekrarlanan kod blokları
3. Veri işlemelerinde tekrarlanan yapılar (handleSave, handleAddNew, handleRenew, vb.)
4. Drawer kullanımında tekrarlanan mantık
5. UI elemanlarında tekrarlanan yapılar

## Mevcut Proje Yapısı Analizi

Projede var olan ve kullanabileceğimiz kaynaklar:

### Utility Fonksiyonlar
- `src/lib/utils.ts`: Temel yardımcı fonksiyonlar
  - `formatDateTR`: Tarihleri Türkçe formatında gösterir
  - `safeAccess`: Nesne içinde güvenli erişim sağlar
- `src/lib/format.ts`: Formatlama fonksiyonları
  - `formatDate`: Genel tarih formatlama

### Hooks
- `src/hooks/use-data-table.ts`: Tablo yönetimi için hook
- `src/hooks/use-table.ts`: Tablo işlemleri için temel hook
- `src/hooks/useBulkActions.ts`: Toplu işlem hooklari

## İyileştirme Planı

### 1. Lookup Verilerini Merkezi Bir Hook'a Taşıma

```typescript
// src/features/vehicle/hooks/useLookupData.ts
export function useLookupData() {
  const { data: insuranceTypes } = useSWR("/api/insurance-types", apiFetcher);
  const { data: insuranceCompanies } = useSWR("/api/insurance-companies", apiFetcher);
  // ... diğer lookup verileri
  
  const formatOptions = (data: any[] = []) => 
    data.map((x: any) => ({ value: String(x.id), label: x.name || x.code || x.title }));
    
  return {
    insuranceTypes: formatOptions(insuranceTypes),
    insuranceCompanies: formatOptions(insuranceCompanies),
    // ... diğer lookuplar
  };
}
```

### 2. Tarih İşlemleri İçin Ortak Modül

Projedeki `utils.ts` içinde zaten `formatDateTR` fonksiyonu var, ancak ek işlevsellikler eklemeliyiz:

```typescript
// src/lib/date-utils.ts
export function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function getNewDate(date: string, months: number) {
  if (!date) return "";
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate.toISOString().split('T')[0];
}
```

### 3. Form İşlemleri İçin Custom Hook

```typescript
// src/features/vehicle/hooks/useInsuranceFormHandler.ts
export function useInsuranceFormHandler(form: any) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { fields, append, remove, update } = useFieldArray({ control: form.control, name: "insurances" });
  
  // Form işlemleri
  const handleAddNew = () => {
    // AddNew mantığı
  };
  
  const handleEdit = (index: number) => {
    // Edit mantığı
  };
  
  const handleRenew = (index: number) => {
    // Renew mantığı
  };
  
  const handleDelete = (index: number) => {
    // Delete mantığı
  };
  
  const handleSave = () => {
    // Save mantığı
  };
  
  return {
    isDrawerOpen,
    setIsDrawerOpen,
    editingIndex,
    fields,
    handleAddNew,
    handleEdit,
    handleRenew,
    handleDelete,
    handleSave
  };
}
```

### 4. Drawer State Yönetimi İçin Hook

```typescript
// src/hooks/useDrawerState.ts
export function useDrawerState() {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<any>(null);
  
  const openDrawer = (ctx?: any) => {
    setContext(ctx);
    setIsOpen(true);
  };
  
  const closeDrawer = () => {
    setIsOpen(false);
    setContext(null);
  };
  
  return {
    isOpen,
    context,
    openDrawer,
    closeDrawer
  };
}
```

### 5. Yeniden Kullanılabilir UI Bileşenleri

```typescript
// src/components/ui/shared/empty-state.tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
      {icon}
      <div className="text-lg font-medium mb-1">{title}</div>
      <div className="text-sm">{description}</div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
```

## İyileştirilmiş InsuranceTab.tsx Taslağı

```typescript
import { EmptyState } from "@/components/ui/shared/empty-state";
import { getCurrentDate, getNewDate } from "@/lib/date-utils";
import { useLookupData } from "../hooks/useLookupData";
import { useInsuranceFormHandler } from "../hooks/useInsuranceFormHandler";
import { useDrawerState } from "@/hooks/useDrawerState";

export function InsuranceTab() {
  const { form, vehicleId } = useVehicleForm();
  const lookups = useLookupData();
  const drawer = useDrawerState();
  const { 
    fields, 
    handleAddNew, 
    handleEdit, 
    handleDelete, 
    handleRenew, 
    handleSave 
  } = useInsuranceFormHandler(form, drawer);
  
  if (!vehicleId) {
    return (
      <CreateTabContent value="insurance">
        <EmptyState 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="size-12 mb-4 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C7 4 2 6 2 11v5a2 2 0 002 2h16a2 2 0 002-2v-5c0-5-5-7-10-9zm0 0v2m0 0c2.5 1 5 2 5 7v5" /></svg>}
          title="Sigorta kaydı eklemek için önce taslak araç oluşturmalısınız."
          description="'Taslak Kaydet' butonunu kullanarak önce aracı kaydedin."
        />
      </CreateTabContent>
    );
  }

  return (
    <CreateTabContent value="insurance">
      {/* Header ve içerik */}
      
      {fields.length === 0 ? (
        <EmptyState 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="size-12 mb-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C7 4 2 6 2 11v5a2 2 0 002 2h16a2 2 0 002-2v-5c0-5-5-7-10-9zm0 0v2m0 0c2.5 1 5 2 5 7v5" /></svg>}
          title="Henüz sigorta kaydı yok"
          description="Yeni bir sigorta eklemek için yukarıdaki butonu kullanın."
        />
      ) : (
        /* Tablo içeriği */
      )}
      
      {/* Drawer içeriği */}
    </CreateTabContent>
  );
}
```

## İlerleme Adımları

1. Öncelikle tarih yardımcı fonksiyonlarını `lib/date-utils.ts` dosyasına taşı
2. `useLookupData` hookunu oluşturup SWR çağrılarını buraya taşı
3. EmptyState bileşenini oluşturup tekrarlanan UI elemanlarını değiştir
4. useDrawerState ile drawer yönetimini basitleştir
5. useInsuranceFormHandler hookunu oluşturup fonksiyonları buraya taşı
6. InsuranceTab bileşenini yeni hookları kullanacak şekilde yeniden düzenle

Bu değişiklikler kod tekrarını azaltacak, test edilebilirliği artıracak ve gelecekte yeni özellikler eklerken daha az değişiklik gerektiren bir yapı sağlayacaktır.
