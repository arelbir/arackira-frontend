"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useVehicleForm } from "../context/VehicleCreateProvider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useSWR from "swr";
import { apiFetcher } from "@/lib/api";
import { CreateTabContent } from "../TabNavigator";
import { Input } from '@/components/ui/input';

function useLookup<T = { id: number; name: string }>(key: string) {
  const { data, error, isLoading } = useSWR<T[]>([key], apiFetcher);
  return { data, error, isLoading };
}

export function BasicTab() {
  const { form, vehicleId } = useVehicleForm();
  const { register, watch, resetField, control, formState: { errors } } = form;
  const { data: transmissions, error: transmissionsError, isLoading: transmissionsLoading } = useLookup('/api/transmissions');

  // HGS alanı: tekil form alanı olarak
  return (
    <CreateTabContent value="basic">
      {/* HGS Inline Formu (Tekil) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>HGS Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end mb-4">
            <FormField
              control={control}
              name={`hgsList.0.hgs_tag_no`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Etiket No</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Etiket No" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`hgsList.0.hgs_place`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Alındığı Yer</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Alındığı Yer" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`hgsList.0.hgs_vehicle_class`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Araç Sınıfı</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Araç Sınıfı" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </CreateTabContent>
  );
}
