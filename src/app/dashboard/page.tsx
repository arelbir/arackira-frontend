import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  console.log('SSR token:', token); // Debug log
  if (!token) {
    return redirect('/auth/sign-in');
  } else {
    redirect('/dashboard/overview');
  }
}
