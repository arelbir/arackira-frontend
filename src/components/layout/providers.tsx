'use client';

import { AuthProvider } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
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
    <ActiveThemeProvider initialTheme={activeThemeValue}>
      <AuthProvider>{children}</AuthProvider>
    </ActiveThemeProvider>
  );
}
