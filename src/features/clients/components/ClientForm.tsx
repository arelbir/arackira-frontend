import { useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ClientCompanyFormValues, useClientForm } from '../hooks/useClientForm';
import { Button } from '@/components/ui/button';

interface ClientFormProps {
  initial?: Partial<ClientCompanyFormValues>;
  onSubmit: (values: ClientCompanyFormValues) => void;
  disabled?: boolean;
}

import { useAllClientTypes } from '@/features/definitions/client-types/use-client-types';
import { useClients } from '@/features/clients/hooks/useClients';
import { FormSelectField } from '@/components/ui/form-select';

export function ClientForm({ initial, onSubmit, disabled }: ClientFormProps) {
  // Müşteri Tipi ve Ana Şirket seçeneklerini çek
  const { data: clientTypes, isLoading: clientTypesLoading } = useAllClientTypes();
  const { clients: parentCompanies, isLoading: parentCompaniesLoading } = useClients();

  const form = useClientForm({
    ...initial,
    client_type_id: initial?.client_type_id ?? null,
    parent_company_id: initial?.parent_company_id ?? null,
  });

  // Ana şirket selectinde kendisini hariç tut
  const filteredParentCompanies = initial?.parent_company_id
    ? (parentCompanies || []).filter((c: any) => c.id !== initial.parent_company_id)
    : parentCompanies || [];

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'addresses',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={form.control}
        name="company_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Şirket Adı</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ''} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contact_person"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Yetkili</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ''} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-posta</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ''} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefon</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ''} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Müşteri Tipi ve Ana Şirket Selectleri */}
      <FormSelectField
        control={form.control}
        name="client_type_id"
        label="Müşteri Tipi"
        options={(clientTypes || []).map((type: any) => ({
          value: String(type.id),
          label: type.name,
        }))}
        loading={clientTypesLoading}
        error={form.formState.errors.client_type_id?.message}
        placeholder="Müşteri tipi seçin"
        disabled={disabled || clientTypesLoading}
        onChange={(val: string) => form.setValue('client_type_id', val === '' ? null : Number(val))}
        value={form.watch('client_type_id') === null || form.watch('client_type_id') === undefined ? '' : String(form.watch('client_type_id'))}
      />
      <FormSelectField
        control={form.control}
        name="parent_company_id"
        label="Ana Şirket"
        options={(filteredParentCompanies || []).map((c: any) => ({
          value: String(c.id),
          label: c.company_name,
        }))}
        loading={parentCompaniesLoading}
        error={form.formState.errors.parent_company_id?.message}
        placeholder="Ana şirket seçin (opsiyonel)"
        disabled={disabled || parentCompaniesLoading}
        onChange={(val: string) => form.setValue('parent_company_id', val === '' ? null : Number(val))}
        value={form.watch('parent_company_id') === null || form.watch('parent_company_id') === undefined ? '' : String(form.watch('parent_company_id'))}
      />
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Adresler</span>
          <Button type="button" onClick={() => append({ type: '', address: '' })} size="sm" disabled={disabled}>Adres Ekle</Button>
        </div>
        {fields.map((field, idx) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <Input placeholder="Tip" {...form.register(`addresses.${idx}.type`)} className="w-28" disabled={disabled} />
            <Input placeholder="Adres" {...form.register(`addresses.${idx}.address`)} className="flex-1" disabled={disabled} />
            <Input placeholder="Şehir" {...form.register(`addresses.${idx}.city`)} className="w-32" disabled={disabled} />
            <Input placeholder="Ülke" {...form.register(`addresses.${idx}.country`)} className="w-32" disabled={disabled} />
            <Input placeholder="Posta Kodu" {...form.register(`addresses.${idx}.postal_code`)} className="w-24" disabled={disabled} />
            <Input placeholder="Vergi No" {...form.register(`addresses.${idx}.tax_number`)} className="w-32" disabled={disabled} />
            <Button type="button" onClick={() => remove(idx)} size="icon" variant="ghost" disabled={disabled}>Sil</Button>
          </div>
        ))}
      </div>
      <Button type="submit" disabled={disabled || form.formState.isSubmitting}>
        {disabled || form.formState.isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
      </Button>
    </form>
    </Form>
  );
}
