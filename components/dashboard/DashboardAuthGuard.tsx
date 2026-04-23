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
  const [profileChecked, setProfileChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      router.replace('/sign-in');
      return;
    }

    // Check onboarding status
    const checkProfile = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();

        if (!data.profile || !data.profile.onboarding_completed) {
          router.replace('/onboarding');
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        console.error('Profile check failed:', err);
        router.replace('/onboarding');
      } finally {
        setProfileChecked(true);
      }
    };

    checkProfile();
  }, [userId, isLoaded, router]);

  // Loading state
  if (!isLoaded || !profileChecked || !isAuthorized) {
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