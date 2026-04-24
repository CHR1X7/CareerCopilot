'use client';

import { Application } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  applications: Application[];
  loading: boolean;
}

export default function StatsOverview({ applications, loading }: Props) {
  const stats = [
    {
      label: 'Applied',
      value: applications.filter((a) => a.status !== 'not_submitted').length,
      icon: '📤',
      color: 'text-violet-700',
      bg: 'bg-gradient-to-br from-violet-50 to-indigo-50',
      border: 'border-violet-200',
    },
    {
      label: 'Interviews',
      value: applications.filter((a) =>
        ['interview_requested', 'onsite_interview_requested'].includes(a.status)
      ).length,
      icon: '🎯',
      color: 'text-sky-700',
      bg: 'bg-gradient-to-br from-sky-50 to-cyan-50',
      border: 'border-sky-200',
    },
    {
      label: 'Offers',
      value: applications.filter((a) => a.status === 'offer_received').length,
      icon: '🎉',
      color: 'text-emerald-700',
      bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      border: 'border-emerald-200',
    },
    {
      label: 'Avg Score',
      value: (() => {
        const scored = applications.filter((a) => a.match_score);
        if (scored.length === 0) return '—';
        return (
          Math.round(
            scored.reduce((sum, a) => sum + (a.match_score || 0), 0) /
              scored.length
          ) + '%'
        );
      })(),
      icon: '📊',
      color: 'text-amber-700',
      bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
      border: 'border-amber-200',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={cn(
            'rounded-2xl p-5 border',
            stat.bg,
            stat.border
          )}
        >
          <div className="text-2xl mb-3">{stat.icon}</div>
          <div className={cn('text-2xl font-bold tabular-nums', stat.color)}>
            {loading ? (
              <div className="h-7 w-12 bg-gray-200 rounded-lg animate-pulse" />
            ) : (
              stat.value
            )}
          </div>
          <div className="text-[12px] text-text-tertiary font-medium mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}