'use client';

import { Application } from '@/types';
import { motion } from 'framer-motion';

interface Props {
  applications: Application[];
  loading: boolean;
}

export default function StatsOverview({ applications, loading }: Props) {
  const stats = [
    {
      label: 'Total Applied',
      value: applications.filter(a => a.status !== 'not_submitted').length,
      icon: '📤',
      color: 'text-blue-400',
      bg: 'bg-blue-900/20',
    },
    {
      label: 'Interviews',
      value: applications.filter(a => ['interview_requested', 'onsite_interview_requested'].includes(a.status)).length,
      icon: '🎤',
      color: 'text-violet-400',
      bg: 'bg-violet-900/20',
    },
    {
      label: 'Offers',
      value: applications.filter(a => a.status === 'offer_received').length,
      icon: '🎉',
      color: 'text-emerald-400',
      bg: 'bg-emerald-900/20',
    },
    {
      label: 'Avg Match Score',
      value: applications.filter(a => a.match_score).length > 0
        ? Math.round(applications.filter(a => a.match_score).reduce((sum, a) => sum + (a.match_score || 0), 0) / applications.filter(a => a.match_score).length) + '%'
        : 'N/A',
      icon: '📊',
      color: 'text-cyan-400',
      bg: 'bg-cyan-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className={`glass-card p-5 ${stat.bg}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">{stat.icon}</span>
          </div>
          <div className={`text-3xl font-bold ${stat.color} mb-1`}>
            {loading ? '—' : stat.value}
          </div>
          <div className="text-sm text-gray-400">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}