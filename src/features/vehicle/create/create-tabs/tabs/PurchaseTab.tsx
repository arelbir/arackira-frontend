'use client';

'use client';

import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { FormSelectField } from '@/components/ui/form-select';

import { useLookupData } from '@/features/vehicle/hooks/useLookupData';
import { TabContentWrapper } from './components/TabContentWrapper';

export function PurchaseTab() {
  const { control, watch, resetField, getValues } = useFormContext();

  // Hem izlenen değeri (yeni seçim) hem de başlangıç değerini (edit modu) dikkate al
  const watchedBrandId = watch('brand_id');
  const initialBrandId = getValues('brand_id');
  const effectiveBrandId = watchedBrandId || initialBrandId;

  const { brands, models, suppliers, colors, branches, vehicleTypes, fuelTypes, vehicleStatuses, isLoading: isLoadingLookups, isLoadingModels } = useLookupData(effectiveBrandId);

  useEffect(() => {
    // Marka değiştiğinde ve bu bir başlangıç değeri değilse modeli sıfırla
    if (watchedBrandId && watchedBrandId !== initialBrandId) {
      resetField('model_id', { defaultValue: '' });
    }
  }, [watchedBrandId, initialBrandId, resetField]);



  return (
    <TabContentWrapper isEmpty={false} emptyMessage="">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Satınalma ve Fatura Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormSelectField
                control={control}
                name="brand_id"
                label="Marka"
                options={brands?.map((brand: { id: string; name: string }) => ({ value: brand.id.toString(), label: brand.name })) ?? []}
                placeholder="Marka seçiniz"
                disabled={isLoadingLookups}
              />
              <FormSelectField
                control={control}
                name="model_id"
                label="Model"
                options={models?.map((model: { id: string; name: string }) => ({ value: model.id.toString(), label: model.name })) ?? []}
                placeholder="Model seçiniz"
                disabled={!effectiveBrandId || isLoadingLookups || isLoadingModels}
              />
              <FormSelectField
                control={control}
                name="supplier_id"
                label="Satın Alınan Firma"
                options={suppliers?.map((supplier: { id: string; name: string }) => ({ value: supplier.id.toString(), label: supplier.name })) ?? []}
                placeholder="Firma seçiniz"
                disabled={isLoadingLookups}
              />
              <FormField
                control={control}
                name="purchase_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alış Fiyatı</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="0.00" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="invoice_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fatura Tarihi</FormLabel>
                    <DatePicker date={field.value ?? undefined} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diğer Bilgiler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormSelectField
                control={control}
                name="color_id"
                label="Renk"
                options={colors?.map((color: { id: string; name: string }) => ({ value: color.id.toString(), label: color.name })) ?? []}
                placeholder="Renk seçiniz"
                disabled={isLoadingLookups}
              />
              <FormSelectField
                control={control}
                name="branch_id"
                label="Şube"
                options={branches?.map((branch: { id: string; name: string }) => ({ value: branch.id.toString(), label: branch.name })) ?? []}
                placeholder="Şube seçiniz"
                disabled={isLoadingLookups}
              />
              <FormSelectField
                control={control}
                name="vehicle_type_id"
                label="Araç Tipi"
                options={vehicleTypes?.map((type: { id: string; name: string }) => ({ value: type.id.toString(), label: type.name })) ?? []}
                placeholder="Araç tipi seçiniz"
                disabled={isLoadingLookups}
              />
              <FormSelectField
                control={control}
                name="fuel_type_id"
                label="Yakıt Tipi"
                options={fuelTypes?.map((type: { id: string; name: string }) => ({ value: type.id.toString(), label: type.name })) ?? []}
                placeholder="Yakıt tipi seçiniz"
                disabled={isLoadingLookups}
              />
              <FormSelectField
                control={control}
                name="vehicle_status_id"
                label="Araç Durumu"
                options={vehicleStatuses?.map((status: { id: string; name: string }) => ({ value: status.id.toString(), label: status.name })) ?? []}
                placeholder="Araç durumu seçiniz"
                disabled={isLoadingLookups}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </TabContentWrapper>
  );
}
