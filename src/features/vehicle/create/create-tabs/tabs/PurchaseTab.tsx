"use client";



import { FormInput } from "@/components/ui/form-input";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useVehicleForm } from "../context/VehicleCreateProvider";
import { CreateTabContent } from "../TabNavigator";
import useSWR from "swr";
import { apiRequest } from "@/lib/api-client";
import { FormSelect } from "@/components/ui/form-select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import React, { useEffect } from "react";

// Field names constant
const FIELD = {
  BRAND: "brand_id",
  MODEL: "model_id",
  SUPPLIER: "supplier_id",
  PLATE: "plate_number",
  CHASSIS: "chassis_number",
  ENGINE_NUMBER: "engine_number",
  TSB: "tsb_code",
  PURCHASE_PRICE: "purchase_price",
  INVOICE_DATE: "invoice_date",
  COLOR: "color_id",
  BRANCH: "branch_id",
  VEHICLE_TYPE: "vehicle_type_id",
  FUEL_TYPE: "fuel_type_id",
  STATUS: "vehicle_status_id",
  MODEL_YEAR: "model_year",
};

// useLookup: cache key ile tekil fetch, SWR cache paylaşımı
function useLookup<T = { id: number; name: string }>(key: string | null) {
  const { data, error, isLoading } = useSWR<any>(key, key ? (url: string) => apiRequest({ url }) : null, { revalidateOnFocus: false });

  // API'den dönen veri bir nesne ise `data` alanını, değilse doğrudan veriyi kullan
  const responseData = data?.data ? data.data : data;

  return { data: responseData as T[] | undefined, error, isLoading };
}

// Custom hook: Brand değişince model_id sıfırlama ve edge-case logic
function useModelResetOnBrandChange(brandId: string | undefined, models: any[] | undefined, watchedModelId: string | undefined, resetField: (name: string) => void) {
  
  const prevBrandIdRef = React.useRef<string | undefined>(undefined);
  // Brand değişince model_id sıfırlansın
  React.useEffect(() => {
    if (prevBrandIdRef.current !== undefined && prevBrandIdRef.current !== brandId) {
      resetField(FIELD.MODEL);
    }
    prevBrandIdRef.current = brandId;
  }, [brandId, resetField]);
  // Model id mevcut model listesinde yoksa sıfırla (edge case)
  React.useEffect(() => {
    if (
      brandId &&
      models &&
      watchedModelId &&
      !models.find((m: any) => String(m.id) === String(watchedModelId))
    ) {
      resetField(FIELD.MODEL);
    }
  }, [brandId, models, watchedModelId, resetField]);
}

// Helper: DRY FormField+FormSelect
function FormSelectField({ control, name, label, options, loading, error, placeholder, disabled, helperText }: any) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }: any) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <FormSelect
              {...field}
              value={field.value !== undefined && field.value !== null ? String(field.value) : undefined}
              options={options}
              loading={loading}
              disabled={disabled}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
          {error && <p className="text-xs text-red-500 mt-1">{String(error)}</p>}
          {disabled && helperText && <p className="text-xs text-muted-foreground mt-1">{helperText}</p>}
        </FormItem>
      )}
    />
  );
}


import { useWatch } from "react-hook-form";

function SatinalmaBilgileriFields({ control, errors }: any) {
  const { data: suppliers, isLoading: suppliersLoading, error: suppliersError } = useLookup('/api/suppliers');
  const { data: brands, isLoading: brandsLoading, error: brandsError } = useLookup('/api/brands');
  const watchedBrandId = useWatch({ control, name: FIELD.BRAND });
  const brandId = watchedBrandId ? String(watchedBrandId) : undefined;
  const { data: models, isLoading: modelsLoading, error: modelsError } = useLookup(brandId ? `/api/models/by-brand/${brandId}` : null);

  
  
  return (
    <div className="mb-8">
      <div className="mb-2 font-semibold text-foreground">Satınalma Bilgileri</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelectField
          control={control}
          name={FIELD.BRAND}
          label="Marka"
          options={(brands ?? []).map(b => ({ label: b.name, value: String(b.id) }))}
          loading={brandsLoading}
          error={brandsError}
          placeholder="Marka seçiniz"
          disabled={brandsLoading || !!brandsError}
          helperText={brandsLoading ? "Yükleniyor..." : (brandsError ? "Marka verisi alınamadı" : undefined)}
          // LOG: Marka select render props
          logProps={{ control, brands, brandsLoading, brandsError }}
        />
        <FormSelectField
          control={control}
          name={FIELD.MODEL}
          label="Model"
          options={Array.isArray(models) ? models.map((m: any) => ({ value: String(m.id), label: m.name })) : []}
          loading={modelsLoading}
          error={modelsError}
          placeholder="Model seçiniz"
          disabled={!brandId || !Array.isArray(models) || models.length === 0}
        />
        <FormInput control={control} name={FIELD.CHASSIS} label="Şasi No" required />
        <FormInput control={control} name={FIELD.ENGINE_NUMBER} label="Motor No" />
        <FormField
          control={control}
          name={FIELD.MODEL_YEAR}
          rules={{
            required: true,
            validate: v => {
              if (v === undefined || v === null || v === "") return "Zorunlu";
              if (isNaN(Number(v))) return "Geçerli bir yıl girin";
              if (Number(v) < 1900 || Number(v) > new Date().getFullYear()) return `1900-${new Date().getFullYear()} arası bir yıl girin`;
              return true;
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model Yıl *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Model Yıl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormInput control={control} name={FIELD.TSB} label="Tsb Kodu" />
        <FormField
          control={control}
          name={FIELD.PLATE}
          rules={{
            required: "Gerekli",
            validate: async (val) => {
              if (!val) return "Gerekli";
              try {
                                const res = await apiRequest({ url: `/api/vehicles/check-plate?plate=${encodeURIComponent(val)}`}) as { exists: boolean };
                return res.exists ? "Plaka zaten kayıtlı" : true;
              } catch (e) {
                return true;
              }
            }
          }}
          render={({ field }) => (
            <FormInput {...field} control={control} label="Plaka" required />
          )}
        />
        <FormSelectField
          control={control}
          name={FIELD.SUPPLIER}
          label="Satın alınan Firma"
          options={suppliers?.map((s: any) => ({ value: String(s.id), label: s.name })) ?? []}
          loading={suppliersLoading}
          error={suppliersError}
          placeholder="Satın alınan firma seçiniz"
          disabled={suppliersLoading || !!suppliersError}
          helperText={suppliersLoading ? "Yükleniyor..." : (suppliersError ? "Tedarikçi verisi alınamadı" : undefined)}
        />
        <FormField
          control={control}
          name={FIELD.PURCHASE_PRICE}
          rules={{
            required: true,
            validate: v => {
              if (v === undefined || v === null || v === "") return "Zorunlu";
              if (isNaN(Number(v))) return "Geçerli bir sayı girin";
              if (Number(v) <= 0) return "Pozitif bir değer girin";
              return true;
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Satınalma Bedeli *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  value={field.value ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Satınalma Bedeli"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={FIELD.INVOICE_DATE}
          rules={{ required: "Gerekli" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fatura Tarihi *</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value && !isNaN(new Date(field.value as string).getTime()) ? new Date(field.value as string) : undefined}
                  onChange={(d: Date | undefined) => field.onChange(d ? d.toISOString().split("T")[0] : undefined) }
                  placeholder="Fatura Tarihi"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function AracBilgileriFields({ control, errors }: any) {
  const { data: colors } = useLookup('/api/colors');
  const { data: branches } = useLookup('/api/branches');
  const { data: vehicleTypes } = useLookup('/api/vehicle-types');
  const { data: fuelTypes } = useLookup('/api/fuel-types');
  const { data: statuses } = useLookup("/api/vehicle-statuses");

  return (
    <div className="mb-8">
      <div className="mb-2 font-semibold text-foreground">Araç Bilgileri</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelectField
          control={control}
          name={FIELD.COLOR}
          label="Renk"
          options={(colors ?? []).map(c => ({ label: c.name, value: String(c.id) }))}
          loading={!Array.isArray(colors)}
          error={undefined}
          placeholder="Renk seçiniz"
          disabled={!Array.isArray(colors)}
          helperText={!Array.isArray(colors) ? "Yükleniyor..." : undefined}
        />
        <FormSelectField
          control={control}
          name={FIELD.BRANCH}
          label="Ruhsat Sahibi Firma"
          options={(branches ?? []).map(b => ({ label: b.name, value: String(b.id) }))}
          loading={!Array.isArray(branches)}
          error={undefined}
          placeholder="Ruhsat Sahibi Firma seçiniz"
          disabled={!Array.isArray(branches)}
          helperText={!Array.isArray(branches) ? "Yükleniyor..." : undefined}
        />
        <FormSelectField
          control={control}
          name={FIELD.VEHICLE_TYPE}
          label="Araç Tipi"
          options={(vehicleTypes ?? []).map(v => ({ label: v.name, value: String(v.id) }))}
          loading={!Array.isArray(vehicleTypes)}
          error={undefined}
          placeholder="Araç tipi seçiniz"
          disabled={!Array.isArray(vehicleTypes)}
          helperText={!Array.isArray(vehicleTypes) ? "Yükleniyor..." : undefined}
        />
        <FormSelectField
          control={control}
          name={FIELD.FUEL_TYPE}
          label="Yakıt Tipi"
          options={(fuelTypes ?? []).map(f => ({ label: f.name, value: String(f.id) }))}
          loading={!Array.isArray(fuelTypes)}
          error={undefined}
          placeholder="Yakıt tipi seçiniz"
          disabled={!Array.isArray(fuelTypes)}
          helperText={!Array.isArray(fuelTypes) ? "Yükleniyor..." : undefined}
        />
        <FormSelectField
          control={control}
          name={FIELD.STATUS}
          label="Durum"
          options={(statuses ?? []).map(s => ({ label: s.name, value: String(s.id) }))}
          loading={!Array.isArray(statuses)}
          error={undefined}
          placeholder="Durum seçiniz"
          disabled={!Array.isArray(statuses)}
          helperText={!Array.isArray(statuses) ? "Yükleniyor..." : undefined}
        />
      </div>
    </div>
  );
}

export function PurchaseTab() {
  const { form, vehicleId } = useVehicleForm();
  const { control, watch, getValues, formState: { errors } } = form;

  return (
    <>
      <CreateTabContent value="purchase">
        <Card>
          <CardHeader>
            <CardTitle>Genel Bilgiler</CardTitle>
          </CardHeader>
          <CardContent>
            <SatinalmaBilgileriFields control={control} watch={watch} errors={errors} />
            
            <AracBilgileriFields control={control} getValues={getValues} errors={errors} />
          </CardContent>
        </Card>
      </CreateTabContent>
    </>
  );
}
