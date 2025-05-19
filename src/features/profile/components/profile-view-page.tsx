'use client';

import ProfileCreateForm from './profile-create-form';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function ProfileViewPage() {
  const { user, logoutUser, loading } = useAuth();

  return (
    <div className='flex w-full flex-col gap-4 p-4'>
      <div className='mb-4 flex flex-col md:flex-row md:items-center md:justify-between'>
        <div>
          <div className='text-lg font-semibold'>
            Kullanıcı:{' '}
            <span className='text-primary'>{user?.username || '-'}</span>
          </div>
          <div className='text-muted-foreground text-sm'>
            Rol: {user?.role || '-'}
          </div>
        </div>
        <Button
          variant='destructive'
          onClick={logoutUser}
          disabled={loading}
          className='mt-2 md:mt-0'
        >
          Çıkış Yap
        </Button>
      </div>
      <ProfileCreateForm initialData={user} />
    </div>
  );
}
