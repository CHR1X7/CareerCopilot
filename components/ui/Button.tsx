'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, iconRight, fullWidth, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm shadow-brand-500/20',
      secondary: 'bg-surface-100 text-text-primary hover:bg-surface-200 border border-border-default',
      ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-100',
      danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
      outline: 'border border-border-default text-text-secondary hover:text-text-primary hover:border-brand-300 hover:bg-brand-50',
    };

    const sizes = {
      xs: 'h-7 px-2.5 text-xs gap-1 rounded-lg',
      sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
      md: 'h-9 px-4 text-sm gap-2 rounded-xl',
      lg: 'h-11 px-6 text-sm gap-2 rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-150',
          'disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2',
          variants[variant], sizes[size], fullWidth && 'w-full', className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : icon}
        {children}
        {iconRight}
      </button>
    );
  }
);
Button.displayName = 'Button';
export default Button;