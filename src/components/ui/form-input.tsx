"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface FormInputProps<TForm extends FieldValues> {
  control: Control<TForm>;
  name: FieldPath<TForm>;
  label: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  required?: boolean;
  step?: string | number;
  disabled?: boolean;
}

export function FormInput<TForm extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  required,
  step,
  disabled,
}: FormInputProps<TForm>) {
  return (
    <FormField
      control={control}
      name={name}
      rules={{ required }}
      render={({ field }) => {
        const value = type === 'number' ? (field.value as number | undefined) ?? '' : (field.value as string | undefined) ?? '';
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const rawValue = e.target.value;
          if (type === 'number') {
            const numValue = rawValue === '' ? null : Number(rawValue);
            field.onChange(numValue);
          } else {
            field.onChange(rawValue);
          }
        };

        return (
          <FormItem>
            <FormLabel>{label}{required && " *"}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type={type}
                placeholder={placeholder ?? label}
                step={step}
                disabled={disabled}
                value={value}
                onChange={handleChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
