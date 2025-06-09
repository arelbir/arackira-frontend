import React from "react";
import { Controller } from "react-hook-form";
import FormDateField from "../form/FormDateField";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  form: any;
}

const VehicleDocumentsTab: React.FC<Props> = ({ form }) => {
  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-x-8 gap-y-8">
          <div>
            <nav className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="breadcrumb">
              <span>Araç</span>
              <span className="mx-1">/</span>
              <span>Belge Bilgileri</span>
            </nav>
            
            {/* İlk Tescil Tarihi */}
            <Controller
              control={form.control}
              name="first_registration_date"
              render={({ field }) => (
                <FormDateField
                  {...field}
                  label="İlk Tescil Tarihi"
                  error={form.formState.errors.first_registration_date}
                  placeholder="İlk tescil tarihi"
                />
              )}
            />
            
            {/* Ruhsat Tarihi */}
            <Controller
              control={form.control}
              name="registration_date"
              render={({ field }) => (
                <FormDateField
                  {...field}
                  label="Ruhsat Tarihi"
                  error={form.formState.errors.registration_date}
                  placeholder="Ruhsat tarihi"
                />
              )}
            />
            
            {/* Muayene Bitiş Tarihi */}
            <Controller
              control={form.control}
              name="inspection_expiry_date"
              render={({ field }) => (
                <FormDateField
                  {...field}
                  label="Muayene Bitiş Tarihi"
                  error={form.formState.errors.inspection_expiry_date}
                  placeholder="Muayene bitiş"
                />
              )}
            />
            
            {/* Sonraki Bakım Tarihi */}
            <Controller
              control={form.control}
              name="next_maintenance_date"
              render={({ field }) => (
                <FormDateField
                  {...field}
                  label="Sonraki Bakım Tarihi"
                  error={form.formState.errors.next_maintenance_date}
                  placeholder="Bakım tarihi"
                />
              )}
            />
            
            {/* Egzoz Pul Bitiş Tarihi */}
            <Controller
              control={form.control}
              name="exhaust_stamp_expiry_date"
              render={({ field }) => (
                <FormDateField
                  {...field}
                  label="Egzoz Pul Bitiş Tarihi"
                  error={form.formState.errors.exhaust_stamp_expiry_date}
                  placeholder="Egzoz pul bitiş"
                />
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleDocumentsTab;
