import React from 'react';
import {
  FormControl,
  FormLabel,
  FormDescription,
  FormMessage,
  FormItem,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface FormTextareaFieldProps {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

export const FormTextareaField: React.FC<FormTextareaFieldProps> = ({
  control,
  name,
  label,
  placeholder,
  description,
  required = false,
  disabled = false,
  rows = 3,
}) => {
  return (
    <FormItem>
      {label && (
        <FormLabel>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </FormLabel>
      )}
      <FormControl>
        <Textarea
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          {...control.register(name)}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};

export default FormTextareaField;
