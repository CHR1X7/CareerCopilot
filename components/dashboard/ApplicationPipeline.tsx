'use client';

import { Application, STATUS_CONFIG } from '@/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface Props {
  applications: Application[];
  loading: boolean;
}

export default function ApplicationPipeline({ applications, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-card p-4 shimmer h-16" />
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="text-4xl mb-3">📋</div>
        <div className="text-gray-400">No applications yet. Start tracking your job search!</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {applications.map((app, i) => {
        const config = STATUS_CONFIG[app.status];
        return (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4 flex items-center justify-between hover:border-gray-700 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-lg', config.bgColor)}>
                {config.icon}
              </div>
              <div>
                <div className="font-medium text-white">{app.job_title}</div>
                <div className="text-sm text-gray-400">{app.company_name}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {app.match_score && (
                <div className="text-sm font-bold text-violet-400">{app.match_score}% match</div>
              )}
              <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full border', config.bgColor, config.color, 'border-current border-opacity-30')}>
                {config.label}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}