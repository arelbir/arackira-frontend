import React from 'react';
import { FieldError } from 'react-hook-form';

import { Input } from "@/components/ui/input";

interface FormInputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

const FormInputField: React.FC<FormInputFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  disabled,
  helperText,
  required,
  icon
}) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium mb-1">
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
    <div className={
      [
        "relative group",
        error ? "has-error" : ""
      ].join(" ")
    }>
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center">
          {icon}
        </span>
      )}
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
        className={[
          icon ? "pl-10" : "",
          error ? "border-destructive focus:border-destructive focus:ring-destructive" : "",
          "transition-colors duration-150",
          "focus:bg-accent/50 dark:focus:bg-muted/60"
        ].join(" ")}
      />
    </div>
    {helperText && (
      <span id={`${name}-helper`} className="text-xs text-muted-foreground block mt-1">
        {helperText}
      </span>
    )}
    {error && (
      <span id={`${name}-error`} className="text-xs text-destructive block mt-1">
        {error.message}
      </span>
    )}
  </div>
);

export default FormInputField;
