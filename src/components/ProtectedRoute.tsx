'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  role?: string | string[]; // opsiyonel: rol bazlı koruma
}

export default function ProtectedRoute({
  children,
  role
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/sign-in');
      } else if (role) {
        // rol kontrolü
        const userRoles = Array.isArray(user.role) ? user.role : [user.role];
        const allowedRoles = Array.isArray(role) ? role : [role];
        const hasAccess = allowedRoles.some((r) => userRoles.includes(r));
        if (!hasAccess) {
          router.push('/not-authorized');
        }
      }
    }
  }, [user, loading, role, router]);

  if (loading) return <div>Yükleniyor...</div>;
  if (!user) return null;
  if (role) {
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    const allowedRoles = Array.isArray(role) ? role : [role];
    const hasAccess = allowedRoles.some((r) => userRoles.includes(r));
    if (!hasAccess) return null;
  }

  return <>{children}</>;
}
