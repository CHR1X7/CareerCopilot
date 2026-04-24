import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variants = {
  default:
    'bg-surface-200 text-text-secondary border-border-subtle',
  brand:
    'bg-brand-500/10 text-brand-300 border-brand-500/20',
  success:
    'bg-emerald-500/10 text-accent-emerald border-emerald-500/20',
  warning:
    'bg-amber-500/10 text-accent-amber border-amber-500/20',
  danger:
    'bg-rose-500/10 text-accent-rose border-rose-500/20',
  info:
    'bg-sky-500/10 text-accent-sky border-sky-500/20',
};

const sizes = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-0.5 text-xs',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium border leading-tight',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            variant === 'success' && 'bg-accent-emerald',
            variant === 'danger' && 'bg-accent-rose',
            variant === 'warning' && 'bg-accent-amber',
            variant === 'brand' && 'bg-brand-400',
            variant === 'info' && 'bg-accent-sky',
            variant === 'default' && 'bg-text-muted'
          )}
        />
      )}
      {children}
    </span>
  );
}