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
  <div className="mb-3" data-component-name="FormSelectField">
    <label htmlFor={name} className="block text-sm font-medium mb-1 dark:text-gray-200" data-component-name="FormSelectField">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value === undefined || value === null ? '' : value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full rounded border px-3 py-2 text-sm outline-none 
        ${error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}
        dark:bg-gray-800 dark:text-gray-200
        disabled:opacity-70 disabled:cursor-not-allowed
      `}
      data-component-name="FormSelectField"
    >
      {placeholder && <option value="" className="dark:bg-gray-800 dark:text-gray-200">{placeholder}</option>}
      {options.map((opt, index) => (
        <option key={`${opt.value}-${index}`} value={opt.value} className="dark:bg-gray-800 dark:text-gray-200">
          {opt.label}
        </option>
      ))}
    </select>
    {error && <span className="text-xs text-red-500 dark:text-red-400">{error.message}</span>}
  </div>
);

export default FormSelectField;
