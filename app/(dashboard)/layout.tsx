import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import Sidebar from '@/components/dashboard/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userId: string | null = null;

  try {
    const authResult = await auth();
    userId = authResult.userId;
  } catch (err) {
    console.error('[Layout] Auth error:', err);
    redirect('/sign-in');
  }

  if (!userId) {
    redirect('/sign-in');
  }

  try {
    const { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('clerk_user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = row not found, that's fine (new user)
      console.error('[Layout] Supabase error:', error);
      // Don't crash — just send to onboarding
    }

    if (!profile?.onboarding_completed) {
      redirect('/onboarding');
    }
  } catch (err) {
    console.error('[Layout] Profile check error:', err);
    // If supabase fails, send to onboarding rather than crashing
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