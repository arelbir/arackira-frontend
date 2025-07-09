import React, { ReactNode } from 'react';
import PageContainer from '@/components/layout/page-container';

interface OverViewLayoutProps {
  children: ReactNode;
}

import DashboardHeader from '@/components/DashboardHeader';

export default function OverViewLayout({ children }: OverViewLayoutProps) {
  return (
    <div className='flex min-h-screen flex-col bg-gray-50 dark:bg-neutral-950'>
      <DashboardHeader />
      <div className='flex flex-1 flex-col'>
        <PageContainer scrollable={false}>{children}</PageContainer>
      </div>
    </div>
  );
}
