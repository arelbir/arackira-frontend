'use client';

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
import { TabContentWrapper } from './components/TabContentWrapper';

export function BasicTab() {
  const { control } = useFormContext();

  return (
    <TabContentWrapper isEmpty={false} emptyMessage="">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Genel Bilgiler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={control}
                name="plate_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plaka</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Plaka" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="model_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Yılı</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Model Yılı" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="chassis_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şasi Numarası</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Şasi Numarası" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="engine_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motor Numarası</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Motor Numarası" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="vehicle_km"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KM</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Kilometre" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="tsb_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TSB Kodu</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="TSB Kodu" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="first_registration_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İlk Tescil Tarihi</FormLabel>
                    <FormControl>
                      <DatePicker date={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </TabContentWrapper>
  );
}
