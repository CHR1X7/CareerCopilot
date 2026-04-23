'use client';

import { UserProfile } from '@/types';

interface Props {
  data: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
}

export default function ProfileBasics({ data, onChange }: Props) {
  const inputClass = "w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors";
  const labelClass = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Tell us about yourself</h2>
      <p className="text-gray-400 mb-8">This information will be used to autofill job applications</p>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full Name *</label>
            <input
              type="text"
              className={inputClass}
              placeholder="John Doe"
              value={data.full_name || ''}
              onChange={e => onChange({ full_name: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="tel"
              className={inputClass}
              placeholder="+1 (555) 000-0000"
              value={data.phone || ''}
              onChange={e => onChange({ phone: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Email *</label>
          <input
            type="email"
            className={inputClass}
            placeholder="john@example.com"
            value={data.email || ''}
            onChange={e => onChange({ email: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Location</label>
          <input
            type="text"
            className={inputClass}
            placeholder="San Francisco, CA"
            value={data.location || ''}
            onChange={e => onChange({ location: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>LinkedIn URL</label>
          <input
            type="url"
            className={inputClass}
            placeholder="https://linkedin.com/in/yourprofile"
            value={data.linkedin_url || ''}
            onChange={e => onChange({ linkedin_url: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Portfolio / Website</label>
          <input
            type="url"
            className={inputClass}
            placeholder="https://yourportfolio.com"
            value={data.portfolio_url || ''}
            onChange={e => onChange({ portfolio_url: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Professional Summary</label>
          <textarea
            rows={4}
            className={inputClass}
            placeholder="Brief summary of your experience and goals..."
            value={data.summary || ''}
            onChange={e => onChange({ summary: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}