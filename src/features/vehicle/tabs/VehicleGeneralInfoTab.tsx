import React from "react";
import FormInputField from "../form/FormInputField";
import FormSelectField from "../form/FormSelectField";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Controller } from "react-hook-form";
  
interface Props {
  form: any;
}

const durumlar = [
  { value: "kiralik", label: "Kiralık" },
  { value: "satis", label: "Satışta" },
  { value: "havuz", label: "Havuz" },
];

const VehicleGeneralInfoTab: React.FC<Props> = ({ form }) => {
  // Ortak select opsiyonları
  const durumlar = [
    { value: "kiralik", label: "Kiralık" },
    { value: "satis", label: "Satışta" },
    { value: "havuz", label: "Havuz" },
  ];
  const markaOpsiyon = [
    { value: "1", label: "Renault" },
    { value: "2", label: "Fiat" },
    { value: "3", label: "Ford" },
  ];
  const modelOpsiyon = [
    { value: "1", label: "Clio" },
    { value: "2", label: "Egea" },
    { value: "3", label: "Focus" },
  ];
  const yakitOpsiyon = [
    { value: "1", label: "Benzin" },
    { value: "2", label: "Dizel" },
    { value: "3", label: "Elektrik" },
  ];
  const vitesOpsiyon = [
    { value: "1", label: "Manuel" },
    { value: "2", label: "Otomatik" },
  ];
  const renkOpsiyon = [
    { value: "1", label: "Beyaz" },
    { value: "2", label: "Gri" },
    { value: "3", label: "Siyah" },
  ];

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
            <FormInputField
              label="Şube"
              name="branch_id"
              value={form.watch("branch_id")}
              onChange={form.handleChange}
              error={form.formState.errors.branch_id}
              placeholder="Şube ID"
            />
            <FormInputField
              label="Araç Plakası"
              name="plate_number"
              value={form.watch("plate_number")}
              onChange={form.handleChange}
              error={form.formState.errors.plate_number}
              placeholder="34 ABC 123"
            />
            <FormSelectField
              label="Durum"
              name="status"
              value={form.watch("status")}
              onChange={form.handleChange}
              options={durumlar}
              error={form.formState.errors.status}
              placeholder="Durum seçiniz"
            />
            <FormInputField
              label="Şasi No"
              name="chassis_number"
              value={form.watch("chassis_number")}
              onChange={form.handleChange}
              error={form.formState.errors.chassis_number}
              placeholder="Şasi numarası"
            />
            <FormInputField
              label="Motor No"
              name="engine_number"
              value={form.watch("engine_number")}
              onChange={form.handleChange}
              error={form.formState.errors.engine_number}
              placeholder="Motor numarası"
            />
            <FormInputField
              label="Araç Tipi"
              name="vehicle_type_id"
              value={form.watch("vehicle_type_id")}
              onChange={form.handleChange}
              error={form.formState.errors.vehicle_type_id}
              placeholder="Tip ID"
            />
          </div>
          {/* Marka/Model/Donanım */}
          <div>
            <nav className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="breadcrumb">
              <span>Araç</span>
              <span className="mx-1">/</span>
              <span>Marka / Model / Donanım</span>
            </nav>
            <FormSelectField
              label="Marka"
              name="brand_id"
              value={form.watch("brand_id")}
              onChange={form.handleChange}
              options={markaOpsiyon}
              error={form.formState.errors.brand_id}
              placeholder="Marka seçiniz"
            />
            <FormSelectField
              label="Model"
              name="model_id"
              value={form.watch("model_id")}
              onChange={form.handleChange}
              options={modelOpsiyon}
              error={form.formState.errors.model_id}
              placeholder="Model seçiniz"
            />
            <FormInputField
              label="Versiyon"
              name="version"
              value={form.watch("version")}
              onChange={form.handleChange}
              error={form.formState.errors.version}
              placeholder="1.6 Vision"
            />
            <FormInputField
              label="Paket"
              name="package"
              value={form.watch("package")}
              onChange={form.handleChange}
              error={form.formState.errors.package}
              placeholder="Comfort"
            />
            <FormInputField
              label="Araç Grubu"
              name="vehicle_group_id"
              value={form.watch("vehicle_group_id")}
              onChange={form.handleChange}
              error={form.formState.errors.vehicle_group_id}
              placeholder="Grup ID"
            />
            <FormInputField
              label="Kasa Tipi"
              name="body_type"
              value={form.watch("body_type")}
              onChange={form.handleChange}
              error={form.formState.errors.body_type}
              placeholder="Sedan"
            />
            <FormSelectField
              label="Yakıt Tipi"
              name="fuel_type_id"
              value={form.watch("fuel_type_id")}
              onChange={form.handleChange}
              options={yakitOpsiyon}
              error={form.formState.errors.fuel_type_id}
              placeholder="Yakıt tipi seçiniz"
            />
            <FormSelectField
              label="Vites Tipi"
              name="transmission_id"
              value={form.watch("transmission_id")}
              onChange={form.handleChange}
              options={vitesOpsiyon}
              error={form.formState.errors.transmission_id}
              placeholder="Vites tipi seçiniz"
            />
          </div>
          {/* Teknik Bilgiler */}
          <div>
            <nav className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="breadcrumb">
              <span>Araç</span>
              <span className="mx-1">/</span>
              <span>Teknik Bilgiler</span>
            </nav>
            <FormInputField
              label="Model Yılı"
              name="model_year"
              value={form.watch("model_year")}
              onChange={form.handleChange}
              error={form.formState.errors.model_year}
              placeholder="2022"
              type="number"
            />
            <FormSelectField
              label="Renk"
              name="color_id"
              value={form.watch("color_id")}
              onChange={form.handleChange}
              options={renkOpsiyon}
              error={form.formState.errors.color_id}
              placeholder="Renk seçiniz"
            />
            <FormInputField
              label="Motor Gücü (HP)"
              name="engine_power_hp"
              value={form.watch("engine_power_hp")}
              onChange={form.handleChange}
              error={form.formState.errors.engine_power_hp}
              placeholder="132"
              type="number"
            />
            <FormInputField
              label="Motor Hacmi (cc)"
              name="engine_volume_cc"
              value={form.watch("engine_volume_cc")}
              onChange={form.handleChange}
              error={form.formState.errors.engine_volume_cc}
              placeholder="1598"
              type="number"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleGeneralInfoTab;