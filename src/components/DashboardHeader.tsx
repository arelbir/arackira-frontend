'use client';
'use client';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardStatCard } from './DashboardStatCard';
import { useTheme } from 'next-themes';

export default function DashboardHeader() {
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();

  // Gelecekte API'den alınacak gerçek veriler
  const stats = [
    { title: 'Aktif Araç', value: 12, colorClass: 'text-blue-700' },
    { title: 'Toplam Kiralama', value: 34, colorClass: 'text-green-700' },
    { title: 'Bakımda Araç', value: 2, colorClass: 'text-yellow-700' }
  ];

  return (
    <div className='w-full px-2 md:px-4'>
      <div className='relative mb-6 h-[220px] w-full overflow-hidden rounded-xl bg-neutral-50 shadow dark:bg-neutral-900'>
        {/* Her iki tema görseli DOM'da, sadece biri görünür */}
        <img
          src='/photos/fiat-egea.png'
          alt='Açık tema için filo aracı görseli'
          className='pointer-events-none absolute inset-0 h-full w-full object-contain object-right opacity-90 dark:hidden'
          style={{ zIndex: 1 }}
        />
        <img
          src='/photos/fiat-egea-dark.png'
          alt='Karanlık tema için filo aracı görseli'
          className='pointer-events-none absolute inset-0 hidden h-full w-full object-contain object-right opacity-90 dark:block'
          style={{ zIndex: 1 }}
        />
        {/* Overlay içerik */}
        <div className='relative z-10 flex h-full flex-col justify-between p-6'>
          <h2 className='mb-2 text-xl font-bold text-neutral-900 drop-shadow dark:text-white'>
            İyi akşamlar,{' '}
            <span className='font-semibold'>
              {user?.username || 'Filo Yöneticisi'}
            </span>
          </h2>
          <div
            className='flex flex-wrap gap-4'
            aria-label='Kullanıcı filo istatistikleri'
          >
            {stats.map((stat) => (
              <DashboardStatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                colorClass={stat.colorClass}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
