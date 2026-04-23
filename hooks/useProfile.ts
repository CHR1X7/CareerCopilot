'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '@/types';
import { toast } from 'sonner';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      const data = await res.json();
      setProfile(data.profile);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const saveProfile = async (updates: Partial<UserProfile>) => {
    try {
      setSaving(true);
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
        toast.success('Profile saved successfully!');
        return data.profile;
      }
    } catch (err) {
      toast.error('Failed to save profile');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return { profile, loading, saving, fetchProfile, saveProfile };
}