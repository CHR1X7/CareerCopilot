'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      window.location.href = '/sign-in';
      return;
    }

    const checkProfile = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();

        if (!data.profile || !data.profile.onboarding_completed) {
          window.location.href = '/onboarding';
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        console.error('Profile check failed:', err);
        window.location.href = '/onboarding';
      }
    };

    checkProfile();
  }, [userId, isLoaded]);

  if (!isLoaded || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
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
          <p className="text-gray-400 text-sm">Loading CareerCopilot...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}