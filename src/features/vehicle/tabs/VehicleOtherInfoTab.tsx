import React from "react";
import { Controller } from "react-hook-form";
import FormDateField from "../form/FormDateField";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  form: any;
}

const VehicleOtherInfoTab: React.FC<Props> = ({ form }) => {
  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-x-8 gap-y-8">
          <div>
            <nav className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="breadcrumb">
              <span>Araç</span>
              <span className="mx-1">/</span>
              <span>Diğer Bilgiler</span>
            </nav>
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
            <Controller
              control={form.control}
              name="insurance_expiry_date"
              render={({ field }) => (
                <FormDateField
                  {...field}
                  label="Trafik Sigorta Bitiş Tarihi"
                  error={form.formState.errors.insurance_expiry_date}
                  placeholder="Sigorta bitiş"
                />
              )}
            />
            <Controller
              control={form.control}
              name="casco_expiry_date"
              render={({ field }) => (
                <FormDateField
                  {...field}
                  label="Kasko Bitiş Tarihi"
                  error={form.formState.errors.casco_expiry_date}
                  placeholder="Kasko bitiş"
                />
              )}
            />
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

export default VehicleOtherInfoTab;
