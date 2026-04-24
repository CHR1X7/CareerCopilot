'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useApplications } from '@/hooks/useApplications';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export default function ImportJobsPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState<any>(null);
  const { addApplication } = useApplications();

  const handleImport = async () => {
    if (!url.trim()) {
      toast.error('Please paste a job URL');
      return;
    }

    setLoading(true);
    setExtracted(null);

    try {
      const res = await fetch('/api/import-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setExtracted(data.job);
      toast.success('Job imported successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to import job');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToTracker = async () => {
    if (!extracted) return;

    try {
      await addApplication({
        company_name: extracted.company,
        job_title: extracted.title,
        job_url: url,
        job_description: extracted.description,
        status: 'not_submitted',
      });
      setUrl('');
      setExtracted(null);
    } catch {
      toast.error('Failed to add to tracker');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Import Jobs from Anywhere 🔗
        </h1>
        <p className="text-sm text-text-tertiary mt-1">
          Paste any job URL from LinkedIn, Indeed, Greenhouse, Lever, or any job board. Our AI will extract the full description.
        </p>
      </div>

      {/* URL Input */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-text-primary">Paste Job URL</h3>
            <p className="text-[12px] text-text-tertiary">Works with any job board</p>
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="url"
            className="input-field flex-1"
            placeholder="https://linkedin.com/jobs/view/123456..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleImport()}
          />
          <Button onClick={handleImport} loading={loading} size="md">
            {loading ? 'Extracting...' : 'Import'}
          </Button>
        </div>

        {/* Supported Sites */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border-subtle">
          <span className="text-[11px] text-text-muted">Supported:</span>
          {['LinkedIn', 'Indeed', 'Glassdoor', 'Greenhouse', 'Lever', 'Workday', 'AngelList'].map((site) => (
            <Badge key={site} variant="default" size="sm">{site}</Badge>
          ))}
        </div>
      </Card>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card variant="default" className="text-center py-10">
              <div className="flex items-center justify-center gap-1.5 mb-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
              <p className="text-[13px] text-text-tertiary">AI is extracting job details from the URL...</p>
              <p className="text-[11px] text-text-muted mt-1">This usually takes 5–10 seconds</p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Extracted Job Preview */}
      <AnimatePresence>
        {extracted && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card variant="elevated" padding="lg">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-2xl">
                    🏢
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-text-primary">{extracted.title}</h3>
                    <p className="text-[13px] text-text-tertiary">{extracted.company} {extracted.location && `· ${extracted.location}`}</p>
                  </div>
                </div>
                <Badge variant="success" dot>Extracted</Badge>
              </div>

              {/* Skills Tags */}
              {extracted.skills?.length > 0 && (
                <div className="mb-5">
                  <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {extracted.skills.map((skill: string, i: number) => (
                      <Badge key={i} variant="brand" size="sm">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-5">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">Job Description</p>
                <div className="p-4 bg-surface-50 border border-border-subtle rounded-xl">
                  <p className="text-[13px] text-text-secondary leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                    {extracted.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border-subtle">
                <Button onClick={handleAddToTracker} className="flex-1">
                  ✓ Add to Application Tracker
                </Button>
                <Button variant="secondary" onClick={() => {
                  navigator.clipboard.writeText(extracted.description);
                  toast.success('Description copied!');
                }}>
                  📋 Copy Description
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <Card variant="default" className="bg-gradient-to-br from-sky-50 to-white border-sky-100" padding="md">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">💡</span>
          </div>
          <div>
            <h4 className="text-[13px] font-semibold text-text-primary mb-1">Pro Tips</h4>
            <ul className="text-[12px] text-text-tertiary space-y-1">
              <li>• Works with any public job posting URL</li>
              <li>• If extraction fails, copy-paste the job description manually into Resume Analyzer</li>
              <li>• Imported jobs are automatically added to your Application Tracker</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}