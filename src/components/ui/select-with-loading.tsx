"use client";

import { Spinner } from "@/components/ui/spinner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface SelectWithLoadingProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  error?: string;
  isLoading?: boolean;
}

export function SelectWithLoading({
  value,
  onChange,
  placeholder,
  options = [],
  disabled,
  error,
  isLoading,
}: SelectWithLoadingProps) {
  return (
    <div className="relative">
      <Select
        value={value ? String(value) : ""}
        onValueChange={onChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className={error ? "border-destructive" : ""}>
          {isLoading ? (
            <span className="text-muted-foreground">Yükleniyor...</span>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {isLoading && (
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <Spinner size="sm" />
        </div>
      )}
      
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}
