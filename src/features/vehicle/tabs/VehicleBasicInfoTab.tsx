import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useVehicleStatuses } from '@/features/definitions/vehicle-statuses/useVehicleStatuses';
import { useAllBranches } from "@/features/definitions/branches/use-branches";
//import { useSupplier } from "@/features/definitions/suppliers/use-supplier";
import { BaseTabPanel } from "../common/BaseTabPanel";
import FormController from "../common/FormController";
import { FormFieldGroup } from "../common/FormFieldGroup";
import { VehicleFormValues } from "../schemas/vehicleSchema";

interface VehicleBasicInfoTabProps {
  form: UseFormReturn<VehicleFormValues>;
}

const VehicleBasicInfoTab: React.FC<VehicleBasicInfoTabProps> = ({ form }) => {
  const { token } = useAuth();

  // --- Tanım hook'ları ---
  const { vehicleStatuses, loading: statusesLoading } = useVehicleStatuses();
  const { data: branches, isPending: loadingBranches } = useAllBranches();
  //const { suppliers, loading: loadingSuppliers } = useSupplier(token);

  // --- Options ---
  const vehicleStatusOptions = (vehicleStatuses || []).map((s: { id: number; name: string }) => ({ label: s.name, value: s.id }));
  const branchOptions = (branches || []).map((b: { id: number; name: string }) => ({ label: b.name, value: b.id }));
  const supplierOptions = (suppliers || []).map((s: { id: number; name: string }) => ({ label: s.name, value: s.id }));

  return (
    <BaseTabPanel 
      form={form} 
      title="Temel Araç Kayıt Bilgileri" 
      breadcrumb={["Araç", "Temel Kayıt"]} 
      columns={3}
    >
            
      <FormFieldGroup title="Temel Bilgiler">
        <FormController
          form={form}
          name="branch_id"
          label="Ruhsat Sahibi Firma"
          fieldType="select"
          placeholder="Ruhsat Sahibi Firma seçin"
          options={branchOptions}
          disabled={loadingBranches}
        />
        
        <FormController
          form={form}
          name="chassis_number"
          label="Şasi Numarası"
          fieldType="input"
          placeholder="Şasi numarası girin"
          required
        />
        
        <FormController
          form={form}
          name="tsb_code"
          label="TSB Kodu"
          fieldType="input"
          placeholder="TSB kodu girin"
        />
      </FormFieldGroup>
            
      <FormFieldGroup title="Satın Alma Bilgileri">
        <FormController
          form={form}
          name="supplier_id"
          label="Tedarikçi"
          fieldType="select"
          placeholder="Tedarikçi seçin"
          options={supplierOptions}
          disabled={loadingSuppliers}
        />
        
        <FormController
          form={form}
          name="purchase_price"
          label="Satın Alma Fiyatı"
          fieldType="input"
          type="number"
          placeholder="Fiyat girin"
          inputMode="decimal"
        />
        
        <FormController
          form={form}
          name="invoice_date"
          label="Fatura Tarihi"
          fieldType="date"
        />
      </FormFieldGroup>
      
      <FormFieldGroup title="Durum Bilgileri">
        <FormController
          form={form}
          name="vehicle_status_id"
          label="Araç Durumu"
          fieldType="select"
          placeholder="Durum seçin"
          options={vehicleStatusOptions}
          disabled={statusesLoading}
          required
        />
      </FormFieldGroup>
    </BaseTabPanel>
  );
};

export default VehicleBasicInfoTab;
