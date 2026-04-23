'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { href: '/resume-analyzer', icon: '📊', label: 'Resume Analyzer' },
  { href: '/answer-generator', icon: '✍️', label: 'Answer Generator' },
  { href: '/applications', icon: '📋', label: 'Applications' },
  { href: '/profile', icon: '👤', label: 'My Profile' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900/80 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-sm animate-pulse-glow">
            CC
          </div>
          <div>
            <div className="font-bold text-white text-sm">CareerCopilot</div>
            <div className="text-xs text-gray-500">AI Job Assistant</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-3">
          Main Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-violet-600/30 to-cyan-600/20 border border-violet-500/30 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                )}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-violet-400 rounded-full" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-9 h-9',
                userButtonPopoverCard: 'bg-gray-900 border border-gray-700',
                userButtonPopoverActionButton: 'text-gray-300 hover:text-white hover:bg-gray-800',
                userButtonPopoverActionButtonText: 'text-gray-300',
                userButtonPopoverFooter: 'hidden',
              },
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">My Account</div>
            <div className="text-xs text-gray-500">Manage profile</div>
          </div>
        </div>
      </div>
    </aside>
  );
}