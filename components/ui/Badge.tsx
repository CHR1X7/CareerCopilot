import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'violet';
  className?: string;
}

const variants = {
  default: 'bg-gray-800 text-gray-300 border-gray-700',
  success: 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30',
  warning: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30',
  danger: 'bg-red-900/30 text-red-400 border-red-500/30',
  info: 'bg-cyan-900/30 text-cyan-400 border-cyan-500/30',
  violet: 'bg-violet-900/30 text-violet-400 border-violet-500/30',
};

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}