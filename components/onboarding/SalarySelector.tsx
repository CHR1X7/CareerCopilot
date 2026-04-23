'use client';

import { useState } from 'react';

interface Props {
  value: number;
  onChange: (val: number) => void;
}

export default function SalarySelector({ value, onChange }: Props) {
  const formatSalary = (val: number) => {
    if (val === 0) return '$0';
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Minimum expected salary?</h2>
      <p className="text-gray-400 mb-8">We'll only use this to match you with jobs. This won't be shared.</p>

      <div className="text-center mb-8">
        <div className="text-5xl font-bold gradient-text mb-2">{formatSalary(value)}</div>
        <div className="text-gray-400 text-sm">per year (USD)</div>
      </div>

      <div className="px-4">
        <input
          type="range"
          min={0}
          max={300000}
          step={5000}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>$0</span>
          <span>$75K</span>
          <span>$150K</span>
          <span>$225K</span>
          <span>$300K+</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-8">
        {[60000, 80000, 100000, 120000, 150000, 180000, 200000, 250000].map(preset => (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            className={`py-2 rounded-xl border text-sm font-medium transition-all ${
              value === preset
                ? 'bg-violet-600 border-violet-500 text-white'
                : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-violet-500/50'
            }`}
          >
            {formatSalary(preset)}
          </button>
        ))}
      </div>
    </div>
  );
}