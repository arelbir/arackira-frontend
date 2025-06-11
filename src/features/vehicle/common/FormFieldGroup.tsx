import React from "react";

interface FormFieldGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  columns?: number; // İçerik grid sütun sayısı
}

export const FormFieldGroup = ({ 
  title, 
  description, 
  children,
  columns = 1
}: FormFieldGroupProps) => (
  <div className="space-y-4 mb-6">
    {title && (
      <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
    )}
    
    {description && (
      <p className="text-xs text-muted-foreground">{description}</p>
    )}
    
    <div className={`grid grid-cols-1 ${columns > 1 ? `md:grid-cols-${columns}` : ''} gap-4`}>
      {children}
    </div>
  </div>
);

export default FormFieldGroup;
