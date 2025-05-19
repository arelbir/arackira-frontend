'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserAvatarProfile } from '@/components/user-avatar-profile';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

import { useUser } from '@/features/auth/user-context';

export function UserNav() {
  const { user, loading, error } = useUser();
  const { logoutUser } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className='text-muted-foreground px-4 py-2 text-sm'>
        Yükleniyor...
      </div>
    );
  }
  if (error) {
    return <div className='px-4 py-2 text-sm text-red-500'>{error}</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <UserAvatarProfile
            user={
              user
                ? {
                    imageUrl: undefined,
                    fullName: user.username,
                    emailAddresses: [
                      { emailAddress: user.username + '@mail.com' }
                    ]
                  }
                : null
            }
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-56'
        align='end'
        sideOffset={10}
        forceMount
      >
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm leading-none font-medium'>
              {user ? user.username : 'Kullanıcı'}
            </p>
            <p className='text-muted-foreground text-xs leading-none'>
              {user ? user.username + '@mail.com' : 'user@email.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
            Profil
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await logoutUser();
            router.push('/login');
          }}
        >
          Çıkış Yap
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
