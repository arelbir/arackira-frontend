"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useVehicleForm } from "../context/VehicleCreateProvider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useSWR from "swr";
import { apiRequest } from "@/lib/api-client";
import { CreateTabContent } from "../TabNavigator";
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { TransformedHgs } from "@/features/vehicle/utils/data-transformers";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function useLookup<T = { id: number; name: string }>(key: string) {
    const { data, error, isLoading } = useSWR<T[]>([key], (url: string) => apiRequest({ url }));
  return { data, error, isLoading };
}

export function BasicTab() {
  const { form, vehicleId, relatedData, isLoading, editMode } = useVehicleForm();
  const hgs = relatedData?.hgs;
  const { control, setValue } = form;

  // Lookups for dropdowns
  const { data: vehicleTypes } = useLookup('vehicle-types');
  const { data: brands } = useLookup('brands');
  const { data: models } = useLookup('models'); // This might need to be dependent on the selected brand
  const { data: colors } = useLookup('colors');
  const { data: suppliers } = useLookup('suppliers');

  // Effect to populate HGS form data from context or localStorage
  useEffect(() => {
    let hgsData = hgs;
    if ((!hgsData || !Array.isArray(hgsData) || hgsData.length === 0) && typeof window !== 'undefined') {
      try {
        const storedHgsData = localStorage.getItem('vehicle_hgs_data');
        if (storedHgsData) hgsData = JSON.parse(storedHgsData);
      } catch (e) {
        console.warn("⚠️ localStorage HGS read error:", e);
      }
    }

    if (hgsData && Array.isArray(hgsData) && hgsData.length > 0) {
      const currentHgs = hgsData[0];
      setValue('hgsList', [{
        vehicle_id: vehicleId || currentHgs.vehicle_id || 0,
        hgs_tag_no: currentHgs.hgs_tag_no || "",
        hgs_place: currentHgs.hgs_place || "",
        hgs_vehicle_class: currentHgs.hgs_vehicle_class || ""
      }]);
    } else if (!form.getValues('hgsList')) {
      setValue('hgsList', [{
        vehicle_id: vehicleId || 0,
        hgs_place: "",
        hgs_tag_no: "",
        hgs_vehicle_class: ""
      }]);
    }
  }, [hgs, vehicleId, setValue, form]);

  const renderGeneralInfoForm = () => (
    <Card className="mb-6">
      <CardHeader><CardTitle>Genel Bilgiler</CardTitle></CardHeader>
      <CardContent>
        {isLoading && editMode ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={control} name="plate_number" render={({ field }) => (
              <FormItem>
                <FormLabel>Plaka</FormLabel>
                <FormControl><Input {...field} placeholder="Plaka" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name="model_year" render={({ field }) => (
              <FormItem>
                <FormLabel>Model Yılı</FormLabel>
                <FormControl><Input type="number" {...field} placeholder="Model Yılı" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name="chassis_number" render={({ field }) => (
              <FormItem>
                <FormLabel>Şasi Numarası</FormLabel>
                <FormControl><Input {...field} placeholder="Şasi Numarası" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name="engine_number" render={({ field }) => (
              <FormItem>
                <FormLabel>Motor Numarası</FormLabel>
                <FormControl><Input {...field} placeholder="Motor Numarası" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={control} name="vehicle_km" render={({ field }) => (
              <FormItem>
                <FormLabel>KM</FormLabel>
                <FormControl><Input type="number" {...field} placeholder="Kilometre" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={control} name="tsb_code" render={({ field }) => (
              <FormItem>
                <FormLabel>TSB Kodu</FormLabel>
                <FormControl><Input {...field} placeholder="TSB Kodu" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderHgsForm = () => {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>HGS Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          {!hgs || !Array.isArray(hgs) || hgs.length === 0 && isLoading ? (
            // Yükleme durumunda iskelet göster
            <div className="flex gap-4 items-end mb-4">
              <div className="flex-1">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ) : (
            // Form alanlarını göster
            <div className="flex gap-4 items-end mb-4">
              <FormField
                control={control}
                name={`hgsList.0.hgs_tag_no`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Etiket No</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Etiket No" 
                        value={field.value || ""}
                      />
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
                      <Input 
                        {...field} 
                        placeholder="Alındığı Yer" 
                        value={field.value || ""}
                      />
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
                      <Input 
                        {...field} 
                        placeholder="Araç Sınıfı" 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <CreateTabContent value="basic">
      {renderGeneralInfoForm()}
      {renderHgsForm()}
    </CreateTabContent>
  );
}
