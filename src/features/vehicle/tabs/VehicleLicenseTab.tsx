import React from "react";
import { UseFormReturn } from "react-hook-form";
import { BaseTabPanel } from "../common/BaseTabPanel";
import FormController from "../common/FormController";
import { FormFieldGroup } from "../common/FormFieldGroup";
import { VehicleFormValues } from "../schemas/vehicleSchema";

interface VehicleLicenseTabProps {
  form: UseFormReturn<VehicleFormValues>;
}

const VehicleLicenseTab: React.FC<VehicleLicenseTabProps> = ({ form }) => {
  return (
    <BaseTabPanel 
      form={form} 
      title="Ruhsat Bilgileri" 
      breadcrumb={["Araç", "Ruhsat Bilgileri"]} 
      columns={3}
    >
      <FormFieldGroup title="Ruhsat Detayları">
        <FormController
          form={form}
          name="license_no"
          label="Ruhsat No"
          fieldType="input"
          placeholder="Ruhsat numarası girin"
        />
        
        <FormController
          form={form}
          name="license_date"
          label="Ruhsat Tarihi"
          fieldType="date"
        />
        
        <FormController
          form={form}
          name="license_issue_place"
          label="Ruhsatı Düzenleyen Kurum"
          fieldType="input"
          placeholder="Düzenleyen kurumun adı"
        />
      </FormFieldGroup>
      
      <FormFieldGroup title="Mülkiyet Bilgileri">
        <FormController
          form={form}
          name="license_owner_name"
          label="Ruhsat Sahibinin Adı"
          fieldType="input"
          placeholder="Ad Soyad / Şirket"
        />
        
        <FormController
          form={form}
          name="license_owner_id"
          label="Ruhsat Sahibi TC/VKN"
          fieldType="input"
          placeholder="TC Kimlik / Vergi No"
        />
        
        <FormController
          form={form}
          name="license_owner_address"
          label="Ruhsat Sahibi Adresi"
          fieldType="textarea"
          placeholder="Adres bilgilerini girin"
        />
      </FormFieldGroup>
    </BaseTabPanel>
  );
};

export default VehicleLicenseTab;
