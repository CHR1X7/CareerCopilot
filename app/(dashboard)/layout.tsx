import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import Sidebar from '@/components/dashboard/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Check onboarding — never crash, just redirect
  try {
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('clerk_user_id', userId)
      .single();

    if (!profile?.onboarding_completed) {
      redirect('/onboarding');
    }
  } catch (err) {
    // If DB fails, send to onboarding
    console.error('[Dashboard Layout] DB error:', err);
    redirect('/onboarding');
  }

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}