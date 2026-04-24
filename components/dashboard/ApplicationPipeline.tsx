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
          <div key={i} className="skeleton h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="surface-primary rounded-2xl p-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-surface-200 flex items-center justify-center mx-auto mb-3">
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
        <p className="text-sm text-text-tertiary">
          No applications yet
        </p>
        <p className="text-xs text-text-muted mt-1">
          Start tracking your job search
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {applications.map((app) => {
        const config = STATUS_CONFIG[app.status];
        return (
          <div
            key={app.id}
            className="surface-interactive rounded-xl px-4 py-3 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0',
                  config.bgColor
                )}
              >
                {config.icon}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-text-primary truncate">
                  {app.job_title}
                </div>
                <div className="text-[12px] text-text-muted truncate">
                  {app.company_name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {app.match_score && (
                <span className="text-[12px] font-mono font-medium text-brand-400 tabular-nums">
                  {app.match_score}%
                </span>
              )}
              <span
                className={cn(
                  'text-[11px] font-medium px-2 py-0.5 rounded-full',
                  config.bgColor,
                  config.color
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