"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSelectField } from "@/components/ui/form-select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useVehicleForm } from "../context/VehicleCreateProvider";
import { CreateTabContent } from "../TabNavigator";
import { Controller } from "react-hook-form";

export function GPSTab() {
  const { form, vehicleId } = useVehicleForm();
  const { control, formState: { errors } } = form;

  if (!vehicleId) {
    return (
      <CreateTabContent value="gps">
        <div className="flex flex-col items-center justify-center py-16 text-center text-yellow-700 dark:text-yellow-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-12 mb-4 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C7 4 2 6 2 11v5a2 2 0 002 2h16a2 2 0 002-2v-5c0-5-5-7-10-9zm0 0v2m0 0c2.5 1 5 2 5 7v5" /></svg>
          <div className="text-lg font-medium mb-1">GPS kaydı eklemek için önce taslak araç oluşturmalısınız.</div>
          <div className="text-sm">"Taslak Kaydet" butonunu kullanarak önce aracı kaydedin.</div>
        </div>
      </CreateTabContent>
    );
  }

  return (
    <CreateTabContent value="gps">
      <Card>
        <CardHeader>
          <CardTitle>Uydu Takip (GPS)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Zorunlu Alanlar */}
          <div>
            <FormSelectField
              control={control}
              name="gps_tracking_status"
              label="GPS Takip Cihazı Var mı?"
              required
              options={[
                { value: "true", label: "Evet" },
                { value: "false", label: "Hayır" }
              ]}
            />
            {errors.gps_tracking_status && <p className="text-xs text-red-500 mt-1">{String(errors.gps_tracking_status.message)}</p>}
          </div>
          <div>
            <FormInput control={control} name="device_model" label="Cihaz Modeli" required />
            {errors.device_model && <p className="text-xs text-red-500 mt-1">{String(errors.device_model.message)}</p>}
          </div>
          <div>
            <FormInput control={control} name="installation_date" label="Montaj Tarihi" type="date" required />
            {errors.installation_date && <p className="text-xs text-red-500 mt-1">{String(errors.installation_date.message)}</p>}
          </div>
          <div>
            <FormInput control={control} name="sim_number" label="SIM Kart No" required />
            {errors.sim_number && <p className="text-xs text-red-500 mt-1">{String(errors.sim_number.message)}</p>}
          </div>
          {/* Opsiyonel Alanlar Accordion */}
          <Accordion type="single" collapsible className="mb-2">
            <AccordionItem value="opsiyonel">
              <AccordionTrigger>Ek Bilgiler (Opsiyonel)</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormInput control={control} name="device_serial_number" label="Seri Numarası" />
                    {errors.device_serial_number && <p className="text-xs text-red-500 mt-1">{String(errors.device_serial_number.message)}</p>}
                  </div>
                  <div>
                    <FormInput control={control} name="service_provider" label="Servis Sağlayıcı" />
                    {errors.service_provider && <p className="text-xs text-red-500 mt-1">{String(errors.service_provider.message)}</p>}
                  </div>
                  <div>
                    <FormInput control={control} name="subscription_start" label="Abonelik Başlangıç" type="date" />
                    {errors.subscription_start && <p className="text-xs text-red-500 mt-1">{String(errors.subscription_start.message)}</p>}
                  </div>
                  <div>
                    <FormInput control={control} name="subscription_end" label="Abonelik Bitiş" type="date" />
                    {errors.subscription_end && <p className="text-xs text-red-500 mt-1">{String(errors.subscription_end.message)}</p>}
                  </div>
                  <div>
                    <FormInput control={control} name="installation_location" label="Montaj Lokasyonu" />
                    {errors.installation_location && <p className="text-xs text-red-500 mt-1">{String(errors.installation_location.message)}</p>}
                  </div>
                  <div>
                    <FormInput control={control} name="description" label="Açıklama" />
                    {errors.description && <p className="text-xs text-red-500 mt-1">{String(errors.description.message)}</p>}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div>
            <FormInput control={control} name="description" label="Açıklama" />
            {errors.description && <p className="text-xs text-red-500 mt-1">{String(errors.description.message)}</p>}
          </div>
        </CardContent>
      </Card>
    </CreateTabContent>
  );
}

export default GPSTab;
