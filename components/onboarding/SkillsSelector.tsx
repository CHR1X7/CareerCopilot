'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const POPULAR_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL',
  'Machine Learning', 'TensorFlow', 'PyTorch', 'Docker', 'Kubernetes',
  'AWS', 'GCP', 'Azure', 'Git', 'REST APIs', 'GraphQL', 'PostgreSQL',
  'MongoDB', 'Redis', 'Java', 'C++', 'Go', 'Rust', 'Swift', 'Kotlin',
  'HTML/CSS', 'Tailwind CSS', 'Vue.js', 'Angular', 'Next.js',
  'Data Analysis', 'Excel', 'Tableau', 'Power BI', 'Spark', 'Airflow',
  'NLP', 'Computer Vision', 'LLMs', 'Prompt Engineering',
  'Product Management', 'Agile', 'Scrum', 'Figma', 'SEO',
];

interface Props {
  selected: string[];
  excluded: string[];
  onChange: (selected: string[], excluded: string[]) => void;
}

export default function SkillsSelector({ selected, excluded, onChange }: Props) {
  const [search, setSearch] = useState('');
  const [customSkill, setCustomSkill] = useState('');

  const filteredSkills = POPULAR_SKILLS.filter(s => s.toLowerCase().includes(search.toLowerCase()));

  const toggleSkill = (skill: string) => {
    onChange(
      selected.includes(skill) ? selected.filter(s => s !== skill) : [...selected, skill],
      excluded.filter(s => s !== skill)
    );
  };

  const addCustom = () => {
    if (customSkill.trim() && !selected.includes(customSkill.trim())) {
      onChange([...selected, customSkill.trim()], excluded);
      setCustomSkill('');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">What skills do you have?</h2>
      <p className="text-gray-400 mb-6">Select your skills. Heart ❤️ your favorites!</p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search skills..."
          className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add custom skill..."
            className="w-40 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm"
            value={customSkill}
            onChange={e => setCustomSkill(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustom()}
          />
          <button onClick={addCustom} className="px-3 py-2 bg-violet-600 rounded-xl text-white text-sm font-medium hover:bg-violet-700">
            Add
          </button>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">SELECTED ({selected.length})</p>
          <div className="flex flex-wrap gap-2">
            {selected.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className="px-3 py-1 bg-violet-600/30 border border-violet-500/50 rounded-full text-violet-300 text-sm flex items-center gap-1"
              >
                {skill} <span>×</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
        {filteredSkills.map(skill => (
          <button
            key={skill}
            onClick={() => toggleSkill(skill)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm border transition-all',
              selected.includes(skill)
                ? 'bg-violet-900/30 border-violet-500 text-violet-300'
                : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-violet-500/50'
            )}
          >
            {skill}
          </button>
        ))}
      </div>
    </div>
  );
}