'use client';

import { AuthProvider } from '@/context/AuthContext';
import { VehicleProvider } from '@/features/vehicle/VehicleContext';
import { BrandProvider } from '@/features/definitions/brands/BrandContext';
import { ModelProvider } from '@/features/definitions/models/ModelContext';
import { ColorProvider } from '@/features/definitions/colors/ColorContext';
import { BranchProvider } from '@/features/definitions/branches/BranchContext';
import { VehicleStatusProvider } from '@/features/vehicle/form/VehicleStatusContext';
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
      <AuthProvider>
        <BrandProvider>
          <ModelProvider>
            <ColorProvider>
              <BranchProvider>
                <VehicleStatusProvider>
                  <VehicleProvider>
                    {children}
                  </VehicleProvider>
                </VehicleStatusProvider>
              </BranchProvider>
            </ColorProvider>
          </ModelProvider>
        </BrandProvider>
      </AuthProvider>
    </ActiveThemeProvider>
  );
}
