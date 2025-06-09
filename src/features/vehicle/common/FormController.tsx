import React from "react";
import { Controller } from "react-hook-form";
import FormInputField from "../form/FormInputField";
import FormSelectField from "../form/FormSelectField";
import FormDateField from "../form/FormDateField";
import FormTextareaField from "../form/FormTextareaField";
import FormCheckboxField from "../form/FormCheckboxField";
import { SelectWithLoading } from "@/components/ui/select-with-loading";

type FieldType = "input" | "select" | "date" | "textarea" | "checkbox" | "file";

interface FormControllerProps {
  form: any;
  name: string;
  label: string;
  fieldType: FieldType;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
  isLoading?: boolean; // Veri yükleniyor mu?
  [key: string]: any; // Diğer komponente geçirilecek props'lar
}

export const FormController = ({
  form,
  name,
  label,
  fieldType,
  required = false,
  disabled = false,
  placeholder = "",
  options = [],
  isLoading = false,
  ...rest
}: FormControllerProps) => {
  return (
    <Controller
      control={form.control}
      name={name}
      rules={required ? { required: `${label} alanı zorunludur` } : undefined}
      render={({ field, fieldState }) => {
        const { error } = fieldState;
        const commonProps = {
          ...field,
          label,
          error,
          required,
          disabled,
          placeholder,
          ...rest,
        };

        switch (fieldType) {
          case "input":
            return <FormInputField {...commonProps} />;
          case "select":
            // React Query ile bağımlı sorgu durumunda loading gösterimi için
            if (process.env.NODE_ENV !== 'production' && isLoading) {
              console.log(`Select field ${name} is loading...`);
            }
            
            // SelectWithLoading bileşeni ile yükleme durumu gösterimi
            return (
              <div className="mb-3">
                <label htmlFor={name} className="block text-sm font-medium mb-1 dark:text-gray-200">
                  {label}
                </label>
                <SelectWithLoading
                  value={field.value === undefined || field.value === null ? '' : String(field.value)}
                  onChange={field.onChange}
                  options={options}
                  error={error?.message}
                  isLoading={isLoading}
                  disabled={disabled}
                  placeholder={placeholder || `${label} seçin`}
                />
              </div>
            );
            
            // Legacy FormSelectField, isterseniz geri dönebilirsiniz
            // return (
            //  <FormSelectField
            //    {...commonProps}
            //    options={options}
            //  />
            // );
          case "date":
            return <FormDateField {...commonProps} />;
          case "textarea":
            return <FormTextareaField control={form.control} {...commonProps} />;
          case "checkbox":
            return <FormCheckboxField control={form.control} {...commonProps} />;
          case "file":
            // Dosya yükleme bileşeni implemente edilecek
            return <div>File upload component to be implemented</div>;
          default:
            return <FormInputField {...commonProps} />;
        }
      }}
    />
  );
};

export default FormController;
