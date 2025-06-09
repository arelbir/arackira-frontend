# React Query Implementasyon Planı - Bölüm 2: Form Entegrasyonu ve Bileşenler

## 1. Form Bileşenleri ve UI Entegrasyonu (2 saat)

```tsx
// src/components/ui/select-with-status.tsx
"use client";

import { Spinner } from "@/components/ui/spinner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface SelectWithStatusProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  options?: Array<{ label: string; value: string | number }>;
  error?: string;
  isLoading?: boolean;
}

export function SelectWithStatus({
  value,
  onChange,
  placeholder,
  options = [],
  disabled,
  error,
  isLoading,
}: SelectWithStatusProps) {
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

## 2. FormController Güncellemesi (2 saat)

```tsx
// src/features/vehicle/common/FormController.tsx
import { Controller } from "react-hook-form";
import { SelectWithStatus } from "@/components/ui/select-with-status";
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
              <SelectWithStatus
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
        
        // Diğer alan tipleri için benzer geliştirmeler...
        
        return null;
      }}
    />
  );
}
```

## 3. Domain-Specific Hook'lar (2 saat)

```tsx
// src/features/definitions/models/use-models.ts
"use client";

import { useQuery } from '@/hooks/queries/use-query';
import { Model, getModelsByBrand } from './model-service';

export function useModelsByBrand(brandId: number | null) {
  return useQuery<Model[]>(
    ['models', brandId],
    async () => {
      if (!brandId) return [];
      return getModelsByBrand(brandId);
    },
    {
      enabled: !!brandId,
      placeholderData: [],
      staleTime: 1000 * 60 * 10, // 10 dakika
    }
  );
}

// Diğer hook'lar için...
```

## 4. VehicleDetailsTab Entegrasyonu (2.5 saat)

```tsx
// src/features/vehicle/tabs/VehicleDetailsTab.tsx
"use client";

import { useState } from 'react';
import { BaseTabPanel } from '../common/BaseTabPanel';
import { FormFieldGroup } from '../common/FormFieldGroup';
import { FormController } from '../common/FormController';
import { useBrand } from '@/features/definitions/brands/use-brands';
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
  const { data: brands = [], isLoading: loadingBrands } = useBrand();
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
              placeholder={loadingModels && selectedBrandId ? "Modeller yükleniyor..." : "Model seçin"}
            />
            
            <FormController
              form={form}
              name="package_id"
              label="Paket"
              fieldType="select"
              options={packageOptions}
              disabled={!selectedModelId}
              isLoading={loadingPackages && !!selectedModelId}
              placeholder={loadingPackages && selectedModelId ? "Paketler yükleniyor..." : "Paket seçin"}
            />
            
            {/* Diğer form alanları... */}
          </FormFieldGroup>
        </>
      )}
    </BaseTabPanel>
  );
}
```

## 5. Form ve Query State Senkronizasyonu (1.5 saat)

```tsx
// src/hooks/form/use-form-dependencies.ts
"use client";

import { useEffect } from "react";
import { useFormContext, UseFormReturn } from "react-hook-form";

interface FieldDependency<T = any> {
  field: keyof T;
  dependentFields: Array<keyof T>;
  resetValue?: any | ((form: UseFormReturn<T>) => any);
}

export function useFormDependencies<T = any>(
  form: UseFormReturn<T>,
  dependencies: FieldDependency<T>[]
) {
  const watchedValues = form.watch();
  
  useEffect(() => {
    dependencies.forEach(({ field, dependentFields, resetValue }) => {
      const fieldValue = watchedValues[field];
      
      // Değer undefined, null veya boş string ise bağımlı alanları sıfırla
      if (fieldValue === undefined || fieldValue === null || fieldValue === "") {
        dependentFields.forEach((depField) => {
          const valueToSet = typeof resetValue === 'function' 
            ? resetValue(form)
            : (resetValue !== undefined ? resetValue : null);
            
          form.setValue(depField, valueToSet);
        });
      }
    });
  }, [watchedValues, form, dependencies]);
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

## 6. Skeleton ve Loading States (1.5 saat)

```tsx
// src/components/ui/loading-select-list.tsx
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingSelectList({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-10" />
        </div>
      ))}
    </>
  );
}

// src/components/ui/form-field-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

interface FormFieldSkeletonProps {
  hasLabel?: boolean;
  height?: number;
}

export function FormFieldSkeleton({ 
  hasLabel = true, 
  height = 10 
}: FormFieldSkeletonProps) {
  return (
    <div className="space-y-2">
      {hasLabel && <Skeleton className="h-4 w-24" />}
      <Skeleton className={`h-${height} w-full`} />
    </div>
  );
}

// Kullanım örneği
function LoadingForm() {
  return (
    <div className="space-y-4">
      <FormFieldSkeleton />
      <FormFieldSkeleton />
      <div className="grid grid-cols-2 gap-4">
        <FormFieldSkeleton />
        <FormFieldSkeleton />
      </div>
    </div>
  );
}
```

## 7. Error Handling ve UI Entegrasyonu (1 saat)

```tsx
// src/components/ui/error-message.tsx
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message?: string;
  className?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorMessage({
  message = 'Bir hata oluştu',
  className,
  onRetry,
  isRetrying = false,
}: ErrorMessageProps) {
  return (
    <div className={cn(
      'rounded-md bg-destructive/10 p-3 text-destructive flex items-start gap-2',
      className
    )}>
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="space-y-2 flex-1">
        <p className="text-sm font-medium">{message}</p>
        
        {onRetry && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            disabled={isRetrying}
            className="h-8 gap-1 border-destructive/30 hover:bg-destructive/10"
          >
            {isRetrying && <RefreshCw className="h-3 w-3 animate-spin" />}
            {isRetrying ? 'Yeniden deneniyor...' : 'Yeniden dene'}
          </Button>
        )}
      </div>
    </div>
  );
}
```
