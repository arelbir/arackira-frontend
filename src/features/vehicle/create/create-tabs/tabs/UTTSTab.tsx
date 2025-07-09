"use client";

import { FormInput } from "@/components/ui/form-input";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useVehicleForm } from "../context/VehicleCreateProvider";
import { CreateTabContent } from "../TabNavigator";
import { Controller } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export function UttsTab() {
  const { form, vehicleId } = useVehicleForm();
  const { control, formState: { errors } } = form;

  if (!vehicleId) {
    return (
      <CreateTabContent value="utts">
        <div className="flex flex-col items-center justify-center py-16 text-center text-yellow-700 dark:text-yellow-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-12 mb-4 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C7 4 2 6 2 11v5a2 2 0 002 2h16a2 2 0 002-2v-5c0-5-5-7-10-9zm0 0v2m0 0c2.5 1 5 2 5 7v5" /></svg>
          <div className="text-lg font-medium mb-1">UTTS kaydı eklemek için önce taslak araç oluşturmalısınız.</div>
          <div className="text-sm">"Taslak Kaydet" butonunu kullanarak önce aracı kaydedin.</div>
        </div>
      </CreateTabContent>
    );
  }

  return (
    <CreateTabContent value="utts">
      <Card>
        <CardHeader>
          <CardTitle>Ürün Takip Sistemi Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Controller
              control={control}
              name="purchase_date"
              render={({ field }) => (
                <FormField
                  control={control}
                  name="purchase_date"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Satın Alım Tarihi</FormLabel>
                      <FormControl>
                      <DatePicker
                        date={value ? new Date(value) : undefined}
                        onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')}
                        {...fieldProps}
                      />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            />

            <Controller
              control={control}
              name="installation_date"
              render={({ field }) => (
                <FormField
                  control={control}
                  name="installation_date"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Montaj Tarihi</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={value ? new Date(value) : undefined}
                          onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')}
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            />

            <FormInput
              control={control}
              name="utts_code"
              label="UTTS Kodu"
              placeholder="UTTS kodunu giriniz"
              required
            />
          </div>
        </CardContent>
      </Card>
    </CreateTabContent>
  );
}
