'use client';

import { cn } from '@/lib/utils';

const SIZES = [
  { id: '1-10', label: '1-10', sub: 'Startup' },
  { id: '11-50', label: '11-50', sub: 'Small' },
  { id: '51-200', label: '51-200', sub: 'Growing' },
  { id: '201-500', label: '201-500', sub: 'Mid-size' },
  { id: '501-1000', label: '501-1K', sub: 'Large' },
  { id: '1001-5000', label: '1K-5K', sub: 'Enterprise' },
  { id: '5001-10000', label: '5K-10K', sub: 'Big Corp' },
  { id: '10001+', label: '10K+', sub: 'Fortune 500' },
];

interface Props {
  selected: string[];
  onChange: (sizes: string[]) => void;
}

export default function CompanySize({ selected, onChange }: Props) {
  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Ideal company size?</h2>
      <p className="text-gray-400 mb-6">Select all that apply</p>

      <div className="grid grid-cols-4 gap-3">
        {SIZES.map(size => {
          const isSelected = selected.includes(size.id);
          return (
            <button
              key={size.id}
              onClick={() => toggle(size.id)}
              className={cn(
                'flex flex-col items-center py-4 rounded-xl border transition-all',
                isSelected
                  ? 'bg-violet-900/30 border-violet-500 text-white'
                  : 'bg-gray-800/30 border-gray-700 text-gray-300 hover:border-violet-500/50'
              )}
            >
              <span className="font-bold text-lg">{size.label}</span>
              <span className="text-xs text-gray-500 mt-1">{size.sub}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onChange(SIZES.map(s => s.id))}
        className="mt-4 text-sm text-violet-400 hover:text-violet-300 transition-colors"
      >
        Select all sizes
      </button>
    </div>
  );
}