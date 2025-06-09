import React from 'react';
import {
  FormControl,
  FormLabel,
  FormDescription,
  FormMessage,
  FormItem,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

interface FormCheckboxFieldProps {
  control: any;
  name: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const FormCheckboxField: React.FC<FormCheckboxFieldProps> = ({
  control,
  name,
  label,
  description,
  disabled = false,
}) => {
  return (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-1">
      <FormControl>
        <Checkbox
          disabled={disabled}
          {...control.register(name)}
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        {label && <FormLabel>{label}</FormLabel>}
        {description && <FormDescription>{description}</FormDescription>}
      </div>
      <FormMessage />
    </FormItem>
  );
};

export default FormCheckboxField;
