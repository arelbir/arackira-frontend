import React from 'react';
import { FieldError } from 'react-hook-form';

interface FormDateFieldProps {
  label: string;
  name: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
}

const FormDateField: React.FC<FormDateFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  disabled
}) => (
  <div className="mb-3">
    <label htmlFor={name} className="block text-sm font-medium mb-1">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type="date"
      value={value === undefined || value === null ? '' : value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full rounded border px-3 py-2 text-sm outline-none ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <span className="text-xs text-red-500">{error.message}</span>}
  </div>
);

export default FormDateField;
