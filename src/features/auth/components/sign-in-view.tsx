'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

import { ThemeSelector } from '@/components/theme-selector';
import { useThemeConfig } from '@/components/active-theme';

type SignInViewPageProps = {
  stars?: number;
};

export default function SignInViewPage({ stars }: SignInViewPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // Hata state'i context'ten alınacak, local hata kaldırıldı
  const router = useRouter();
  const { loginUser, loading, user, error } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginUser(username, password);
    // Hata context üzerinden gösterilecek
  };

  const { activeTheme } = useThemeConfig();

  const GRADIENTS: Record<string, string> = {
    default:
      'from-blue-100 to-blue-300 dark:from-neutral-900 dark:to-neutral-800',
    blue: 'from-blue-200 to-blue-600 dark:from-blue-900 dark:to-blue-800',
    green: 'from-green-100 to-green-300 dark:from-green-900 dark:to-green-800',
    amber: 'from-amber-100 to-amber-300 dark:from-amber-900 dark:to-amber-800',
    mono: 'from-neutral-100 to-neutral-300 dark:from-neutral-900 dark:to-neutral-700',
    'default-scaled':
      'from-blue-100 to-blue-300 dark:from-neutral-900 dark:to-neutral-800',
    'blue-scaled':
      'from-blue-200 to-blue-600 dark:from-blue-900 dark:to-blue-800',
    'mono-scaled':
      'from-neutral-100 to-neutral-300 dark:from-neutral-900 dark:to-neutral-700'
  };

  const gradientClass = GRADIENTS[activeTheme] || GRADIENTS.default;

  return (
    <div
      className={`flex min-h-screen w-full flex-col bg-gradient-to-br ${gradientClass}`}
    >
      <div className='mx-auto flex h-full min-h-screen w-full max-w-7xl flex-1 items-center justify-center px-0 md:justify-between md:px-8'>
        {/* Sol Sütun: Slogan */}
        <div className='hidden flex-1 flex-col justify-center pl-8 md:flex'>
          <h1 className='mb-4 text-3xl font-bold text-neutral-900 dark:text-white'>
            Hızlı, Verimli ve Üretken
          </h1>
          <p className='text-lg text-neutral-700 dark:text-neutral-300'>
            Filo yöneti.
          </p>
        </div>
        {/* Sağ Sütun: Giriş Formu */}
        <div className='flex flex-1 flex-col items-center justify-center py-12'>
          <div className='mx-4 w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl dark:bg-neutral-800'>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='text-2xl font-bold text-neutral-900 dark:text-white'>
                Giriş Yap
              </h2>
              <ThemeSelector />
            </div>
            {error && (
              <div className="mb-2 p-2 bg-red-100 text-red-800 rounded text-sm border border-red-300 text-center">
                {error === 'Kullanıcı bulunamadı veya şifre hatalı' ? 'Kullanıcı adı veya şifre hatalı.' : error}
              </div>
            )}
            <form
              className='flex flex-col gap-4'
              onSubmit={handleLogin}
            >
              <div>
                <label
                  htmlFor='username'
                  className='mb-1 block font-medium text-neutral-700 dark:text-neutral-200'
                >
                  Kullanıcı Adı veya E-posta
                </label>
                <input
                  id='username'
                  type='text'
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className='w-full rounded border border-neutral-300 bg-neutral-50 px-4 py-2 text-neutral-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100'
                />
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='mb-1 block font-medium text-neutral-700 dark:text-neutral-200'
                >
                  Şifre
                </label>
                <div className='relative'>
                  <input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full rounded border border-neutral-300 bg-neutral-50 px-4 py-2 pr-10 text-neutral-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute top-1/2 right-2 -translate-y-1/2 text-neutral-400 hover:text-blue-500'
                    tabIndex={-1}
                    aria-label={
                      showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'
                    }
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <button
                type='submit'
                className='w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 transition disabled:opacity-50'
                disabled={loading || !username || !password}
              >
                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>
            <div className={`flex flex-col gap-3 mt-6 w-full items-stretch`}>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-between items-center w-full">
                <Button
                  asChild
                  variant={activeTheme?.includes('amber') ? 'secondary' : activeTheme?.includes('green') ? 'outline' : 'ghost'}
                  size={activeTheme?.includes('scaled') ? 'lg' : 'sm'}
                  className="w-full sm:w-auto flex items-center justify-center gap-2"
                  aria-label="Şifremi Unuttum"
                >
                  <Link href="/auth/forgot-password">
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 mr-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17v.01M8.93 6.588a5 5 0 016.14 0M17 11a5 5 0 01-10 0c0-3.866 3.582-7 8-7s8 3.134 8 7c0 4.418-3.582 8-8 8z" /></svg>
                    Şifremi Unuttum
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={activeTheme?.includes('green') ? 'default' : activeTheme?.includes('amber') ? 'outline' : 'secondary'}
                  size={activeTheme?.includes('scaled') ? 'lg' : 'sm'}
                  className="w-full sm:w-auto flex items-center justify-center gap-2"
                  aria-label="Kayıt Ol"
                >
                  <Link href="/auth/sign-up">
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4 mr-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Kayıt Ol
                  </Link>
                </Button>
              </div>
              <div className="text-center text-xs text-muted-foreground mt-2">
                Hesabınız yoksa kolayca kayıt olabilirsiniz veya şifrenizi unuttuysanız hızlıca sıfırlayabilirsiniz.
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className='mt-8 mb-4 w-full text-center text-xs text-neutral-400'>
        &copy; {new Date().getFullYear()} AracKira. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
