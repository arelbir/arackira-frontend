// StatCard: Tekil gösterge kartı bileşeni
'use client';
import React from 'react';

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  colorClass?: string;
}

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  colorClass = 'text-blue-700'
}) => (
  <div
    className='flex min-w-[120px] flex-col items-center rounded-lg bg-white/80 px-6 py-3 shadow backdrop-blur-md dark:bg-neutral-800/80'
    role='region'
    aria-label={title}
  >
    <div className='mb-1 text-xs text-gray-600 dark:text-gray-200'>{title}</div>
    <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
  </div>
);
