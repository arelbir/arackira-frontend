import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import FormInputField from "../form/FormInputField";
import FormSelectField from "../form/FormSelectField";
import FormDateField from "../form/FormDateField";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import {
  useVehicleType,
  useBrand,
  useModelsByBrand,
  usePackagesByModel,
  useColor,
  useFuelType,
  useTransmission,
  useBranch
} from "@/features/definitions/hooks";
import { useVehicleStatuses } from '@/features/definitions/vehicle-statuses/useVehicleStatuses';

interface Props {
  form: any;
}

const VehicleGeneralInfoTab: React.FC<Props> = ({ form }) => {
  const { token } = useAuth();

  // --- Tanım hook'ları ---
  const { vehicleTypes, fetchVehicleTypes, loading: loadingVehicleTypes } = useVehicleType(token);
  const { brands, fetchBrands, loading: loadingBrands } = useBrand();
  const { colors, fetchColors, loading: loadingColors } = useColor();
  const { fuelTypes, fetchFuelTypes, loading: loadingFuelTypes } = useFuelType(token);
  const { transmissions, fetchTransmissions, loading: loadingTransmissions } = useTransmission(token);
  const { vehicleStatuses, loading: statusesLoading } = useVehicleStatuses();
  const { branches, loading: loadingBranches } = useBranch();

  // --- Seçili değerler ---
  const selectedBrandId = Number(form.watch("brand_id")) || null;
  const selectedModelId = Number(form.watch("model_id")) || null;
  const { models, loading: loadingModels } = useModelsByBrand(selectedBrandId);
  const { packages, loading: loadingPackages } = usePackagesByModel(selectedModelId);

  // --- Options ---
  const vehicleStatusOptions = (vehicleStatuses || []).map((s: { id: number; name: string }) => ({ label: s.name, value: s.id }));
  const branchOptions = (branches || []).map((b: { id: number; name: string }) => ({ label: b.name, value: b.id }));

  // --- İlk yüklemede tanım verilerini çek ---
  useEffect(() => {
    fetchVehicleTypes();
    fetchBrands();
    fetchColors();
    fetchFuelTypes();
    fetchTransmissions();
  }, [fetchVehicleTypes, fetchBrands, fetchColors, fetchFuelTypes, fetchTransmissions]);

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-x-8 gap-y-8">
          {/* Temel Bilgiler */}
          <div>
            <nav className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="breadcrumb">
              <span>Araç</span>
              <span className="mx-1">/</span>
              <span>Temel Bilgiler</span>
            </nav>
            {/* Şube seçimi */}
            {/* Şube seçimi - Tamamen controlled */}
            <Controller
              control={form.control}
              name="branch_id"
              render={({ field }) => (
                <FormSelectField
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  label="Şube"
                  error={form.formState.errors.branch_id}
                  options={branchOptions}
                  placeholder="Şube seçin"
                  disabled={loadingBranches}
                />
              )}
            />
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
            <Controller
  control={form.control}
  name="vehicle_status_id"
  render={({ field }) => (
    <FormSelectField
      label="Araç Statüsü"
      name={field.name}
      value={field.value || ''}
      onChange={field.onChange}
      options={vehicleStatusOptions}
      error={form.formState.errors.vehicle_status_id}
      placeholder={statusesLoading ? "Yükleniyor..." : "Seçiniz"}
      disabled={statusesLoading}
    />
  )}
/>
            <Controller
              control={form.control}
              name="chassis_number"
              render={({ field }) => (
                <FormInputField
                  {...field}
                  label="Şasi No"
                  error={form.formState.errors.chassis_number}
                  placeholder="Şasi numarası"
                />
              )}
            />
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
            {/* İlk Tescil Tarihi */}
            <Controller
              control={form.control}
              name="first_registration_date"
              render={({ field }) => (
                <FormDateField
                  {...field}
                  label="İlk Tescil Tarihi"
                  error={form.formState.errors.first_registration_date}
                  placeholder="Tescil tarihi"
                />
              )}
            />
            {/* Ruhsat Belge Numarası */}
            <Controller
              control={form.control}
              name="registration_document_number"
              render={({ field }) => (
                <FormInputField
                  {...field}
                  label="Ruhsat Belge Numarası"
                  error={form.formState.errors.registration_document_number}
                  placeholder="Belge numarası"
                />
              )}
            />
            {/* Araç KM */}
            <Controller
              control={form.control}
              name="vehicle_km"
              render={({ field }) => (
                <FormInputField
                  {...field}
                  label="Araç KM"
                  error={form.formState.errors.vehicle_km}
                  placeholder="Kilometre"
                  type="number"
                />
              )}
            />

          </div>
          {/* Marka/Model/Donanım */}
          <div>
            <nav className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="breadcrumb">
              <span>Araç</span>
              <span className="mx-1">/</span>
              <span>Marka / Model / Donanım</span>
            </nav>
            {/* Araç Tipi select için Controller */}
            <Controller
              control={form.control}
              name="vehicle_type_id"
              render={({ field }) => (
                <FormSelectField
                  {...field}
                  label="Araç Tipi"
                  options={vehicleTypes.map(vt => ({ value: String(vt.id), label: vt.name }))}
                  error={form.formState.errors.vehicle_type_id}
                  placeholder="Araç tipi seçiniz"
                  disabled={loadingVehicleTypes}
                />
              )}
            />
            {/* Marka select için Controller */}
            <Controller
              control={form.control}
              name="brand_id"
              render={({ field }) => (
                <FormSelectField
                  {...field}
                  label="Marka"
                  options={brands.map(b => ({ value: String(b.id), label: b.name }))}
                  error={form.formState.errors.brand_id}
                  placeholder="Marka seçiniz"
                  disabled={loadingBrands}
                />
              )}
            />
            {/* Model select için Controller */}
            <Controller
              control={form.control}
              name="model_id"
              render={({ field }) => (
                <FormSelectField
                  {...field}
                  label="Model"
                  options={models.map(m => ({ value: String(m.id), label: m.name }))}
                  error={form.formState.errors.model_id}
                  placeholder="Model seçiniz"
                  disabled={loadingModels || !selectedBrandId}
                />
              )}
            />

            {/* Paket select için Controller */}
            <Controller
              control={form.control}
              name="package_id"
              render={({ field }) => (
                <FormSelectField
                  {...field}
                  label="Paket"
                  options={packages.map((pkg: { id: number; name: string }) => ({ value: String(pkg.id), label: pkg.name }))}
                  error={form.formState.errors.package_id}
                  placeholder="Paket seçiniz"
                  disabled={loadingPackages || !selectedModelId}
                />
              )}
            />
            {/* Araç Grubu - Controlled */}
            <Controller
              control={form.control}
              name="vehicle_group_id"
              render={({ field }) => (
                <FormInputField
                  {...field}
                  label="Araç Grubu"
                  error={form.formState.errors.vehicle_group_id}
                  placeholder="Grup ID"
                />
              )}
            />

            {/* Yakıt Tipi - Controlled */}
            <Controller
              control={form.control}
              name="fuel_type_id"
              render={({ field }) => (
                <FormSelectField
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  label="Yakıt Tipi"
                  options={fuelTypes.map(f => ({ value: String(f.id), label: f.name }))}
                  error={form.formState.errors.fuel_type_id}
                  placeholder="Yakıt tipi seçiniz"
                  disabled={loadingFuelTypes}
                />
              )}
            />
            {/* Vites Tipi - Controlled */}
            <Controller
              control={form.control}
              name="transmission_id"
              render={({ field }) => (
                <FormSelectField
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  label="Vites Tipi"
                  options={transmissions.map(t => ({ value: String(t.id), label: t.name }))}
                  error={form.formState.errors.transmission_id}
                  placeholder="Vites tipi seçiniz"
                  disabled={loadingTransmissions}
                />
              )}
            />
          </div>
          {/* Teknik Bilgiler */}
          <div>
            <nav className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="breadcrumb">
              <span>Araç</span>
              <span className="mx-1">/</span>
              <span>Teknik Bilgiler</span>
            </nav>
            {/* Model Yılı - Controlled */}
            <Controller
              control={form.control}
              name="model_year"
              render={({ field }) => (
                <FormInputField
                  {...field}
                  label="Model Yılı"
                  error={form.formState.errors.model_year}
                  placeholder="2022"
                  type="number"
                />
              )}
            />
            {/* Renk - Controlled */}
            <Controller
              control={form.control}
              name="color_id"
              render={({ field }) => (
                <FormSelectField
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  label="Renk"
                  options={colors.map(c => ({ value: String(c.id), label: c.name }))}
                  error={form.formState.errors.color_id}
                  placeholder="Renk seçiniz"
                  disabled={loadingColors}
                />
              )}
            />
            {/* Motor Gücü (HP) - Controlled */}
            <Controller
              control={form.control}
              name="engine_power_hp"
              render={({ field }) => (
                <FormInputField
                  {...field}
                  label="Motor Gücü (HP)"
                  error={form.formState.errors.engine_power_hp}
                  placeholder="132"
                  type="number"
                />
              )}
            />
            {/* Motor Hacmi (cc) - Controlled */}
            <Controller
              control={form.control}
              name="engine_volume_cc"
              render={({ field }) => (
                <FormInputField
                  {...field}
                  label="Motor Hacmi (cc)"
                  error={form.formState.errors.engine_volume_cc}
                  placeholder="1598"
                  type="number"
                />
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleGeneralInfoTab;