'use client';

import { Application, STATUS_CONFIG } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  applications: Application[];
  loading: boolean;
}

export default function ApplicationPipeline({ applications, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white border border-border-default rounded-2xl p-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-3">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-text-muted"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M12 8v8" />
            <path d="M8 12h8" />
          </svg>
        </div>
        <p className="text-sm text-text-tertiary">No applications yet</p>
        <p className="text-xs text-text-muted mt-1">
          Start tracking your job search
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {applications.map((app) => {
        const config = STATUS_CONFIG[app.status];
        return (
          <div
            key={app.id}
            className="bg-white border border-border-default rounded-xl px-4 py-3 flex items-center justify-between hover:border-border-strong hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-surface-100 flex items-center justify-center text-sm flex-shrink-0">
                {config.icon}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-text-primary truncate">
                  {app.job_title}
                </div>
                <div className="text-[12px] text-text-tertiary truncate">
                  {app.company_name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {app.match_score && (
                <span className="text-[12px] font-bold text-brand-600 tabular-nums">
                  {app.match_score}%
                </span>
              )}
              <span
                className={cn(
                  'text-[11px] font-semibold px-2.5 py-1 rounded-full',
                  config.color === 'text-gray-400' && 'bg-gray-100 text-gray-600',
                  config.color === 'text-blue-400' && 'bg-blue-50 text-blue-700',
                  config.color === 'text-cyan-400' && 'bg-cyan-50 text-cyan-700',
                  config.color === 'text-violet-400' && 'bg-violet-50 text-violet-700',
                  config.color === 'text-purple-400' && 'bg-purple-50 text-purple-700',
                  config.color === 'text-emerald-400' && 'bg-emerald-50 text-emerald-700',
                  config.color === 'text-red-400' && 'bg-red-50 text-red-700',
                  config.color === 'text-orange-400' && 'bg-orange-50 text-orange-700',
                  config.color === 'text-yellow-400' && 'bg-yellow-50 text-yellow-700',
                )}
              >
                {config.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}