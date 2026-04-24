'use client';

import { Application } from '@/types';
import { cn } from '@/lib/utils';

interface Props { applications: Application[]; loading: boolean; }

export default function StatsOverview({ applications, loading }: Props) {
  const stats = [
    { label: 'Applied', value: applications.filter(a => a.status !== 'not_submitted').length, card: 'stat-card-purple', color: 'text-brand-600', icon: '📤' },
    { label: 'Interviews', value: applications.filter(a => ['interview_requested','onsite_interview_requested'].includes(a.status)).length, card: 'stat-card-blue', color: 'text-sky-600', icon: '🎯' },
    { label: 'Offers', value: applications.filter(a => a.status === 'offer_received').length, card: 'stat-card-green', color: 'text-emerald-600', icon: '🎉' },
    { label: 'Avg Score', value: (() => { const s = applications.filter(a=>a.match_score); return s.length ? Math.round(s.reduce((a,b)=>a+(b.match_score||0),0)/s.length)+'%' : '—'; })(), card: 'stat-card-orange', color: 'text-orange-600', icon: '📊' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className={cn('rounded-2xl p-5', s.card)}>
          <div className="text-2xl mb-2">{s.icon}</div>
          <div className={cn('text-2xl font-bold', s.color)}>
            {loading ? <div className="skeleton w-10 h-7" /> : s.value}
          </div>
          <div className="text-[12px] text-text-tertiary font-medium mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}