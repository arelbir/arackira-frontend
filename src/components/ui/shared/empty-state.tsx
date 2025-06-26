"use client";

import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'warning' | 'info';
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className = "",
  variant = 'default'
}: EmptyStateProps) {
  // Variant renklerini belirle
  const variantClasses = {
    default: "text-muted-foreground",
    warning: "text-yellow-700 dark:text-yellow-200",
    info: "text-blue-700 dark:text-blue-200"
  };

  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${variantClasses[variant]} ${className}`}>
      {icon && <div className="mb-4">{icon}</div>}
      <div className="text-lg font-medium mb-1">{title}</div>
      <div className="text-sm">{description}</div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
