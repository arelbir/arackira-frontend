'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { ClientCompanyFormValues } from '../schemas/client.schema';

interface AddressFormProps {
  index: number;
}

export function AddressForm({ index }: AddressFormProps) {
  const { control } = useFormContext<ClientCompanyFormValues>();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`addresses.${index}.address_title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adres Başlığı</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Örn: İş Adresi" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`addresses.${index}.street`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sokak</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Sokak ve kapı no" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`addresses.${index}.city`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Şehir</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Şehir" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`addresses.${index}.state`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>İlçe / Eyalet</FormLabel>
            <FormControl>
              <Input {...field} placeholder="İlçe / Eyalet" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`addresses.${index}.postal_code`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Posta Kodu</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Posta Kodu" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`addresses.${index}.country`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ülke</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ülke" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
