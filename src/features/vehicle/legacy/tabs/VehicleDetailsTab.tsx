import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import FormInputField from "../form/FormInputField";
import FormSelectField from "../form/FormSelectField";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useBrand } from "@/features/definitions/brands/BrandContext";
import { useColor } from "@/features/definitions/colors/ColorContext";
import { useModelsByBrand } from "@/features/definitions/models/useModelsByBrand";
import { usePackagesByModel } from "@/features/definitions/packages/usePackagesByModel";
import { useFuelType } from "@/features/definitions/fuel-types/useFuelType";
import { useTransmission } from "@/features/definitions/transmissions/useTransmission";

interface Props {
  form: any;
}

const VehicleDetailsTab: React.FC<Props> = ({ form }) => {
  const { token } = useAuth();

  // --- Tanım hook'ları ---
  const { brands, loading: loadingBrands } = useBrand();
  const { colors, loading: loadingColors } = useColor();
  const { fuelTypes, fetchFuelTypes, loading: loadingFuelTypes } = useFuelType(token);
  const { transmissions, fetchTransmissions, loading: loadingTransmissions } = useTransmission(token);
  
  // --- Seçili değerler ---
  const selectedBrandId = Number(form.watch("brand_id")) || null;
  const selectedModelId = Number(form.watch("model_id")) || null;
  const { models, loading: loadingModels } = useModelsByBrand(selectedBrandId);
  const { packages, loading: loadingPackages } = usePackagesByModel(selectedModelId);
  
  // --- Options ---
  const brandOptions = (brands || []).map((b: { id: number; name: string }) => ({ label: b.name, value: b.id }));
  const modelOptions = (models || []).map((m: { id: number; name: string }) => ({ label: m.name, value: m.id }));
  const packageOptions = (packages || []).map((p: { id: number; name: string }) => ({ label: p.name, value: p.id }));
  const colorOptions = (colors || []).map((c: { id: number; name: string }) => ({ label: c.name, value: c.id }));
  const fuelTypeOptions = (fuelTypes || []).map((f: { id: number; name: string }) => ({ label: f.name, value: f.id }));
  const transmissionOptions = (transmissions || []).map((t: { id: number; name: string }) => ({ label: t.name, value: t.id }));

  // --- İlk yüklemede tanım verilerini çek ---
  useEffect(() => {
    if (fetchFuelTypes) fetchFuelTypes();
    if (fetchTransmissions) fetchTransmissions();
  }, [fetchFuelTypes, fetchTransmissions]);

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-x-8 gap-y-8">
          {/* Araç Detayları */}
          <div>
            <nav className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="breadcrumb">
              <span>Araç</span>
              <span className="mx-1">/</span>
              <span>Araç Detayları</span>
            </nav>
            
            {/* Plaka - Artık zorunlu değil */}
            <Controller
              control={form.control}
              name="plate_number"
              render={({ field }) => (
                <FormInputField
                  {...field}
                  label="Araç Plakası"
                  error={form.formState.errors.plate_number}
                  placeholder="34 ABC 123"
                />
              )}
            />
            
            {/* Marka */}
            <Controller
              control={form.control}
              name="brand_id"
              render={({ field }) => (
                <FormSelectField
                  label="Marka"
                  name={field.name}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e);
                    form.setValue("model_id", "");
                    form.setValue("package_id", "");
                  }}
                  options={brandOptions}
                  placeholder="Marka seçin"
                  error={form.formState.errors.brand_id}
                  disabled={loadingBrands}
                />
              )}
            />
            
            {/* Model */}
            <Controller
              control={form.control}
              name="model_id"
              render={({ field }) => (
                <FormSelectField
                  label="Model"
                  name={field.name}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e);
                    form.setValue("package_id", "");
                  }}
                  options={modelOptions}
                  placeholder={selectedBrandId ? "Model seçin" : "Önce marka seçin"}
                  error={form.formState.errors.model_id}
                  disabled={loadingModels || !selectedBrandId}
                />
              )}
            />
            
            {/* Model Yılı */}
            <Controller
              control={form.control}
              name="model_year"
              render={({ field }) => (
                <FormInputField
                  {...field}
                  label="Model Yılı"
                  type="number"
                  error={form.formState.errors.model_year}
                  placeholder="Örn: 2023"
                />
              )}
            />
            
            {/* Paket */}
            <Controller
              control={form.control}
              name="package_id"
              render={({ field }) => (
                <FormSelectField
                  label="Paket"
                  name={field.name}
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={packageOptions}
                  placeholder={selectedModelId ? "Paket seçin" : "Önce model seçin"}
                  error={form.formState.errors.package_id}
                  disabled={loadingPackages || !selectedModelId}
                />
              )}
            />
            
            {/* Motor No */}
            <Controller
              control={form.control}
              name="engine_number"
              render={({ field }) => (
                <FormInputField
                  {...field}
                  label="Motor No"
                  error={form.formState.errors.engine_number}
                  placeholder="Motor numarası"
                />
              )}
            />
            
            {/* Motor Gücü */}
            <Controller
              control={form.control}
              name="engine_power"
              render={({ field }) => (
                <FormInputField
                  {...field}
                  label="Motor Gücü (HP)"
                  type="number"
                  error={form.formState.errors.engine_power}
                  placeholder="Örn: 150"
                />
              )}
            />
            
            {/* Motor Hacmi */}
            <Controller
              control={form.control}
              name="engine_capacity"
              render={({ field }) => (
                <FormInputField
                  {...field}
                  label="Motor Hacmi (cc)"
                  type="number"
                  error={form.formState.errors.engine_capacity}
                  placeholder="Örn: 1600"
                />
              )}
            />
            
            {/* Yakıt Tipi */}
            <Controller
              control={form.control}
              name="fuel_type_id"
              render={({ field }) => (
                <FormSelectField
                  label="Yakıt Tipi"
                  name={field.name}
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={fuelTypeOptions}
                  placeholder="Yakıt tipi seçin"
                  error={form.formState.errors.fuel_type_id}
                  disabled={loadingFuelTypes}
                />
              )}
            />
            
            {/* Şanzıman Tipi */}
            <Controller
              control={form.control}
              name="transmission_id"
              render={({ field }) => (
                <FormSelectField
                  label="Şanzıman Tipi"
                  name={field.name}
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={transmissionOptions}
                  placeholder="Şanzıman tipi seçin"
                  error={form.formState.errors.transmission_id}
                  disabled={loadingTransmissions}
                />
              )}
            />
            
            {/* Renk */}
            <Controller
              control={form.control}
              name="color_id"
              render={({ field }) => (
                <FormSelectField
                  label="Renk"
                  name={field.name}
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={colorOptions}
                  placeholder="Renk seçin"
                  error={form.formState.errors.color_id}
                  disabled={loadingColors}
                />
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleDetailsTab;
