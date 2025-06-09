import React from "react";
import { UseFormReturn } from "react-hook-form";
import { BaseTabPanel } from "../common/BaseTabPanel";
import FormController from "../common/FormController";
import { FormFieldGroup } from "../common/FormFieldGroup";
import { VehicleFormValues } from "../schemas/vehicleSchema";

interface VehicleDocumentsTabProps {
  form: UseFormReturn<VehicleFormValues>;
}

const VehicleDocumentsTab: React.FC<VehicleDocumentsTabProps> = ({ form }) => {
  return (
    <BaseTabPanel 
      form={form}
      title="Araç Belge Bilgileri"
      breadcrumb={["Araç", "Belge Bilgileri"]}
      columns={3}
    >
      <FormFieldGroup title="Tescil Bilgileri">
        <FormController
          form={form}
          name="first_registration_date"
          label="İlk Tescil Tarihi"
          fieldType="date"
          placeholder="İlk tescil tarihi seçin"
        />
        
        <FormController
          form={form}
          name="registration_date"
          label="Ruhsat Tarihi"
          fieldType="date"
          placeholder="Ruhsat tarihi seçin"
        />
        
        <FormController
          form={form}
          name="inspection_end_date"
          label="Muayene Bitiş Tarihi"
          fieldType="date"
          placeholder="Muayene bitiş tarihi seçin"
        />
      </FormFieldGroup>

      <FormFieldGroup title="Bakım Bilgileri">
        <FormController
          form={form}
          name="next_maintenance_date"
          label="Sonraki Bakım Tarihi"
          fieldType="date"
          placeholder="Bakım tarihi seçin"
        />
      </FormFieldGroup>
      
      <FormFieldGroup title="Emisyon Bilgileri">
        <FormController
          form={form}
          name="emission_date"
          label="Emisyon Tarihi"
          fieldType="date"
          placeholder="Emisyon tarihi seçin"
        />
        
        <FormController
          form={form}
          name="emission_end_date"
          label="Emisyon Bitiş Tarihi"
          fieldType="date"
          placeholder="Emisyon bitiş tarihi seçin"
        />
        
        <FormController
          form={form}
          name="exhaust_stamp_expiry_date"
          label="Egzoz Pul Bitiş Tarihi"
          fieldType="date"
          placeholder="Egzoz pul bitiş tarihi seçin"
        />
      </FormFieldGroup>
    </BaseTabPanel>
  );
};

export default VehicleDocumentsTab;
