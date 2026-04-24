'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    ),
  },
  {
    href: '/resume-analyzer',
    label: 'Resume Analyzer',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7V5a2 2 0 0 1 2-2h2" />
        <path d="M17 3h2a2 2 0 0 1 2 2v2" />
        <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
        <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
        <path d="M7 8h10" />
        <path d="M7 12h10" />
        <path d="M7 16h10" />
      </svg>
    ),
  },
  {
    href: '/resume-builder',
    label: 'Resume Builder',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </svg>
    ),
  },
  {
    href: '/cover-letter',
    label: 'Cover Letter',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    href: '/import-jobs',
    label: 'Import Jobs',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
  href: '/job-scout',
  label: 'Job Scout',
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
      <path d="M11 8v6" />
      <path d="M8 11h6" />
    </svg>
  ),
  },
  {
    href: '/answer-generator',
    label: 'Answer Generator',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
      </svg>
    ),
  },
  {
    href: '/applications',
    label: 'Applications',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
        <path d="m2 12 8.58 3.91a2 2 0 0 0 1.66 0L21 12" />
        <path d="m2 17 8.58 3.91a2 2 0 0 0 1.66 0L21 17" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5" />
        <path d="M20 21a8 8 0 0 0-16 0" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] sidebar-bg border-r border-border-subtle flex flex-col relative z-20">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center shadow-md shadow-brand-500/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 2 7l10 5 10-5-10-5Z" />
              <path d="m2 17 10 5 10-5" />
              <path d="m2 12 10 5 10-5" />
            </svg>
          </div>
          <div>
            <div className="text-[14px] font-bold text-text-primary tracking-tight">
              CareerCopilot
            </div>
            <div className="text-[10px] text-text-muted font-semibold tracking-widest uppercase">
              AI Assistant
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 mt-1 overflow-y-auto">
        <div className="px-3 pt-1 pb-2">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
            Tools
          </span>
        </div>

        {NAV_ITEMS.slice(0, 6).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-text-tertiary hover:text-text-primary hover:bg-surface-100'
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand-500 rounded-r-full" />
                )}
                <span className={isActive ? 'text-brand-500' : 'text-text-muted'}>
                  {item.icon}
                </span>
                {item.label}
              </div>
            </Link>
          );
        })}

        {/* Separator */}
        <div className="px-3 pt-4 pb-2">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
            Manage
          </span>
        </div>

        {NAV_ITEMS.slice(6).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-text-tertiary hover:text-text-primary hover:bg-surface-100'
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand-500 rounded-r-full" />
                )}
                <span className={isActive ? 'text-brand-500' : 'text-text-muted'}>
                  {item.icon}
                </span>
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-border-subtle">
        <div className="flex items-center gap-3 px-3 py-2">
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8',
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