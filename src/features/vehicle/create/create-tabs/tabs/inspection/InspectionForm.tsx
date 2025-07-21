"use client";

import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { useLookupData } from "@/features/vehicle/hooks/useLookupData";
import { Button } from "@/components/ui/button";
import { Controller, useFormContext } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
import { INSPECTION_FIELDS } from "./inspection-constants";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

interface InspectionFormProps {
  index: number;
  onClose: () => void;
  onSave: () => void;
}

export function InspectionForm({ index, onClose, onSave }: InspectionFormProps) {
  const { control, formState: { errors } } = useFormContext();
  const { insuranceCompanies, isLoading: isLookupLoading } = useLookupData();

  const companyOptions = (insuranceCompanies || []).map(company => ({
    value: company.id.toString(),
    label: company.name,
  }));

  const resultOptions = [
    { value: "Geçti", label: "Geçti" },
    { value: "Ağır Kusurlu", label: "Ağır Kusurlu" },
    { value: "Hafif Kusurlu", label: "Hafif Kusurlu" },
    { value: "Kaldı", label: "Kaldı" },
  ];

  const getFieldName = (field: string) => `${INSPECTION_FIELDS.BASE}.${index}.${field}`;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  // Form hatalarını izlemek için
  useEffect(() => {
    const fieldErrors = (errors[INSPECTION_FIELDS.BASE as 'inspections'] as any)?.[index] || {};
    if (fieldErrors) {
      console.log(`Muayene formu [${index}] için doğrulama hataları:`, fieldErrors);
    }
  }, [errors, index]);

  return (
    <form onSubmit={handleSave} className="space-y-4 p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Muayene Tarihi */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Muayene Tarihi *</label>
          <Controller
            name={getFieldName(INSPECTION_FIELDS.INSPECTION_DATE)}
            control={control}
            render={({ field, fieldState }) => (
              <>
                <DatePicker
                  date={field.value ? new Date(field.value) : undefined}
                  onChange={(date: Date | undefined) => field.onChange(date?.toISOString().split('T')[0])}
                  placeholder="Tarih Seç"
                />
                {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
              </>
            )}
          />
        </div>

        {/* Geçerlilik Tarihi */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Geçerlilik Tarihi *</label>
          <Controller
            name={getFieldName(INSPECTION_FIELDS.EXPIRY_DATE)}
            control={control}
            render={({ field, fieldState }) => (
              <>
                <DatePicker
                  date={field.value ? new Date(field.value) : undefined}
                  onChange={(date: Date | undefined) => field.onChange(date?.toISOString().split('T')[0])}
                  placeholder="Tarih Seç"
                />
                {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
              </>
            )}
          />
        </div>

        {/* Muayene İstasyonu */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Muayene İstasyonu *</label>
          <Controller
            name={getFieldName(INSPECTION_FIELDS.INSPECTION_COMPANY_ID)}
            control={control}
            render={({ field, fieldState }) => (
              <>
                <FormSelect
                  options={companyOptions}
                  loading={isLookupLoading}
                  placeholder="İstasyon Seç"
                  value={field.value?.toString()}
                  onChange={(value) => field.onChange(parseInt(value, 10))}
                />
                {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
              </>
            )}
          />
        </div>

        {/* Sonuç */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Sonuç</label>
          <Controller
            name={getFieldName(INSPECTION_FIELDS.RESULT)}
            control={control}
            render={({ field, fieldState }) => (
              <>
                <FormSelect
                  options={resultOptions}
                  placeholder="Sonuç Seç"
                  value={field.value}
                  onChange={field.onChange}
                />
                {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
              </>
            )}
          />
        </div>

        {/* Maliyet */}
        <FormInput
          control={control}
          name={getFieldName(INSPECTION_FIELDS.COST)}
          label="Maliyet"
          type="number"
          step="0.01"
          placeholder="0,00"
        />
      </div>

      {/* Açıklama */}
      <div className="flex flex-col">
        <label htmlFor={getFieldName(INSPECTION_FIELDS.DESCRIPTION)} className="mb-1 text-sm font-medium text-gray-700">Açıklama</label>
        <Controller
            name={getFieldName(INSPECTION_FIELDS.DESCRIPTION)}
            control={control}
            render={({ field }) => (
                <Textarea
                    {...field}
                    id={getFieldName(INSPECTION_FIELDS.DESCRIPTION)}
                    placeholder="Muayene ile ilgili ek notlar..."
                    className="min-h-[80px]"
                />
            )}
        />
      </div>


    </form>
  );
}
