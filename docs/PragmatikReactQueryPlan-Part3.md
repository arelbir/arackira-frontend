# Pragmatik React Query Implementasyon Planı - Bölüm 3

## Aşama 3: Yükleme Durumu İyileştirmeleri ve Form Entegrasyonu (3-4 saat)

### 3.1. SelectWithLoading Bileşeni

```tsx
// src/components/ui/select-with-loading.tsx
"use client";

import { Spinner } from "@/components/ui/spinner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface SelectWithLoadingProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  error?: string;
  isLoading?: boolean;
}

export function SelectWithLoading({
  value,
  onChange,
  placeholder,
  options = [],
  disabled,
  error,
  isLoading,
}: SelectWithLoadingProps) {
  return (
    <div className="relative">
      <Select
        value={value ? String(value) : ""}
        onValueChange={onChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className={error ? "border-destructive" : ""}>
          {isLoading ? (
            <span className="text-muted-foreground">Yükleniyor...</span>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {isLoading && (
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <Spinner size="sm" />
        </div>
      )}
      
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}
```

### 3.2. FormController İyileştirmesi

```tsx
// src/features/vehicle/common/FormController.tsx
import { Controller } from "react-hook-form";
import { SelectWithLoading } from "@/components/ui/select-with-loading";
import { Input } from "@/components/ui/input";
// Diğer importlar...

interface FormControllerProps {
  form: any;
  name: string;
  label: string;
  fieldType: "input" | "select" | "date" | "textarea" | "checkbox" | "file";
  isLoading?: boolean;
  options?: Array<{ label: string; value: string | number }>;
  // Diğer props...
}

export function FormController({ 
  form, 
  name, 
  label, 
  fieldType,
  isLoading = false,
  options = [], 
  ...rest 
}: FormControllerProps) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const { error } = fieldState;
        
        if (fieldType === "select") {
          return (
            <div className="space-y-1">
              <label htmlFor={name} className="text-sm font-medium">
                {label}
              </label>
              <SelectWithLoading
                value={field.value || ""}
                onChange={field.onChange}
                options={options}
                error={error?.message}
                isLoading={isLoading}
                disabled={rest.disabled}
                placeholder={rest.placeholder || `${label} seçin`}
              />
            </div>
          );
        }
        
        // Diğer alan tipleri için mevcut implementasyon...
        
        return null;
      }}
    />
  );
}
```

### 3.3. VehicleDetailsTab Güncellemesi

```tsx
// src/features/vehicle/tabs/VehicleDetailsTab.tsx
"use client";

import { BaseTabPanel } from '../common/BaseTabPanel';
import { FormFieldGroup } from '../common/FormFieldGroup';
import { FormController } from '../common/FormController';
import { useBrands } from '@/features/definitions/brands/use-brands'; // Mevcut hook
import { useModelsByBrand } from '@/features/definitions/models/use-models';
import { usePackagesByModel } from '@/features/definitions/packages/use-packages';
import { Skeleton } from '@/components/ui/skeleton';

interface VehicleDetailsTabProps {
  form: any;
}

export function VehicleDetailsTab({ form }: VehicleDetailsTabProps) {
  // Form değerlerini izle
  const selectedBrandId = Number(form.watch("brand_id")) || null;
  const selectedModelId = Number(form.watch("model_id")) || null;
  
  // React Query hook'larını kullan
  const { data: brands = [], isLoading: loadingBrands } = useBrands();
  const { data: models = [], isLoading: loadingModels } = useModelsByBrand(selectedBrandId);
  const { data: packages = [], isLoading: loadingPackages } = usePackagesByModel(selectedModelId);
  
  // Option formatına çevir
  const brandOptions = brands.map(b => ({ label: b.name, value: b.id }));
  const modelOptions = models.map(m => ({ label: m.name, value: m.id }));
  const packageOptions = packages.map(p => ({ label: p.name, value: p.id }));
  
  return (
    <BaseTabPanel
      form={form}
      title="Araç Detayları"
      breadcrumb={["Araç", "Araç Detayları"]}
      columns={3}
    >
      {loadingBrands ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : (
        <>
          <FormFieldGroup title="Temel Bilgiler">
            <FormController
              form={form}
              name="brand_id"
              label="Marka"
              fieldType="select"
              options={brandOptions}
            />
            
            <FormController
              form={form}
              name="model_id"
              label="Model"
              fieldType="select"
              options={modelOptions}
              disabled={!selectedBrandId}
              isLoading={loadingModels && !!selectedBrandId}
              placeholder={!selectedBrandId ? "Önce marka seçin" : "Model seçin"}
            />
            
            <FormController
              form={form}
              name="package_id"
              label="Paket"
              fieldType="select"
              options={packageOptions}
              disabled={!selectedModelId}
              isLoading={loadingPackages && !!selectedModelId}
              placeholder={!selectedModelId ? "Önce model seçin" : "Paket seçin"}
            />
            
            {/* Diğer form alanları... */}
          </FormFieldGroup>
        </>
      )}
    </BaseTabPanel>
  );
}
```

## Aşama 4: Uygulama ve Test (1-2 saat)

### 4.1. Form Bağımlılık Yönetimi

Brand değiştiğinde modeli sıfırlama ve model değiştiğinde paketi sıfırlama için basit bir hook:

```tsx
// src/hooks/use-form-dependencies.ts
"use client";

import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

export function useFormDependencies<T>(
  form: UseFormReturn<T>,
  dependencies: {
    field: keyof T;
    dependentFields: Array<keyof T>;
  }[]
) {
  const watchedValues = form.watch();
  
  useEffect(() => {
    dependencies.forEach(({ field, dependentFields }) => {
      const currentValue = watchedValues[field];
      
      // Değer değiştiğinde bağımlı alanları sıfırla
      if (currentValue === undefined || currentValue === null || currentValue === "") {
        dependentFields.forEach((depField) => {
          form.setValue(depField, null as any);
        });
      }
    });
  }, [dependencies.map(d => watchedValues[d.field])]);
}

// Kullanım örneği
function VehicleForm() {
  const form = useForm<VehicleFormValues>();
  
  useFormDependencies(form, [
    {
      field: "brand_id",
      dependentFields: ["model_id", "package_id"],
    },
    {
      field: "model_id",
      dependentFields: ["package_id"],
    }
  ]);
  
  // ...
}
```

### 4.2. Test ve Dağıtım Planı

1. Önce bir sayfada (VehicleDetailsTab) implementasyonu test edin
2. Yükleme durumlarını, hata mesajlarını ve form davranışını kontrol edin
3. Başarılı olursa diğer sayfalara aynı yaklaşımı uygulayın
4. Sayfa geçişlerinde ve tab navigasyonunda sorun olmadığını doğrulayın

## Uygulama Stratejisi

1. **1. Gün (3-4 saat):** 
   - React Query kurulumu ve provider yapılandırması
   - İlk bağımlı sorgu implementasyonu (model > paket)

2. **2. Gün (4-5 saat):**
   - UI bileşenleri ve FormController güncellemesi
   - VehicleDetailsTab entegrasyonu ve test

3. **İhtiyaç Halinde (2-3 saat):**
   - Diğer tab'larda benzer implementasyon
   - Kullanıcı geri bildirimlerine göre optimizasyonlar

## Beklenen Faydalar

- Bağımlı select'lerde daha iyi yükleme göstergeleri
- Önbelleğe alma sayesinde daha iyi performans
- Daha net hata yönetimi
- Kod okunabilirliğinde artış
- Gereksiz yeniden render'ların azalması

Bu pragmatik yaklaşım, overengineering yapmadan temel React Query özelliklerini uygulamanıza entegre ederek hemen kullanılabilir iyileştirmeler sağlayacaktır.
