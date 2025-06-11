'use client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    // Check for JWT token in localStorage
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/auth/sign-in');
    } else {
      router.replace('/dashboard/overview');
    }
  }, [router]);
  return null;
}
