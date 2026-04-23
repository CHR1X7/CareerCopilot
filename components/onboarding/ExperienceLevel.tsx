'use client';

import { cn } from '@/lib/utils';

const LEVELS = [
  { id: 'internship', label: 'Internship', desc: 'Student or recent grad looking for internship' },
  { id: 'entry_level', label: 'Entry Level & New Grad', desc: '0-1 years of experience' },
  { id: 'junior', label: 'Junior (1-2 years)', desc: '1 to 2 years of experience' },
  { id: 'mid_level', label: 'Mid-level (3-4 years)', desc: '3 to 4 years of experience' },
  { id: 'senior', label: 'Senior (5-8 years)', desc: '5 to 8 years of experience' },
  { id: 'expert', label: 'Expert & Leadership (9+ years)', desc: '9 or more years of experience' },
];

const LEADERSHIP = [
  { id: 'individual_contributor', label: 'Individual Contributor' },
  { id: 'manager', label: 'Manager' },
  { id: 'no_preference', label: "I don't have a preference" },
];

interface Props {
  selected: string[];
  leadership: string;
  onChange: (levels: string[], leadership: string) => void;
}

export default function ExperienceLevel({ selected, leadership, onChange }: Props) {
  const toggleLevel = (id: string) => {
    const newSelected = selected.includes(id)
      ? selected.filter(l => l !== id)
      : selected.length < 2 ? [...selected, id] : selected;
    onChange(newSelected, leadership);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">What level of roles are you looking for?</h2>
      <p className="text-gray-400 mb-6">Select up to 2</p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {LEVELS.map(level => {
          const isSelected = selected.includes(level.id);
          const isDisabled = !isSelected && selected.length >= 2;
          return (
            <button
              key={level.id}
              onClick={() => !isDisabled && toggleLevel(level.id)}
              className={cn(
                'text-left p-4 rounded-xl border transition-all',
                isSelected
                  ? 'bg-violet-900/30 border-violet-500 text-white'
                  : isDisabled
                    ? 'bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-800/30 border-gray-700 text-gray-300 hover:border-violet-500/50'
              )}
            >
              <div className="font-medium text-sm">{level.label}</div>
              <div className="text-xs text-gray-500 mt-1">{level.desc}</div>
            </button>
          );
        })}
      </div>

      <h3 className="text-base font-semibold text-white mb-3">Are you looking for a specific leadership role?</h3>
      <div className="flex gap-3">
        {LEADERSHIP.map(opt => (
          <button
            key={opt.id}
            onClick={() => onChange(selected, opt.id)}
            className={cn(
              'flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all',
              leadership === opt.id
                ? 'bg-violet-600 border-violet-500 text-white'
                : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-violet-500/50'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}