import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';

export default async function OnboardingPage() {
  let userId: string | null = null;

  try {
    const authResult = await auth();
    userId = authResult.userId;
  } catch (err) {
    console.error('[Onboarding] Auth error:', err);
    redirect('/sign-in');
  }

  if (!userId) {
    redirect('/sign-in');
  }

  return <OnboardingWizard />;
}