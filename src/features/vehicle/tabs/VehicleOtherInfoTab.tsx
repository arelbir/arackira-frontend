import React from "react";
import { UseFormReturn } from "react-hook-form";
import { BaseTabPanel } from "../common/BaseTabPanel";
import FormController from "../common/FormController";
import { FormFieldGroup } from "../common/FormFieldGroup";
import { VehicleFormValues } from "../schemas/vehicleSchema";

interface VehicleOtherInfoTabProps {
  form: UseFormReturn<VehicleFormValues>;
}

const VehicleOtherInfoTab: React.FC<VehicleOtherInfoTabProps> = ({ form }) => {
  return (
    <BaseTabPanel 
      form={form} 
      title="Diğer Bilgiler" 
      breadcrumb={["Araç", "Diğer Bilgiler"]} 
      columns={3}
    >
      <FormFieldGroup title="Bakım ve Muayene Tarihleri">
        <FormController
          form={form}
          name="next_maintenance_date"
          label="Sonraki Bakım Tarihi"
          fieldType="date"
          placeholder="Bakım tarihi"
        />
        
        <FormController
          form={form}
          name="inspection_end_date"
          label="Muayene Bitiş Tarihi"
          fieldType="date"
          placeholder="Muayene bitiş tarihi"
        />
      </FormFieldGroup>
      
      <FormFieldGroup title="Sigorta ve Kasko Tarihleri">
        <FormController
          form={form}
          name="insurance_expiry_date"
          label="Trafik Sigorta Bitiş Tarihi"
          fieldType="date"
          placeholder="Sigorta bitiş tarihi"
        />
        
        <FormController
          form={form}
          name="casco_expiry_date"
          label="Kasko Bitiş Tarihi"
          fieldType="date"
          placeholder="Kasko bitiş tarihi"
        />
      </FormFieldGroup>
      
      <FormFieldGroup title="Emisyon Bilgileri">
        <FormController
          form={form}
          name="exhaust_stamp_expiry_date"
          label="Egzoz Pul Bitiş Tarihi"
          fieldType="date"
          placeholder="Egzoz pul bitiş tarihi"
        />
      </FormFieldGroup>
    </BaseTabPanel>
  );
};

export default VehicleOtherInfoTab;
