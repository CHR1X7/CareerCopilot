'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { toast } from 'sonner';
import { useApplications } from '@/hooks/useApplications';
import { useProfile } from '@/hooks/useProfile';
import StatsOverview from '@/components/dashboard/StatsOverview';
import ApplicationPipeline from '@/components/dashboard/ApplicationPipeline';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { applications, loading: appsLoading } = useApplications();
  const { profile, loading: profileLoading } = useProfile();
  const [suggestedJobs, setSuggestedJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsLoaded, setJobsLoaded] = useState(false);

  const loading = !isLoaded || profileLoading;
  const firstName =
    user?.firstName || profile?.full_name?.split(' ')[0] || 'there';

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await fetch('/api/jobs/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setSuggestedJobs((data.jobs || []).slice(0, 4));
      setJobsLoaded(true);
      if (data.jobs?.length > 0) {
        toast.success(`Found ${data.jobs.length} matching jobs!`);
      }
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoadingJobs(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-10 w-72 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-5 w-48 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          {greeting},{' '}
          <span className="gradient-text-brand">{firstName}</span> 👋
        </h1>
        <p className="text-sm text-text-tertiary mt-1">
          Here's your job search at a glance
        </p>
      </div>

      {/* Stats */}
      <StatsOverview applications={applications} loading={appsLoading} />

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-text-secondary mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              title: 'Analyze Resume',
              desc: 'Get your match score',
              href: '/resume-analyzer',
              color: 'text-violet-700',
              bg: 'bg-gradient-to-br from-violet-50 to-indigo-50',
              border: 'border-violet-200',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                  <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                  <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                  <path d="M7 8h10" />
                  <path d="M7 12h10" />
                  <path d="M7 16h10" />
                </svg>
              ),
            },
            {
              title: 'Generate Answers',
              desc: 'AI-tailored responses',
              href: '/answer-generator',
              color: 'text-sky-700',
              bg: 'bg-gradient-to-br from-sky-50 to-cyan-50',
              border: 'border-sky-200',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                </svg>
              ),
            },
            {
              title: 'Build Resume',
              desc: 'ATS-friendly templates',
              href: '/resume-builder',
              color: 'text-amber-700',
              bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
              border: 'border-amber-200',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="M10 9H8" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                </svg>
              ),
            },
            {
              title: 'Track Application',
              desc: 'Add new application',
              href: '/applications',
              color: 'text-emerald-700',
              bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
              border: 'border-emerald-200',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
                  <path d="m2 12 8.58 3.91a2 2 0 0 0 1.66 0L21 12" />
                  <path d="m2 17 8.58 3.91a2 2 0 0 0 1.66 0L21 17" />
                </svg>
              ),
            },
          ].map((action, i) => (
            <Link key={i} href={action.href}>
              <div
                className={`${action.bg} border ${action.border} rounded-2xl p-4 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div
                  className={`${action.color} mb-3 group-hover:scale-110 transition-transform`}
                >
                  {action.icon}
                </div>
                <div className="text-[13px] font-semibold text-text-primary">
                  {action.title}
                </div>
                <div className="text-[12px] text-text-tertiary mt-0.5">
                  {action.desc}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Suggested Jobs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-secondary">
            🔍 Suggested Jobs
          </h2>
          <div className="flex gap-2">
            {jobsLoaded ? (
              <Link href="/job-scout">
                <Button variant="ghost" size="xs">
                  View all
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="xs"
                onClick={fetchJobs}
                loading={loadingJobs}
              >
                {loadingJobs ? 'Finding...' : 'Find Jobs'}
              </Button>
            )}
          </div>
        </div>

        {loadingJobs ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : suggestedJobs.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {suggestedJobs.map((job, i) => (
              <Link key={i} href="/job-scout">
                <div className="bg-white border border-border-default rounded-xl p-4 hover:border-brand-200 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <h4 className="text-[13px] font-bold text-text-primary truncate group-hover:text-brand-700 transition-colors">
                        {job.title}
                      </h4>
                      <p className="text-[12px] text-text-tertiary truncate">
                        {job.company}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0',
                        (job.match_score || 0) >= 80
                          ? 'bg-emerald-50 text-emerald-700'
                          : (job.match_score || 0) >= 60
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {job.match_score}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-text-muted">
                    <span>📍 {job.location}</span>
                    {job.salary && (
                      <>
                        <span>·</span>
                        <span className="text-emerald-600 font-medium">
                          {job.salary}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : !jobsLoaded ? (
          <Card
            variant="default"
            className="bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-200 text-center py-8"
          >
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-[13px] text-text-tertiary mb-3">
              Let AI find jobs that match your profile
            </p>
            <Button size="sm" onClick={fetchJobs} loading={loadingJobs}>
              🚀 Scout Jobs
            </Button>
          </Card>
        ) : null}
      </div>

      {/* Application Pipeline */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-secondary">
            Recent Applications
          </h2>
          <Link href="/applications">
            <Button variant="ghost" size="xs">
              View all
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </Link>
        </div>
        <ApplicationPipeline
          applications={applications.slice(0, 5)}
          loading={appsLoading}
        />
      </div>

      {/* Pro Tip */}
      <Card
        variant="default"
        className="bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-200"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[13px] font-semibold text-text-primary mb-1">
              Pro tip
            </h3>
            <p className="text-[13px] text-text-tertiary leading-relaxed">
              Candidates who tailor their resume for each application have a 3x
              higher callback rate. Use the Resume Analyzer to check your match
              score before applying.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}