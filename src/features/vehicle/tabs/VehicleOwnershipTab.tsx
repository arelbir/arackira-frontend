import React from "react";
import { UseFormReturn } from "react-hook-form";
import { BaseTabPanel } from "../common/BaseTabPanel";
import FormController from "../common/FormController";
import { FormFieldGroup } from "../common/FormFieldGroup";
import { VehicleFormValues } from "../schemas/vehicleSchema";

interface VehicleOwnershipTabProps {
  form: UseFormReturn<VehicleFormValues>;
}

const VehicleOwnershipTab: React.FC<VehicleOwnershipTabProps> = ({ form }) => {
  return (
    <BaseTabPanel 
      form={form} 
      title="Sahiplik Bilgileri" 
      breadcrumb={["Araç", "Sahiplik Bilgileri"]} 
      columns={3}
    >
      <FormFieldGroup title="Araç Sahibi">
        <FormController
          form={form}
          name="owner_name"
          label="Araç Sahibinin Adı"
          fieldType="input"
          placeholder="Ad Soyad / Şirket"
        />
        
        <FormController
          form={form}
          name="owner_id_number"
          label="TC/VKN"
          fieldType="input"
          placeholder="TC Kimlik / Vergi No"
        />
        
        <FormController
          form={form}
          name="owner_phone"
          label="Telefon"
          fieldType="input"
          placeholder="Telefon numarası"
        />
      </FormFieldGroup>
      
      <FormFieldGroup title="İletişim Bilgileri">
        <FormController
          form={form}
          name="owner_email"
          label="E-posta"
          fieldType="input"
          type="email"
          placeholder="E-posta adresi"
        />
        
        <FormController
          form={form}
          name="owner_address"
          label="Adres"
          fieldType="textarea"
          placeholder="Adres bilgilerini girin"
        />
      </FormFieldGroup>
      
      <FormFieldGroup title="Sahiplik Durumu">
        <FormController
          form={form}
          name="ownership_type"
          label="Sahiplik Türü"
          fieldType="select"
          placeholder="Seçiniz"
          options={[
            { value: "individual", label: "Bireysel" },
            { value: "corporate", label: "Kurumsal" },
            { value: "leasing", label: "Kiralık" }
          ]}
        />
        
        <FormController
          form={form}
          name="ownership_start_date"
          label="Sahiplik Başlangıç Tarihi"
          fieldType="date"
        />
      </FormFieldGroup>
    </BaseTabPanel>
  );
};

export default VehicleOwnershipTab;
