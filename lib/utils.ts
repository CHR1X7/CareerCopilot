import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// ✅ Now accepts string | undefined | null
export function formatDate(date: string | undefined | null): string {
  if (!date) return 'Present';
  try {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  } catch {
    return 'Present';
  }
}

export function formatDateTime(date: string | undefined | null): string {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}

export function getScoreBg(score: number): string {
  if (score >= 80) return 'from-emerald-500 to-green-500';
  if (score >= 60) return 'from-yellow-500 to-amber-500';
  if (score >= 40) return 'from-orange-500 to-amber-500';
  return 'from-red-500 to-rose-500';
}