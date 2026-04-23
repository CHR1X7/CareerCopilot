'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';

export default function OnboardingPage() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      router.replace('/sign-in');
      return;
    }

    const check = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();

        // If already completed onboarding go to dashboard
        if (data.profile?.onboarding_completed === true) {
          window.location.href = '/dashboard';
          return;
        }
      } catch {
        // No profile yet = needs onboarding
      }
      setReady(true);
    };

    check();
  }, [userId, isLoaded, router]);

  if (!isLoaded || !ready) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 bg-violet-500 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="w-3 h-3 bg-violet-500 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <div
            className="w-3 h-3 bg-violet-500 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    );
  }

  return <OnboardingWizard />;
}