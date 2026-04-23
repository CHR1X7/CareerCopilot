'use client';

import { useState, useEffect, useCallback } from 'react';
import { Application, ApplicationStatus } from '@/types';
import { toast } from 'sonner';

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/applications');
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const addApplication = async (app: Partial<Application>) => {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(app),
    });
    const data = await res.json();
    if (data.application) {
      setApplications(prev => [data.application, ...prev]);
      toast.success('Application added!');
      return data.application;
    }
  };

  const updateStatus = async (id: string, status: ApplicationStatus) => {
    const res = await fetch('/api/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (data.application) {
      setApplications(prev => prev.map(a => a.id === id ? data.application : a));
      toast.success('Status updated!');
    }
  };

  const deleteApplication = async (id: string) => {
    await fetch(`/api/applications?id=${id}`, { method: 'DELETE' });
    setApplications(prev => prev.filter(a => a.id !== id));
    toast.success('Application removed');
  };

  return { applications, loading, fetchApplications, addApplication, updateStatus, deleteApplication };
}