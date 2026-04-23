'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const ROLE_CATEGORIES = {
  'Technical & Engineering': [
    'Software Engineering', 'AI & Machine Learning', 'Data & Analytics',
    'DevOps & Infrastructure', 'IT & Security', 'Backend Engineering',
    'Frontend Engineering', 'Full Stack Engineering', 'Mobile Development',
    'QA & Testing', 'Engineering Management', 'Cybersecurity',
    'Cloud Architecture', 'Embedded Systems',
  ],
  'Product & Design': [
    'Product Management', 'UI/UX Design', 'Product Design',
    'UX Research', 'Content Strategy',
  ],
  'Data Science': [
    'Data Science', 'Machine Learning Engineering', 'Data Engineering',
    'Business Intelligence', 'Quantitative Analysis',
  ],
  'Finance & Operations': [
    'Finance & Banking', 'Accounting', 'Business Strategy',
    'Operations & Logistics', 'Consulting',
  ],
};

interface Props {
  selected: string[];
  onChange: (roles: string[]) => void;
}

export default function RoleSelector({ selected, onChange }: Props) {
  const [search, setSearch] = useState('');

  const toggle = (role: string) => {
    if (selected.includes(role)) {
      onChange(selected.filter(r => r !== role));
    } else if (selected.length < 5) {
      onChange([...selected, role]);
    }
  };

  const filteredCategories = Object.entries(ROLE_CATEGORIES).reduce((acc, [cat, roles]) => {
    const filtered = roles.filter(r => r.toLowerCase().includes(search.toLowerCase()));
    if (filtered.length > 0) acc[cat] = filtered;
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">What roles interest you?</h2>
      <p className="text-gray-400 mb-6">Select up to 5 roles</p>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="🔍 Search by job title..."
          className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="text-sm text-gray-500">{selected.length}/5</span>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selected.map(role => (
            <motion.button
              key={role}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => toggle(role)}
              className="flex items-center gap-1.5 px-3 py-1 bg-violet-600/30 border border-violet-500/50 rounded-full text-violet-300 text-sm"
            >
              {role} <span className="text-violet-400">×</span>
            </motion.button>
          ))}
        </div>
      )}

      <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
        {Object.entries(filteredCategories).map(([category, roles]) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {roles.map(role => {
                const isSelected = selected.includes(role);
                const isDisabled = !isSelected && selected.length >= 5;
                return (
                  <button
                    key={role}
                    onClick={() => !isDisabled && toggle(role)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all',
                      isSelected
                        ? 'bg-violet-600 border-violet-500 text-white'
                        : isDisabled
                          ? 'bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed'
                          : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-violet-500 hover:text-violet-300'
                    )}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}