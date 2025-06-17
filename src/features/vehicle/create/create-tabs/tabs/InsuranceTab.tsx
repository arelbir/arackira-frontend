"use client";


import { FormInput } from "@/components/ui/form-input";
import { FormSelect, FormSelectField } from "@/components/ui/form-select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { useVehicleForm } from "../context/VehicleCreateProvider";
import { CreateTabContent } from "../TabNavigator";


import { useFieldArray } from "react-hook-form";
import useSWR from "swr";
import { apiFetcher } from "@/lib/api";

function InsuranceFormFields({ control, index, remove, errors, lookups }: any) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sigorta Kaydı {index + 1}</CardTitle>
        <button type="button" onClick={() => remove(index)} className="text-red-500 text-xs">Sil</button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <FormSelectField
            control={control}
            name={`insurances.${index}.insurance_type_id`}
            label="Sigorta Türü *"
            options={lookups.insuranceTypes}
            required
          />
          <FormInput
            control={control}
            name={`insurances.${index}.start_date`}
            label="Başlangıç Tarihi *"
            type="date"
            required
          />
          <FormInput
            control={control}
            name={`insurances.${index}.policy_date`}
            label="Poliçe Tarihi *"
            type="date"
            required
          />
          <FormInput
            control={control}
            name={`insurances.${index}.end_date`}
            label="Bitiş Tarihi *"
            type="date"
            required
          />
        </div>
        <Accordion type="single" collapsible defaultValue={undefined} className="mb-2">
          <AccordionItem value="opsiyonel">
            <AccordionTrigger>Ek Bilgiler (Opsiyonel)</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelectField
                  control={control}
                  name={`insurances.${index}.insurance_company_id`}
                  label="Sigorta Şirketi"
                  options={lookups.insuranceCompanies}
                />
                <FormSelectField
                  control={control}
                  name={`insurances.${index}.agency_id`}
                  label="Acenta"
                  options={lookups.agencies}
                />
                <FormInput
                  control={control}
                  name={`insurances.${index}.policy_number`}
                  label="Poliçe No"
                />
                <FormInput
                  control={control}
                  name={`insurances.${index}.tramer`}
                  label="Tramer"
                />
                <FormInput
                  control={control}
                  name={`insurances.${index}.agency_number`}
                  label="Acenta No"
                />
                <FormInput
                  control={control}
                  name={`insurances.${index}.amount`}
                  label="Tutar"
                  type="number"
                  step="0.01"
                />
                <FormInput
                  control={control}
                  name={`insurances.${index}.tax_rate`}
                  label="Vergi Oranı (%)"
                  type="number"
                  step="0.01"
                />
                <FormInput
                  control={control}
                  name={`insurances.${index}.tax_amount`}
                  label="Vergi Tutarı"
                  type="number"
                  step="0.01"
                />
                <FormInput
                  control={control}
                  name={`insurances.${index}.total_amount`}
                  label="Toplam Tutar"
                  type="number"
                  step="0.01"
                />
                <FormSelectField
                  control={control}
                  name={`insurances.${index}.currency`}
                  label="Para Birimi"
                  options={lookups.currencies}
                />
                <FormInput
                  control={control}
                  name={`insurances.${index}.installment_count`}
                  label="Taksit Sayısı"
                  type="number"
                />
                <FormSelectField
                  control={control}
                  name={`insurances.${index}.payment_type_id`}
                  label="Ödeme Türü"
                  options={lookups.paymentTypes}
                />
                <FormSelectField
                  control={control}
                  name={`insurances.${index}.payment_account_id`}
                  label="Ödeme Hesabı"
                  options={lookups.paymentAccounts}
                />
                <div className="col-span-2 flex items-center gap-2">
                  <input type="checkbox" {...control.register(`insurances.${index}.create_payment_record`)} id={`create_payment_record_${index}`} />
                  <label htmlFor={`create_payment_record_${index}`}>Ödeme Kaydı Oluştur</label>
                </div>
                <div className="col-span-2">
                  <FormInput
                    control={control}
                    name={`insurances.${index}.description`}
                    label="Açıklama"
                    type="text"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

export function InsuranceTab() {
  const { form, vehicleId } = useVehicleForm();
  const { control, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "insurances" });

  // Lookup verileri
  const { data: insuranceTypes } = useSWR("/api/insurance-types", apiFetcher);
  const { data: insuranceCompanies } = useSWR("/api/insurance-companies", apiFetcher);
  const { data: agencies } = useSWR("/api/agencies", apiFetcher);
  const { data: currencies } = useSWR("/api/currencies", apiFetcher);
  const { data: paymentTypes } = useSWR("/api/payment-types", apiFetcher);
  const { data: paymentAccounts } = useSWR("/api/payment-accounts", apiFetcher);

  const lookups = {
    insuranceTypes: (insuranceTypes ?? []).map((x: any) => ({ value: String(x.id), label: x.name })),
    insuranceCompanies: (insuranceCompanies ?? []).map((x: any) => ({ value: String(x.id), label: x.name })),
    agencies: (agencies ?? []).map((x: any) => ({ value: String(x.id), label: x.name })),
    currencies: (currencies ?? []).map((x: any) => ({ value: String(x.id), label: x.code })),
    paymentTypes: (paymentTypes ?? []).map((x: any) => ({ value: String(x.id), label: x.name })),
    paymentAccounts: (paymentAccounts ?? []).map((x: any) => ({ value: String(x.id), label: x.name })),
  };

  if (!vehicleId) {
    return (
      <CreateTabContent value="insurance">
        <div className="flex flex-col items-center justify-center py-16 text-center text-yellow-700 dark:text-yellow-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-12 mb-4 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C7 4 2 6 2 11v5a2 2 0 002 2h16a2 2 0 002-2v-5c0-5-5-7-10-9zm0 0v2m0 0c2.5 1 5 2 5 7v5" /></svg>
          <div className="text-lg font-medium mb-1">Sigorta kaydı eklemek için önce taslak araç oluşturmalısınız.</div>
          <div className="text-sm">"Taslak Kaydet" butonunu kullanarak önce aracı kaydedin.</div>
        </div>
      </CreateTabContent>
    );
  }

  return (
    <CreateTabContent value="insurance">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Sigorta Kayıtları</h2>
        <Button
          type="button"
          variant="default"
          size="lg"
          onClick={() => append({ insurance_type_id: -1, start_date: '', policy_date: '', end_date: '' })}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="size-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Sigorta Ekle
        </Button>
      </div>
      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-12 mb-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C7 4 2 6 2 11v5a2 2 0 002 2h16a2 2 0 002-2v-5c0-5-5-7-10-9zm0 0v2m0 0c2.5 1 5 2 5 7v5" /></svg>
          <div className="text-lg font-medium mb-1">Henüz sigorta kaydı yok</div>
          <div className="text-sm">Yeni bir sigorta eklemek için yukarıdaki butonu kullanın.</div>
        </div>
      ) : (
        <div className="space-y-6">
          {fields.map((field, index) => {
            // Sigorta tipi ve tarih özetini bul
            const typeLabel = lookups.insuranceTypes.find((x: any) => String(x.value) === String(field.insurance_type_id))?.label || `#${index+1}`;
            const start = field.start_date || '';
            const end = field.end_date || '';
            return (
              <Card key={field.id} className="relative">
                <div className="flex items-center justify-between px-6 pt-6 pb-2">
                  <div className="font-semibold text-base">
                    {typeLabel} {start && end ? <span className="text-muted-foreground font-normal">({start} - {end})</span> : null}
                  </div>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 p-1 rounded-full transition-colors"
                    aria-label="Sigorta kaydını sil"
                    onClick={() => remove(index)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="px-6 pb-6">
                  <InsuranceFormFields
                    control={control}
                    index={index}
                    remove={remove}
                    errors={errors}
                    lookups={lookups}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </CreateTabContent>
  );
}
