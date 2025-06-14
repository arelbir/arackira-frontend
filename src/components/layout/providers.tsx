'use client';

import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/context/AuthContext';



// BranchProvider artık React Query ile değiştirildi

import { useTheme } from 'next-themes'; // still needed for ActiveThemeProvider initialTheme
import React from 'react';
import { ActiveThemeProvider } from '../active-theme';
export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();

  return (
    <QueryProvider>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <AuthProvider>                   
          {children}
        </AuthProvider>
      </ActiveThemeProvider>
    </QueryProvider>
  );
}
