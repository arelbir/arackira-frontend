'use client';
import { UserProvider } from '@/features/auth/user-context';

export default function UserProviderWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
