import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { BaseTabPanel } from "../common/BaseTabPanel";
import FormController from "../common/FormController";
import { FormFieldGroup } from "../common/FormFieldGroup";
import { VehicleFormValues } from "../schemas/vehicleSchema";
import { useAuth } from "@/hooks/useAuth";
import { useBrand } from "@/features/definitions/brands/BrandContext";
import { useColor } from "@/features/definitions/colors/ColorContext";
// Eski model hook'u yerine yeni React Query hook'u kullan
import { useModelsByBrand } from "@/features/definitions/models/use-models";
import { usePackagesByModel } from "@/features/definitions/packages/use-packages";
// Eski hook'lar yerine React Query hook'larını kullan
import { useAllFuelTypes } from "@/features/definitions/fuel-types/use-fuel-types";
import { useAllTransmissions } from "@/features/definitions/transmissions/use-transmissions";

interface VehicleDetailsTabProps {
  form: UseFormReturn<VehicleFormValues>;
}

const VehicleDetailsTab: React.FC<VehicleDetailsTabProps> = ({ form }) => {
  const { token } = useAuth();

  // --- Tanım hook'ları ---
  const { brands, loading: loadingBrands } = useBrand();
  const { colors, loading: loadingColors } = useColor();
  
  // React Query hook'ları ile veri getirme
  const { 
    data: fuelTypes = [], 
    isLoading: loadingFuelTypes 
  } = useAllFuelTypes();
  
  const { 
    data: transmissions = [], 
    isLoading: loadingTransmissions 
  } = useAllTransmissions();
  
  // --- Seçili değerler ---
  const selectedBrandId = Number(form.watch("brand_id")) || null;
  const selectedModelId = Number(form.watch("model_id")) || null;
  
  // React Query hook'ları ile bağımlı veri getirme
  const { 
    data: models = [], 
    isLoading: loadingModels,
    error: modelsError 
  } = useModelsByBrand(selectedBrandId);
  
  // React Query ile paket verilerini getirme
  const { 
    data: packages = [], 
    isLoading: loadingPackages,
    error: packagesError 
  } = usePackagesByModel(selectedModelId);
  
  // --- Options ---
  const brandOptions = (brands || []).map((b: { id: number; name: string }) => ({ label: b.name, value: b.id }));
  const modelOptions = models.map((m) => ({ label: m.name, value: m.id }));
  const packageOptions = packages.map((p) => ({ label: p.name, value: p.id }));
  const colorOptions = (colors || []).map((c: { id: number; name: string }) => ({ label: c.name, value: c.id }));
  const fuelTypeOptions = fuelTypes.map((f) => ({ label: f.name, value: f.id }));
  const transmissionOptions = transmissions.map((t) => ({ label: t.name, value: t.id }));

  // React Query ile veri getirme otomatik yapılıyor, 
  // manuel fetchFuelTypes ve fetchTransmissions çağrılarına gerek kalmadı

  return (
    <BaseTabPanel
      form={form}
      title="Araç Detayları"
      breadcrumb={["Araç", "Araç Detayları"]}
      columns={3}
    >
      <FormFieldGroup title="Temel Bilgiler">
        <FormController
          form={form}
          name="plate_number" 
          label="Araç Plakası"
          fieldType="input"
          placeholder="34 ABC 123"
        />
            
        <FormController
          form={form}
          name="brand_id"
          label="Marka"
          fieldType="select"
          placeholder="Marka seçin"
          disabled={loadingBrands}
          options={brandOptions}
          onChange={(value: any) => {
            form.setValue("model_id", null);
            form.setValue("package_id", null);
          }}
        />
        
        <FormController
          form={form}
          name="model_id"
          label="Model"
          fieldType="select"
          placeholder={selectedBrandId ? "Model seçin" : "Önce marka seçin"}
          disabled={loadingModels || !selectedBrandId}
          options={modelOptions}
          isLoading={!!(loadingModels && selectedBrandId)} // Yükleme durumu gösterimi
          onChange={(value: any) => {
            form.setValue("package_id", null);
          }}
        />
        
        <FormController
          form={form}
          name="package_id"
          label="Paket"
          fieldType="select"
          placeholder={selectedModelId ? "Paket seçin" : "Önce model seçin"}
          disabled={loadingPackages || !selectedModelId}
          isLoading={!!(loadingPackages && selectedModelId)} // Yükleme durumu gösterimi
          options={packageOptions}
        />
      </FormFieldGroup>
      
      <FormFieldGroup title="Araç Özellikleri">
        <FormController
          form={form}
          name="model_year"
          label="Model Yılı"
          fieldType="input"
          type="number"
          placeholder="Örn: 2023"
        />
        
        <FormController
          form={form}
          name="vehicle_code"
          label="Araç Kodu"
          fieldType="input"
          placeholder="Araç kodu"
        />
        
        <FormController
          form={form}
          name="version"
          label="Versiyon"
          fieldType="input"
          placeholder="Araç versiyonu"
        />
        
        <FormController
          form={form}
          name="seat_count"
          label="Koltuk Sayısı"
          fieldType="input"
          type="number"
          placeholder="Örn: 5"
        />
        
        <FormController
          form={form}
          name="color_id"
          label="Renk"
          fieldType="select"
          placeholder="Renk seçin"
          disabled={loadingColors}
          options={colorOptions}
        />
        
        <FormController
          form={form}
          name="fuel_type_id"
          label="Yakıt Tipi"
          fieldType="select"
          isLoading={loadingFuelTypes}
          placeholder="Yakıt tipi seçin"
          disabled={loadingFuelTypes}
          options={fuelTypeOptions}
        />
        
        <FormController
          form={form}
          name="transmission_id"
          label="Vites Tipi"
          fieldType="select"
          isLoading={loadingTransmissions}
          placeholder="Vites tipi seçin"
          disabled={loadingTransmissions}
          options={transmissionOptions}
        />
      </FormFieldGroup>
      
      <FormFieldGroup title="Motor Bilgileri">
        <FormController
          form={form}
          name="engine_number"
          label="Motor No"
          fieldType="input"
          placeholder="Motor numarası"
        />
        
        <FormController
          form={form}
          name="engine_capacity"
          label="Motor Hacmi (cc)"
          fieldType="input"
          type="number"
          placeholder="Örn: 1600"
        />
        
        <FormController
          form={form}
          name="engine_volume"
          label="Motor Hacmi (lt)"
          fieldType="input"
          type="number"
          placeholder="Örn: 1.6"
        />
        
        <FormController
          form={form}
          name="engine_power"
          label="Motor Gücü (HP)"
          fieldType="input"
          type="number"
          placeholder="Örn: 150"
        />
      </FormFieldGroup>
    </BaseTabPanel>
  );
};

export default VehicleDetailsTab;
