'use client';

import { cn } from '@/lib/utils';

const INDUSTRIES = [
  'AI & Machine Learning', 'Aerospace', 'Automotive & Transportation',
  'Biotechnology', 'Consulting', 'Consumer Goods', 'Consumer Software',
  'Crypto & Web3', 'Cybersecurity', 'Data & Analytics', 'Defense',
  'Design', 'Education', 'Energy', 'Enterprise Software', 'Entertainment',
  'Financial Services', 'Fintech', 'Food & Agriculture', 'Gaming',
  'Government & Public Sector', 'Hardware', 'Healthcare', 'Industrial & Manufacturing',
  'Legal', 'Quantitative Finance', 'Real Estate', 'Robotics & Automation',
  'Social Impact', 'VR & AR', 'Venture Capital',
];

interface Props {
  selected: string[];
  excluded: string[];
  onChange: (selected: string[], excluded: string[]) => void;
}

export default function IndustrySelector({ selected, excluded, onChange }: Props) {
  const toggleSelected = (ind: string) => {
    const newSelected = selected.includes(ind) ? selected.filter(i => i !== ind) : [...selected, ind];
    const newExcluded = excluded.filter(i => i !== ind);
    onChange(newSelected, newExcluded);
  };

  const toggleExcluded = (ind: string) => {
    const newExcluded = excluded.includes(ind) ? excluded.filter(i => i !== ind) : [...excluded, ind];
    const newSelected = selected.filter(i => i !== ind);
    onChange(newSelected, newExcluded);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">What industries excite you?</h2>
      <p className="text-gray-400 mb-4">Click once to add ✅, click a different button to exclude ❌</p>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">INTERESTED IN</h3>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
          {INDUSTRIES.map(ind => (
            <button
              key={ind}
              onClick={() => toggleSelected(ind)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm border transition-all',
                selected.includes(ind)
                  ? 'bg-emerald-900/30 border-emerald-500 text-emerald-300'
                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-emerald-500/50'
              )}
            >
              {selected.includes(ind) ? '✅ ' : ''}{ind}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-3">EXCLUDE (Don't want to work in)</h3>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
          {INDUSTRIES.map(ind => (
            <button
              key={ind}
              onClick={() => toggleExcluded(ind)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm border transition-all',
                excluded.includes(ind)
                  ? 'bg-red-900/30 border-red-500 text-red-300'
                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-red-500/50'
              )}
            >
              {excluded.includes(ind) ? '❌ ' : ''}{ind}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}