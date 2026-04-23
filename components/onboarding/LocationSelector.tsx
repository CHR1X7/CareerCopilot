'use client';

import { cn } from '@/lib/utils';

const LOCATIONS = {
  'United States': [
    'Atlanta', 'Austin', 'Baltimore', 'Boston', 'Charlotte', 'Chicago',
    'Dallas', 'Denver', 'Las Vegas', 'Los Angeles', 'Miami', 'New York City',
    'Philadelphia', 'Phoenix', 'Portland', 'San Diego', 'San Francisco Bay Area',
    'Seattle', 'Washington D.C.', 'Remote in USA',
  ],
  'Canada': ['Montreal', 'Ottawa', 'Toronto', 'Vancouver', 'Winnipeg', 'Remote in Canada'],
  'United Kingdom': ['Birmingham', 'Liverpool', 'London', 'Manchester', 'Remote in UK'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Remote in Australia'],
  'Remote': ['Fully Remote (Worldwide)'],
};

interface Props {
  selected: string[];
  onChange: (locations: string[]) => void;
}

export default function LocationSelector({ selected, onChange }: Props) {
  const toggle = (loc: string) => {
    onChange(selected.includes(loc) ? selected.filter(l => l !== loc) : [...selected, loc]);
  };

  const selectAll = (country: string) => {
    const countryLocs = LOCATIONS[country as keyof typeof LOCATIONS];
    const allSelected = countryLocs.every(l => selected.includes(l));
    if (allSelected) {
      onChange(selected.filter(l => !countryLocs.includes(l)));
    } else {
      const newLocs = [...new Set([...selected, ...countryLocs])];
      onChange(newLocs);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Where would you like to work?</h2>
      <p className="text-gray-400 mb-6">Select all locations that interest you</p>

      <div className="space-y-5 max-h-80 overflow-y-auto pr-2">
        {Object.entries(LOCATIONS).map(([country, locs]) => (
          <div key={country}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{country}</h3>
              <button
                onClick={() => selectAll(country)}
                className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
              >
                Select all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {locs.map(loc => (
                <button
                  key={loc}
                  onClick={() => toggle(loc)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm border transition-all',
                    selected.includes(loc)
                      ? 'bg-cyan-600 border-cyan-500 text-white'
                      : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-cyan-500/50'
                  )}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}