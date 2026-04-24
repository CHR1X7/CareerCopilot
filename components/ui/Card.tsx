'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'surface-primary',
      elevated: 'surface-elevated',
      interactive: 'surface-interactive',
      ghost: 'rounded-2xl',
    };
    const paddings = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' };

    return (
      <div ref={ref} className={cn(variants[variant], paddings[padding], className)} {...props}>
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
export default Card;