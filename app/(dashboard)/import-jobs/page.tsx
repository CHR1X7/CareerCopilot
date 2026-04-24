'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useApplications } from '@/hooks/useApplications';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export default function ImportJobsPage() {
  const [url, setUrl] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState<any>(null);
  const [showManual, setShowManual] = useState(false);
  const { addApplication } = useApplications();
  const router = useRouter();

  const handleImport = async (useManual = false) => {
    if (!useManual && !url.trim()) {
      toast.error('Please paste a job URL');
      return;
    }
    if (useManual && !manualContent.trim()) {
      toast.error('Please paste the job description');
      return;
    }

    setLoading(true);
    setExtracted(null);

    try {
      const res = await fetch('/api/import-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: useManual ? '' : url,
          manualContent: useManual ? manualContent : '',
        }),
      });

      const data = await res.json();

      if (data.needsManualInput) {
        setShowManual(true);
        toast.error(data.error);
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error(data.error);

      setExtracted(data.job);
      toast.success('Job extracted successfully!');
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
        company_name: extracted.company || 'Unknown Company',
        job_title: extracted.title || 'Unknown Position',
        job_url: url || undefined,
        job_description: extracted.description || '',
        status: 'not_submitted',
      });
      toast.success('Added to your application tracker!');
      router.push('/applications');
    } catch {
      toast.error('Failed to add to tracker');
    }
  };

  const handleAnalyzeResume = () => {
    if (!extracted?.description) return;
    // Store in sessionStorage so resume analyzer can pick it up
    sessionStorage.setItem('imported_jd', extracted.description);
    router.push('/resume-analyzer');
    toast.success('Job description loaded in Resume Analyzer!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          🔗 <span className="gradient-text-brand">Import Jobs</span>
        </h1>
        <p className="text-sm text-text-tertiary mt-1">
          Paste a job URL or the job description text — our AI extracts all the details
        </p>
      </div>

      {/* URL Input */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-text-primary">Paste Job URL</h3>
            <p className="text-[12px] text-text-tertiary">We'll try to extract the job details automatically</p>
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="url"
            className="input-field flex-1"
            placeholder="https://linkedin.com/jobs/view/123456..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleImport(false)}
          />
          <Button onClick={() => handleImport(false)} loading={loading && !showManual} size="md">
            {loading && !showManual ? 'Extracting...' : 'Import'}
          </Button>
        </div>

        {/* Toggle manual input */}
        <div className="mt-3 pt-3 border-t border-border-subtle">
          <button
            onClick={() => setShowManual(!showManual)}
            className="text-[12px] text-brand-600 hover:text-brand-700 font-medium transition-colors"
          >
            {showManual ? '↑ Hide manual input' : '↓ Or paste the job description text directly'}
          </button>
        </div>

        {/* Manual paste */}
        <AnimatePresence>
          {showManual && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <textarea
                className="input-field resize-none h-48 text-[13px]"
                placeholder="Paste the full job description text here. Copy everything from the job posting page..."
                value={manualContent}
                onChange={(e) => setManualContent(e.target.value)}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-[11px] text-text-muted">
                  {manualContent.length > 0 && `${manualContent.length} characters`}
                </span>
                <Button size="sm" onClick={() => handleImport(true)} loading={loading}>
                  Extract from Text
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card variant="default" className="text-center py-10">
              <div className="flex items-center justify-center gap-1.5 mb-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
              <p className="text-[13px] text-text-tertiary">AI is extracting job details...</p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Extracted Job */}
      <AnimatePresence>
        {extracted && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card variant="elevated" padding="lg">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-2xl flex-shrink-0">
                    🏢
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-text-primary">{extracted.title || 'Unknown Title'}</h3>
                    <p className="text-[13px] text-text-tertiary">
                      {extracted.company || 'Unknown Company'}
                      {extracted.location && ` · ${extracted.location}`}
                      {extracted.job_type && ` · ${extracted.job_type}`}
                    </p>
                    {extracted.salary && (
                      <p className="text-[12px] text-emerald-600 font-semibold mt-0.5">💰 {extracted.salary}</p>
                    )}
                  </div>
                </div>
                <Badge variant="success" dot>Extracted</Badge>
              </div>

              {/* Skills */}
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
              {extracted.description && (
                <div className="mb-5">
                  <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">Job Description</p>
                  <div className="p-4 bg-surface-50 border border-border-subtle rounded-xl max-h-64 overflow-y-auto">
                    <p className="text-[13px] text-text-secondary leading-relaxed whitespace-pre-line">{extracted.description}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border-subtle">
                <Button onClick={handleAddToTracker} className="flex-1">
                  ✓ Add to Tracker
                </Button>
                <Button variant="secondary" onClick={handleAnalyzeResume}>
                  📊 Analyze Resume Match
                </Button>
                <Button variant="secondary" onClick={() => {
                  navigator.clipboard.writeText(extracted.description || '');
                  toast.success('Description copied!');
                }}>
                  📋 Copy
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}