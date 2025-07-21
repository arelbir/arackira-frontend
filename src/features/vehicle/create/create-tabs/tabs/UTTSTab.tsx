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

export function UttsTab() {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ürün Takip Sistemi Bilgileri</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="purchase_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Satın Alım Tarihi</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value ?? undefined}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="installation_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Montaj Tarihi</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value ?? undefined}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="utts_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UTTS Kodu</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} placeholder="UTTS Kodu" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
