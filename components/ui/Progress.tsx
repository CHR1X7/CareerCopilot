'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'brand' | 'success' | 'warning' | 'danger';
  showValue?: boolean;
  animated?: boolean;
}

export default function Progress({
  value,
  max = 100,
  className,
  size = 'md',
  variant = 'brand',
  showValue,
  animated = true,
}: ProgressProps) {
  const [width, setWidth] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setWidth(percentage), 100);
      return () => clearTimeout(timer);
    }
    setWidth(percentage);
  }, [percentage, animated]);

  const heights = { sm: 'h-1', md: 'h-1.5', lg: 'h-2.5' };

  const barVariants = {
    brand: 'bg-brand-500',
    success: 'bg-accent-emerald',
    warning: 'bg-accent-amber',
    danger: 'bg-accent-rose',
  };

  const bgVariants = {
    brand: 'bg-brand-500/10',
    success: 'bg-emerald-500/10',
    warning: 'bg-amber-500/10',
    danger: 'bg-rose-500/10',
  };

  return (
    <div className={cn('w-full flex items-center gap-3', className)}>
      <div
        className={cn(
          'w-full rounded-full overflow-hidden',
          heights[size],
          bgVariants[variant]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            barVariants[variant]
          )}
          style={{ width: `${width}%` }}
        />
      </div>
      {showValue && (
        <span className="text-xs font-mono text-text-tertiary tabular-nums min-w-[3ch]">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}