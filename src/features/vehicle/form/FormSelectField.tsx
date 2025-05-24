import React from 'react';
import { FieldError } from 'react-hook-form';

interface Option {
  label: string;
  value: string | number;
}

interface FormSelectFieldProps {
  label: string;
  name: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
}

const FormSelectField: React.FC<FormSelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  placeholder,
  disabled
}) => (
  <div className="mb-3">
    <label htmlFor={name} className="block text-sm font-medium mb-1">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value === undefined || value === null ? '' : value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full rounded border px-3 py-2 text-sm outline-none ${error ? 'border-red-500' : 'border-gray-300'}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <span className="text-xs text-red-500">{error.message}</span>}
  </div>
);

export default FormSelectField;
