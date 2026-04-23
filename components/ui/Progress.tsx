'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Progress({ value, max = 100, className, barClassName, showLabel, size = 'md' }: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-gray-800 rounded-full overflow-hidden', heights[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full', barClassName || 'bg-gradient-to-r from-violet-500 to-cyan-500')}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-400 mt-1">{Math.round(percentage)}%</span>
      )}
    </div>
  );
}