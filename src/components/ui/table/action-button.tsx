'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  icon?: React.ReactNode;
  isLoading?: boolean;
  loadingIcon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Yeniden kullanılabilir aksiyon butonu
 * DRY prensibine göre ortak buton yapısını soyutlar
 */
export function ActionButton({
  variant = 'default',
  size = 'sm',
  icon,
  isLoading = false,
  loadingIcon = <Loader2 className="h-4 w-4 animate-spin" />,
  children,
  className,
  ...props
}: ActionButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('flex items-center gap-1', className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? loadingIcon : icon}
      <span>{children}</span>
    </Button>
  );
}
