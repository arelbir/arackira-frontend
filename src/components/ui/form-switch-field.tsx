"use client";

import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormSwitchFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  className?: string;
  labelPlacement?: 'left' | 'right';
  disabled?: boolean;
}

export function FormSwitchField<T extends FieldValues>({ 
  control, 
  name, 
  label, 
  className,
  labelPlacement = 'right',
  disabled
}: FormSwitchFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className={cn('flex items-center space-x-2', className, {
          'justify-between': labelPlacement === 'left',
        })}>
          {labelPlacement === 'right' ? (
            <>
              <Switch
                id={name}
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
              <Label htmlFor={name}>{label}</Label>
            </>
          ) : (
            <>
              <Label htmlFor={name}>{label}</Label>
              <Switch
                id={name}
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
            </>
          )}
        </div>
      )}
    />
  );
}
