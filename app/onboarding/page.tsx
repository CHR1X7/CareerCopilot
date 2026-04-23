import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // If already completed onboarding, go to dashboard
  try {
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('clerk_user_id', userId)
      .single();

    if (profile?.onboarding_completed) {
      redirect('/dashboard');
    }
  } catch (err) {
    // No profile yet = needs onboarding, continue
    console.error('[Onboarding] DB check error:', err);
  }

  return <OnboardingWizard />;
}