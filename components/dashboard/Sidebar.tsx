'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', icon: 'home', label: 'Home' },
  { href: '/resume-analyzer', icon: 'scan', label: 'Resume Analyzer' },
  { href: '/answer-generator', icon: 'pen', label: 'Answer Generator' },
  { href: '/applications', icon: 'layers', label: 'Applications' },
  { href: '/profile', icon: 'user', label: 'Profile' },
];

const icons: Record<string, React.ReactNode> = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  ),
  scan: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M7 8h10" /><path d="M7 12h10" /><path d="M7 16h10" />
    </svg>
  ),
  pen: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
    </svg>
  ),
  layers: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="m2 12 8.58 3.91a2 2 0 0 0 1.66 0L21 12" />
      <path d="m2 17 8.58 3.91a2 2 0 0 0 1.66 0L21 17" />
    </svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  ),
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] ambient-sidebar border-r border-white/[0.04] flex flex-col relative z-20">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 2 7l10 5 10-5-10-5Z" />
              <path d="m2 17 10 5 10-5" />
              <path d="m2 12 10 5 10-5" />
            </svg>
          </div>
          <div>
            <div className="text-[13px] font-semibold text-text-primary tracking-tight">
              CareerCopilot
            </div>
            <div className="text-[10px] text-text-muted font-medium tracking-wide uppercase">
              AI Assistant
            </div>
          </div>
        </div>
      </div>

      {/* Glow line under logo */}
      <div className="glow-line" />

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        <div className="px-3 pt-2 pb-2.5">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
            Menu
          </span>
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative',
                  isActive
                    ? 'text-brand-300'
                    : 'text-text-tertiary hover:text-text-primary hover:bg-white/[0.03]'
                )}
              >
                {/* Active indicator glow */}
                {isActive && (
                  <>
                    <div className="absolute inset-0 bg-brand-500/[0.08] rounded-xl" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand-500 rounded-r-full shadow-[0_0_8px_rgba(132,61,255,0.5)]" />
                  </>
                )}
                <span
                  className={cn(
                    'relative z-10 transition-colors',
                    isActive ? 'text-brand-400' : 'text-text-muted'
                  )}
                >
                  {icons[item.icon]}
                </span>
                <span className="relative z-10">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/[0.04]">
        <div className="flex items-center gap-3 px-3 py-2">
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8 ring-2 ring-white/[0.06]',
              },
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-text-primary truncate">
              My Account
            </div>
            <div className="text-[11px] text-text-muted">Settings</div>
          </div>
        </div>
      </div>
    </aside>
  );
}