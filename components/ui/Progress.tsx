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

export default function Progress({ value, max = 100, className, size = 'md', variant = 'brand', showValue, animated = true }: ProgressProps) {
  const [width, setWidth] = useState(0);
  const pct = Math.min((value / max) * 100, 100);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);

  const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' };
  const bars = { brand: 'bg-brand-500', success: 'bg-emerald-500', warning: 'bg-amber-500', danger: 'bg-red-500' };
  const bgs = { brand: 'bg-brand-100', success: 'bg-emerald-100', warning: 'bg-amber-100', danger: 'bg-red-100' };

  return (
    <div className={cn('w-full flex items-center gap-3', className)}>
      <div className={cn('w-full rounded-full overflow-hidden', heights[size], bgs[variant])}>
        <div className={cn('h-full rounded-full transition-all duration-700 ease-out', bars[variant])} style={{ width: `${width}%` }} />
      </div>
      {showValue && <span className="text-xs font-mono text-text-tertiary tabular-nums">{Math.round(pct)}%</span>}
    </div>
  );
}