
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useClientFormContext } from '../context/ClientFormProvider';
import { AddressManager } from './AddressManager';



import { useAllClientTypes } from '@/features/definitions/client-types/use-client-types';
import { useClients } from '@/features/clients/hooks/useClients';
import { FormSelectField } from '@/components/ui/form-select';

interface ClientFormProps {
  clientId?: string;
}

export function ClientForm({ clientId }: ClientFormProps) {
  // Müşteri Tipi ve Ana Şirket seçeneklerini çek
  const { data: clientTypes, isLoading: clientTypesLoading } = useAllClientTypes();
  const { clients: parentCompanies, isLoading: parentCompaniesLoading } = useClients();

  const form = useClientFormContext();
  const { control, watch, formState: { isSubmitting } } = form;
  const initial = watch(); // Get all form values

  // Ana şirket selectinde kendisini hariç tut
  const filteredParentCompanies = (parentCompanies || []).filter(
    (c: any) => c.id !== Number(clientId)
  );



  const disabled = isSubmitting;

  return (
    <Form {...form}>
      <div className="space-y-4">
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
      <FormField
        control={form.control}
        name="tax_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vergi No</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ''} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Açıklama</FormLabel>
            <FormControl>
              <Textarea {...field} value={field.value ?? ''} disabled={disabled} />
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
        placeholder="Müşteri tipi seçin"
        disabled={disabled || clientTypesLoading}
      />
      <FormSelectField
        control={form.control}
        name="parent_company_id"
        label="Ana Şirket"
        options={(filteredParentCompanies || []).map((c: any) => ({
          value: String(c.id),
          label: c.company_name,
        }))}
        placeholder="Ana şirket seçin (opsiyonel)"
        disabled={disabled || parentCompaniesLoading}
      />
      <AddressManager />
      </div>
    </Form>
  );
}
