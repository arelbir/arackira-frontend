"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import { Skeleton } from '@/components/ui/skeleton';

interface FormSelectProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  skeletonProps?: React.ComponentProps<'div'>;
  id?: string;
}

export function FormSelect({
  options,
  value,
  onChange,
  onBlur,
  placeholder,
  loading,
  skeletonProps,
  disabled,
  id,
}: FormSelectProps) {
  return loading ? (
    <Skeleton className="h-10 w-full mb-2" {...skeletonProps} />
  ) : (
    <SearchableSelect
      id={id}
      options={options}
      value={value !== undefined ? String(value) : undefined}
      placeholder={placeholder}
      onChange={val => {
        console.log('[FormSelect] onChange:', val);
        onChange(val);
      }}
      disabled={disabled}
    />
  );
}

export function FormSelectField({ control, name, label, options, loading, error, placeholder, disabled, helperText, value, onChange }: any) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }: any) => (
        <FormItem>
          <FormLabel htmlFor={field.id}>{label}</FormLabel>
          <FormControl>
            <FormSelect
              {...field}
              id={field.id}
              value={typeof value !== 'undefined' ? value : (field.value !== undefined && field.value !== null ? String(field.value) : '')}
              onChange={typeof onChange === 'function' ? onChange : field.onChange}
              options={options}
              loading={loading}
              disabled={disabled}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
          {error && <p className="text-xs text-red-500 mt-1">{String(error)}</p>}
          {disabled && helperText && <p className="text-xs text-muted-foreground mt-1">{helperText}</p>}
        </FormItem>
      )}
    />
  );
}
