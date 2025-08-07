"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SearchableSelect } from "@/components/ui/searchable-select";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface FormSelectFieldProps<TForm extends FieldValues> {
  control: Control<TForm>;
  name: FieldPath<TForm>;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function FormSelectField<TForm extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  required,
  disabled,
}: FormSelectFieldProps<TForm>) {
  return (
    <FormField
      control={control}
      name={name}
      rules={{ required }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && " *"}</FormLabel>
          <FormControl>
            <SearchableSelect
              options={options}
              value={field.value ? String(field.value) : undefined}
              onChange={(value) => {
                const numericValue = value ? Number(value) : null;
                field.onChange(numericValue);
              }}
              placeholder={placeholder}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
