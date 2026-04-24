'use client';

import { Application } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  applications: Application[];
  loading: boolean;
}

const stats = [
  {
    key: 'applied',
    label: 'Applied',
    filter: (a: Application) => a.status !== 'not_submitted',
    color: 'text-accent-sky',
    iconBg: 'bg-sky-500/10',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4z" />
        <path d="M22 2 11 13" />
      </svg>
    ),
  },
  {
    key: 'interviews',
    label: 'Interviews',
    filter: (a: Application) =>
      ['interview_requested', 'onsite_interview_requested'].includes(a.status),
    color: 'text-brand-400',
    iconBg: 'bg-brand-500/10',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v4" /><path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
        <path d="m9 16 2 2 4-4" />
      </svg>
    ),
  },
  {
    key: 'offers',
    label: 'Offers',
    filter: (a: Application) => a.status === 'offer_received',
    color: 'text-accent-emerald',
    iconBg: 'bg-emerald-500/10',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 9 7 12 7s5-3 7.5-3a2.5 2.5 0 0 1 0 5H18" />
        <path d="M18 9v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
        <path d="M12 7v15" />
      </svg>
    ),
  },
  {
    key: 'score',
    label: 'Avg Score',
    filter: null,
    color: 'text-accent-amber',
    iconBg: 'bg-amber-500/10',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
      </svg>
    ),
  },
];

export default function StatsOverview({ applications, loading }: Props) {
  const getValue = (key: string) => {
    if (key === 'score') {
      const withScore = applications.filter((a) => a.match_score);
      if (withScore.length === 0) return '—';
      const avg = Math.round(
        withScore.reduce((s, a) => s + (a.match_score || 0), 0) /
          withScore.length
      );
      return avg + '%';
    }
    const stat = stats.find((s) => s.key === key);
    return stat?.filter ? applications.filter(stat.filter).length : 0;
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div key={stat.key} className="surface-primary rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center',
                stat.iconBg,
                stat.color
              )}
            >
              {stat.icon}
            </div>
          </div>
          <div
            className={cn(
              'text-2xl font-bold tabular-nums tracking-tight',
              stat.color
            )}
          >
            {loading ? (
              <div className="skeleton w-10 h-7" />
            ) : (
              getValue(stat.key)
            )}
          </div>
          <div className="text-[12px] text-text-muted mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}