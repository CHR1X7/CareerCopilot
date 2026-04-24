'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardAuthGuard({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) { window.location.href = '/sign-in'; return; }

    const checkProfile = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (!data.profile || !data.profile.onboarding_completed) {
          window.location.href = '/onboarding'; return;
        }
        setIsAuthorized(true);
      } catch { window.location.href = '/onboarding'; }
    };
    checkProfile();
  }, [userId, isLoaded]);

  if (!isLoaded || !isAuthorized) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center mx-auto mb-4 animate-bounce-gentle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" />
            </svg>
          </div>
          <p className="text-sm text-text-tertiary font-medium">Loading CareerCopilot...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}