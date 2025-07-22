"use client";

import { useFormContext } from "react-hook-form";
import { useLookupData } from "@/features/vehicle/hooks/useLookupData";
import { VehicleFormValues } from "@/features/vehicle/schemas";
import { Input } from "@/components/ui/input";
import { FormSelectField } from "@/components/ui/form-select";
import { DatePicker } from "@/components/ui/date-picker";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface InsuranceFormProps {
  index: number;
  isEditing?: boolean;
}

export const InsuranceForm: React.FC<InsuranceFormProps> = ({ index, isEditing = true }) => {
  const { control } = useFormContext<VehicleFormValues>();
  const { insuranceTypes, insuranceCompanies, currencies } = useLookupData();

  return (
    <div className="space-y-6">
      {/* Important Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelectField
            control={control}
            name={`insurances.${index}.insurance_type_id`}
            label="Sigorta Tipi"
            options={insuranceTypes.map(type => ({ value: String(type.id), label: type.name }))}
            disabled={!isEditing}
          />
          <FormSelectField
            control={control}
            name={`insurances.${index}.insurance_company_id`}
            label="Sigorta Şirketi"
            options={insuranceCompanies.map(company => ({ value: String(company.id), label: company.name }))}
            disabled={!isEditing}
          />
          <FormField
            control={control}
            name={`insurances.${index}.start_date`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Başlangıç Tarihi</FormLabel>
                <FormControl>
                  <DatePicker date={field.value ?? undefined} onChange={field.onChange} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`insurances.${index}.end_date`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bitiş Tarihi</FormLabel>
                <FormControl>
                  <DatePicker date={field.value ?? undefined} onChange={field.onChange} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`insurances.${index}.policy_number`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poliçe Numarası</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} disabled={!isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Optional Fields */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="optional-fields">
          <AccordionTrigger>Diğer Detaylar</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <FormField
                control={control}
                name={`insurances.${index}.tramer`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tramer</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`insurances.${index}.total_amount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tutar</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value ?? ''} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSelectField
                control={control}
                name={`insurances.${index}.currency`}
                label="Para Birimi"
                options={currencies.map(c => ({ value: String(c.id), label: c.name }))}
                disabled={!isEditing}
              />
              <FormField
                control={control}
                name={`insurances.${index}.description`}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Açıklama</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};


