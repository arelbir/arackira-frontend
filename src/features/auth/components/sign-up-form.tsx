'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { registerUser, loading, error, user } = useAuth();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 1200);
    }
  }, [user, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerUser(username, password);
    // Başarılı kayıt sonrası user değişirse useEffect ile yönlendirme olacak
  };

  return (
    <form onSubmit={handleRegister} className='space-y-4'>
      <div>
        <label className='mb-1 block text-sm font-medium'>Kullanıcı Adı</label>
        <input
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className='block w-full rounded-md border p-2'
        />
      </div>
      <div>
        <label className='mb-1 block text-sm font-medium'>Şifre</label>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`block w-full rounded-md border p-2 ${password && password.length < 6 ? 'border-red-400' : ''}`}
          placeholder='En az 6 karakter'
        />
        {password && password.length < 6 && (
          <div className='text-xs text-red-600 mt-1'>Şifre en az 6 karakter olmalı.</div>
        )}
      </div>
      {error && (
        <div className="mb-2 p-2 bg-red-100 text-red-800 rounded text-sm border border-red-300 text-center">
          {error === 'Kullanıcı adı zaten kullanılıyor' ? 'Bu kullanıcı adı zaten alınmış.' : error}
        </div>
      )}
      {success && (
        <div className="mb-2 p-2 bg-green-100 text-green-800 rounded text-sm border border-green-300 text-center">
          Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...
        </div>
      )}
      <Button type='submit' disabled={loading || !username || !password || password.length < 6} className='w-full'>
        {loading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
      </Button>
    </form>
  );
}
