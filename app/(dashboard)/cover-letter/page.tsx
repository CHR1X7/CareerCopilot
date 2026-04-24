'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useProfile } from '@/hooks/useProfile';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function CoverLetterPage() {
  const { profile } = useProfile();
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [hiringManager, setHiringManager] = useState('');
  const [generated, setGenerated] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste the job description');
      return;
    }

    setLoading(true);
    setGenerated('');

    try {
      const res = await fetch('/api/generate/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: jobDescription,
          company_name: companyName,
          hiring_manager: hiringManager,
          profile,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setGenerated(data.cover_letter);
      toast.success('Cover letter generated!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to generate');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          ✉️ <span className="gradient-text-brand">Cover Letter</span>
        </h1>
        <p className="text-sm text-text-tertiary mt-1">
          Generate personalized cover letters tailored to each job application
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input */}
        <div className="space-y-4">
          <Card variant="default" padding="md">
            <h3 className="text-[13px] font-semibold text-text-primary mb-3">Job Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Company Name</label>
                <input className="input-field" placeholder="e.g., Google" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div>
                <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Hiring Manager (optional)</label>
                <input className="input-field" placeholder="e.g., Sarah Johnson" value={hiringManager} onChange={(e) => setHiringManager(e.target.value)} />
              </div>
              <div>
                <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Job Description *</label>
                <textarea className="input-field resize-none h-48" placeholder="Paste the full job description here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
              </div>
            </div>
          </Card>

          <Button onClick={handleGenerate} loading={loading} fullWidth size="lg">
            {loading ? 'Generating...' : '✨ Generate Cover Letter'}
          </Button>

          {/* Tips */}
          <Card variant="default" className="bg-gradient-to-br from-amber-50 to-white border-amber-100" padding="md">
            <div className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <h4 className="text-[13px] font-semibold text-text-primary mb-1">Pro Tips</h4>
                <ul className="text-[12px] text-text-tertiary space-y-1">
                  <li>• Personalize the hiring manager name if you know it</li>
                  <li>• Mention specific projects from your experience</li>
                  <li>• Keep it under 400 words for best results</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Output */}
        <div>
          <Card variant="elevated" padding="lg" className="min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-text-primary">Generated Cover Letter</h3>
              {generated && (
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={handleCopy}>
                    {copied ? '✓ Copied' : '📋 Copy'}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => toast.success('Downloaded! (Demo)')}>
                    📥 Download
                  </Button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-80">
                <div className="flex items-center gap-1.5 mb-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
                <p className="text-[13px] text-text-tertiary">AI is crafting your personalized cover letter...</p>
                <p className="text-[11px] text-text-muted mt-1">Usually takes 10–15 seconds</p>
              </div>
            ) : generated ? (
              <div className="prose prose-sm max-w-none">
                <div className="p-6 bg-white border border-border-subtle rounded-xl whitespace-pre-line text-[13px] text-text-secondary leading-relaxed">
                  {generated}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-center">
                <span className="text-4xl mb-3">✉️</span>
                <p className="text-[13px] text-text-tertiary">Paste a job description and click generate</p>
                <p className="text-[11px] text-text-muted mt-1">Your personalized cover letter will appear here</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}