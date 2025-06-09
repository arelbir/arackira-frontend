import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface BaseTabPanelProps {
  form: any;
  title?: string;
  breadcrumb: string[];
  children: React.ReactNode;
  columns?: number; // Grid sütun sayısı
  action?: React.ReactNode; // Header bölümünde gösterilecek aksiyon butonu veya diğer UI elementleri
}

export const BaseTabPanel = ({ 
  form, 
  title, 
  breadcrumb, 
  children, 
  columns = 3,
  action
}: BaseTabPanelProps) => {
  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h2 className="text-xl font-semibold">{title}</h2>
          )}
          {action && (
            <div className="flex-shrink-0">{action}</div>
          )}
        </div>
        
        <nav className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="breadcrumb">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="mx-1">/</span>}
              <span>{item}</span>
            </React.Fragment>
          ))}
        </nav>
            
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default BaseTabPanel;
