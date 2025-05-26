'use client';
import { Metadata } from 'next';
import Link from 'next/link';
import SignUpForm from './sign-up-form';
import { ThemeSelector } from '@/components/theme-selector';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};


import { Button } from '@/components/ui/button';
import { useThemeConfig } from '@/components/active-theme';

export default function SignUpViewPage() {
  const { activeTheme } = useThemeConfig();
  const GRADIENTS: Record<string, string> = {
    default: 'from-blue-100 to-blue-300 dark:from-neutral-900 dark:to-neutral-800',
    blue: 'from-blue-200 to-blue-600 dark:from-blue-900 dark:to-blue-800',
    green: 'from-green-100 to-green-300 dark:from-green-900 dark:to-green-800',
    amber: 'from-amber-100 to-amber-300 dark:from-amber-900 dark:to-amber-800',
    mono: 'from-neutral-100 to-neutral-300 dark:from-neutral-900 dark:to-neutral-700',
    'default-scaled': 'from-blue-100 to-blue-300 dark:from-neutral-900 dark:to-neutral-800',
    'blue-scaled': 'from-blue-200 to-blue-600 dark:from-blue-900 dark:to-blue-800',
    'mono-scaled': 'from-neutral-100 to-neutral-300 dark:from-neutral-900 dark:to-neutral-700'
  };
  const gradientClass = GRADIENTS[activeTheme] || GRADIENTS.default;

  return (
    <div className={`flex min-h-screen w-full flex-col bg-gradient-to-br ${gradientClass}`}>
      <div className='mx-auto flex h-full min-h-screen w-full max-w-7xl flex-1 items-center justify-center px-0 md:justify-between md:px-8'>
        {/* Sol Sütun: Logo ve Slogan */}
        <div className='hidden flex-1 flex-col justify-center pl-8 md:flex'>
          <div className='flex items-center gap-2 mb-8'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='h-9 w-9 text-primary dark:text-white'><circle cx='12' cy='12' r='10' /><path d='M8 12h8' /><path d='M12 8v8' /></svg>
            <span className='text-2xl font-bold text-neutral-900 dark:text-white'>Logo</span>
          </div>
          <h1 className='mb-4 text-3xl font-bold text-neutral-900 dark:text-white'>Aramıza Katıl!</h1>
          <p className='text-lg text-neutral-700 dark:text-neutral-300 max-w-md'>Hesap oluşturarak avantajlardan yararlanın ve topluluğumuza katılın.</p>
        </div>
        {/* Sağ Sütun: Kayıt Kutusu */}
        <div className="flex flex-1 flex-col items-center justify-center px-2 py-8 sm:px-0">
          <div className="flex w-full max-w-sm flex-col items-center justify-center gap-5 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-6 border border-neutral-200 dark:border-neutral-700 relative">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-1 w-full text-left">Kayıt Ol</h2>
            <p className="text-sm text-muted-foreground w-full text-left mb-2">Hemen kaydol, avantajları kaçırma!</p>
            <SignUpForm />
            <Button
              asChild
              variant={activeTheme?.includes('green') ? 'default' : 'secondary'}
              size="sm"
              className="w-full mt-1 flex items-center gap-2"
            >
              <Link href="/auth/sign-in">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 mr-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Zaten hesabın var mı? Giriş Yap
              </Link>
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Devam ederek <Link href="/terms" className="underline underline-offset-2 hover:text-primary">Kullanım Koşulları</Link> ve <Link href="/privacy" className="underline underline-offset-2 hover:text-primary">Gizlilik Politikası</Link>'nı kabul etmiş olursun.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
