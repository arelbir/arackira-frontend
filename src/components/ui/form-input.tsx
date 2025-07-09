"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface FormInputProps<TForm extends FieldValues> {
  control: Control<TForm>;
  name: FieldPath<TForm>;
  label: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  required?: boolean;
  step?: string | number;
}

export function FormInput<TForm extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  required,
  step,
}: FormInputProps<TForm>) {
  return (
    <FormField
      control={control as unknown as Control<FieldValues>}
      name={name as unknown as FieldPath<FieldValues>}
      rules={required ? { required: true } : undefined}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required ? " *" : ""}</FormLabel>
          <FormControl>
            <Input
  {...field}
  type={type}
  placeholder={placeholder ?? label}
  step={step}
  value={field.value ?? ""}
/>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
