'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function UserAuthForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // Cookie'nin tarayıcıya yazılması için
      });
      const data = await res.json();
      console.log('Login response:', res, data); // <-- Debug için eklendi
      if (res.ok && data.user) {
        router.push('/dashboard');
      } else {
        setError(data.error || data.message || 'Giriş başarısız.');
      }
    } catch (err) {
      console.error('Login error:', err); // <-- Debug için eklendi
      setError('Sunucuya bağlanılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900'>
      <form
        onSubmit={handleLogin}
        className='mb-4 w-full max-w-sm rounded bg-white px-8 pt-6 pb-8 shadow-md dark:bg-zinc-800'
      >
        <h2 className='mb-6 text-center text-2xl font-bold'>Giriş Yap</h2>
        <div className='mb-4'>
          <label
            className='mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200'
            htmlFor='username'
          >
            Kullanıcı Adı
          </label>
          <input
            id='username'
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className='focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none dark:text-gray-900'
          />
        </div>
        <div className='mb-6'>
          <label
            className='mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200'
            htmlFor='password'
          >
            Şifre
          </label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='focus:shadow-outline mb-3 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none dark:text-gray-900'
          />
        </div>
        {error && <p className='mb-4 text-xs text-red-500 italic'>{error}</p>}
        <div className='flex items-center justify-between'>
          <Button type='submit' disabled={loading} className='w-full'>
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Button>
        </div>
      </form>
    </div>
  );
}
