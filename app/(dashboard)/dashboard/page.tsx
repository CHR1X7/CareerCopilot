'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useApplications } from '@/hooks/useApplications';
import { useProfile } from '@/hooks/useProfile';
import StatsOverview from '@/components/dashboard/StatsOverview';
import ApplicationPipeline from '@/components/dashboard/ApplicationPipeline';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { applications, loading: appsLoading } = useApplications();
  const { profile, loading: profileLoading } = useProfile();

  const loading = !isLoaded || profileLoading;
  const firstName =
    user?.firstName || profile?.full_name?.split(' ')[0] || 'there';

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="skeleton h-10 w-72 rounded-xl" />
        <div className="skeleton h-5 w-48 rounded-lg" />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
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
          <span className="gradient-text-brand">{firstName}</span>
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
  <div className="grid grid-cols-3 gap-3">
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
            <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <path d="M7 8h10" /><path d="M7 12h10" /><path d="M7 16h10" />
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
          <div className={`${action.color} mb-3 group-hover:scale-110 transition-transform`}>
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

      {/* Pipeline */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-secondary">
            Recent Applications
          </h2>
          <Link href="/applications">
            <Button variant="ghost" size="xs">
              View all
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* Insight Card */}
      <Card
        variant="default"
        className="bg-gradient-to-br from-brand-600/[0.04] to-sky-600/[0.04] border-brand-500/10"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[13px] font-semibold text-text-primary mb-1">
              Pro tip
            </h3>
            <p className="text-[12px] text-text-tertiary leading-relaxed">
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