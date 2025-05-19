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
          className='block w-full rounded-md border p-2'
        />
      </div>
      {error && <div className='text-sm text-red-600'>{error}</div>}
      {success && (
        <div className='text-sm text-green-600'>
          Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...
        </div>
      )}
      <Button type='submit' disabled={loading} className='w-full'>
        {loading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
      </Button>
    </form>
  );
}
