'use client';
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
  const [error, setError] = useState('');
  const router = useRouter();
  const { loginUser, loading, user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginUser(username, password);
    // setError("Kullanıcı adı veya şifre hatalı!"); // örnek hata
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
            <form onSubmit={handleLogin} className='space-y-4'>
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
              {error && <p className='text-xs text-red-500 italic'>{error}</p>}
              <button
                type='submit'
                disabled={loading}
                className={`w-full rounded py-2 font-semibold transition ${
                  activeTheme?.includes('green')
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : activeTheme?.includes('amber')
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : activeTheme?.includes('mono')
                        ? 'bg-neutral-400 text-neutral-900 hover:bg-neutral-500 dark:text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                } `}
              >
                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <footer className='mt-8 mb-4 w-full text-center text-xs text-neutral-400'>
        &copy; {new Date().getFullYear()} AracKira. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
