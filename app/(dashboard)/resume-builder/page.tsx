'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useProfile } from '@/hooks/useProfile';
import { WorkExperience, Education } from '@/types';
import { generateId, formatDate, cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const TEMPLATES = [
  { id: 'classic', name: 'Classic', desc: 'Clean & professional', color: 'border-gray-300' },
  { id: 'modern', name: 'Modern', desc: 'Contemporary feel', color: 'border-violet-300' },
  { id: 'minimal', name: 'Minimal', desc: 'Simple & elegant', color: 'border-slate-300' },
];

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
}

export default function ResumeBuilderPage() {
  const { profile } = useProfile();
  const [template, setTemplate] = useState('classic');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [newSkill, setNewSkill] = useState('');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [scoringAts, setScoringAts] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ResumeData>({
    name: '', email: '', phone: '', location: '',
    linkedin: '', portfolio: '', summary: '',
    skills: [], experience: [], education: [],
  });

  // Load from profile on mount
  useEffect(() => {
    if (profile) {
      setData({
        name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        linkedin: profile.linkedin_url || '',
        portfolio: profile.portfolio_url || '',
        summary: profile.summary || '',
        skills: profile.skills || [],
        experience: profile.work_history || [],
        education: profile.education || [],
      });
    }
  }, [profile]);

  const update = (field: keyof ResumeData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    setAtsScore(null); // Reset score when content changes
  };

  const addSkill = () => {
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      update('skills', [...data.skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (idx: number) => {
    update('skills', data.skills.filter((_, i) => i !== idx));
  };

  // Calculate real ATS score
  const calculateAtsScore = async () => {
    setScoringAts(true);
    try {
      const res = await fetch('/api/resume/ats-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: data }),
      });
      const result = await res.json();
      if (result.score !== undefined) {
        setAtsScore(result.score);
        toast.success(`ATS Score: ${result.score}/100`);
      }
    } catch {
      toast.error('Failed to calculate ATS score');
    } finally {
      setScoringAts(false);
    }
  };

  // Export as text file (works everywhere, no extra deps)
  const handleExport = () => {
    const lines: string[] = [];

    if (data.name) lines.push(data.name.toUpperCase());
    const contact = [data.email, data.phone, data.location].filter(Boolean).join(' | ');
    if (contact) lines.push(contact);
    const links = [data.linkedin, data.portfolio].filter(Boolean).join(' | ');
    if (links) lines.push(links);

    if (data.summary) {
      lines.push('', '═══ PROFESSIONAL SUMMARY ═══', '', data.summary);
    }

    if (data.skills.length) {
      lines.push('', '═══ SKILLS ═══', '', data.skills.join(' • '));
    }

    if (data.experience.length) {
      lines.push('', '═══ WORK EXPERIENCE ═══');
      data.experience.forEach(job => {
        lines.push('');
        lines.push(`${job.title} | ${job.company}`);
        lines.push(`${formatDate(job.start_date)} – ${job.current ? 'Present' : formatDate(job.end_date)} ${job.location ? '| ' + job.location : ''}`);
        if (job.description) lines.push(job.description);
      });
    }

    if (data.education.length) {
      lines.push('', '═══ EDUCATION ═══');
      data.education.forEach(edu => {
        lines.push('');
        lines.push(`${edu.degree}${edu.field ? ' in ' + edu.field : ''} | ${edu.institution}`);
        lines.push(`${formatDate(edu.start_date)} – ${formatDate(edu.end_date)}${edu.gpa ? ' | GPA: ' + edu.gpa : ''}`);
      });
    }

    const text = lines.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(data.name || 'resume').replace(/\s+/g, '_')}_resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Resume downloaded!');
  };

  // Print as PDF (uses browser print dialog)
  const handlePrintPDF = () => {
    setMode('preview');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const templateFont: Record<string, string> = {
    classic: 'font-serif',
    modern: 'font-sans',
    minimal: 'font-mono',
  };

  const templateAccent: Record<string, string> = {
    classic: 'border-gray-800',
    modern: 'border-violet-600',
    minimal: 'border-slate-400',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Resume Builder 📝</h1>
          <p className="text-sm text-text-tertiary mt-1">Build ATS-friendly resumes with live preview</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={mode === 'edit' ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
          >
            {mode === 'edit' ? '👁️ Preview' : '✏️ Back to Edit'}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExport}>
            📄 Download .txt
          </Button>
          <Button size="sm" onClick={handlePrintPDF}>
            📥 Print / PDF
          </Button>
        </div>
      </div>

      {/* Template Selection - only in edit mode */}
      <AnimatePresence>
        {mode === 'edit' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex gap-3 print:hidden">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    'flex-1 p-3 rounded-xl border-2 text-left transition-all',
                    template === t.id
                      ? 'border-brand-400 bg-brand-50 ring-2 ring-brand-100'
                      : 'border-border-subtle hover:border-border-default'
                  )}
                >
                  <div className="text-[13px] font-bold text-text-primary">{t.name}</div>
                  <div className="text-[11px] text-text-tertiary">{t.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn(
        'grid gap-6',
        mode === 'edit' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-3xl mx-auto'
      )}>

        {/* Editor - only in edit mode */}
        <AnimatePresence>
          {mode === 'edit' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 print:hidden"
            >
              {/* Contact */}
              <Card variant="default" padding="md">
                <h3 className="text-[13px] font-semibold text-text-primary mb-3">Contact Info</h3>
                <div className="space-y-3">
                  <input className="input-field" placeholder="Full Name" value={data.name} onChange={e => update('name', e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="input-field" placeholder="Email" value={data.email} onChange={e => update('email', e.target.value)} />
                    <input className="input-field" placeholder="Phone" value={data.phone} onChange={e => update('phone', e.target.value)} />
                  </div>
                  <input className="input-field" placeholder="Location" value={data.location} onChange={e => update('location', e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="input-field" placeholder="LinkedIn URL" value={data.linkedin} onChange={e => update('linkedin', e.target.value)} />
                    <input className="input-field" placeholder="Portfolio URL" value={data.portfolio} onChange={e => update('portfolio', e.target.value)} />
                  </div>
                </div>
              </Card>

              {/* Summary */}
              <Card variant="default" padding="md">
                <h3 className="text-[13px] font-semibold text-text-primary mb-3">Professional Summary</h3>
                <textarea className="input-field resize-none h-28 text-[13px]" placeholder="2-3 sentence overview..." value={data.summary} onChange={e => update('summary', e.target.value)} />
              </Card>

              {/* Skills */}
              <Card variant="default" padding="md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-semibold text-text-primary">Skills</h3>
                  <Badge variant="brand" size="sm">{data.skills.length}</Badge>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {data.skills.map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 border border-brand-200 rounded-full text-[11px] font-medium text-brand-700">
                      {s}
                      <button onClick={() => removeSkill(i)} className="hover:text-red-500 ml-0.5">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    className="input-field flex-1 text-[13px]"
                    placeholder="Add skill and press Enter..."
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSkill()}
                  />
                  <Button size="sm" variant="secondary" onClick={addSkill}>Add</Button>
                </div>
              </Card>

              {/* Experience - read from profile */}
              <Card variant="default" padding="md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-semibold text-text-primary">Work Experience</h3>
                  <Badge variant="default" size="sm">{data.experience.length} jobs</Badge>
                </div>
                {data.experience.length === 0 ? (
                  <p className="text-[12px] text-text-muted text-center py-4">
                    Add experience in your <a href="/profile" className="text-brand-600 underline">Profile</a> and it will appear here
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.experience.map((job, i) => (
                      <div key={i} className="p-3 bg-surface-50 border border-border-subtle rounded-lg">
                        <div className="text-[13px] font-semibold text-text-primary">{job.title}</div>
                        <div className="text-[12px] text-text-tertiary">{job.company} {job.location && `· ${job.location}`}</div>
                        <div className="text-[11px] text-text-muted mt-0.5">
                          {formatDate(job.start_date)} – {job.current ? 'Present' : formatDate(job.end_date)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Education - read from profile */}
              <Card variant="default" padding="md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-semibold text-text-primary">Education</h3>
                  <Badge variant="default" size="sm">{data.education.length}</Badge>
                </div>
                {data.education.length === 0 ? (
                  <p className="text-[12px] text-text-muted text-center py-4">
                    Add education in your <a href="/profile" className="text-brand-600 underline">Profile</a>
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.education.map((edu, i) => (
                      <div key={i} className="p-3 bg-surface-50 border border-border-subtle rounded-lg">
                        <div className="text-[13px] font-semibold text-text-primary">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                        <div className="text-[12px] text-text-tertiary">{edu.institution}</div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* ATS Score */}
              <Card variant="default" padding="md" className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[13px] font-semibold text-text-primary">ATS-Friendly Score</h3>
                    <p className="text-[11px] text-text-tertiary mt-0.5">Check how well your resume passes automated screening</p>
                  </div>
                  {atsScore !== null ? (
                    <div className="text-right">
                      <div className={cn(
                        'text-2xl font-black',
                        atsScore >= 80 ? 'text-emerald-600' : atsScore >= 60 ? 'text-amber-600' : 'text-red-600'
                      )}>
                        {atsScore}/100
                      </div>
                      <button onClick={() => setAtsScore(null)} className="text-[11px] text-text-muted hover:text-text-secondary mt-0.5">Recalculate</button>
                    </div>
                  ) : (
                    <Button size="sm" onClick={calculateAtsScore} loading={scoringAts}>
                      {scoringAts ? 'Calculating...' : 'Check Score'}
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resume Preview */}
        <div className={cn(mode === 'preview' ? 'w-full' : 'lg:sticky lg:top-8')}>
          <Card variant="elevated" padding="none" className={cn('overflow-hidden', mode === 'preview' && 'shadow-2xl')}>
            <div
              ref={resumeRef}
              className={cn(
                'bg-white p-8 print:p-12',
                mode === 'preview' ? 'min-h-[800px]' : 'min-h-[600px]',
                templateFont[template]
              )}
              id="resume-preview"
            >
              {/* Header */}
              <div className={cn('pb-4 mb-4 border-b-2', templateAccent[template])}>
                <h2 className="text-2xl font-bold text-gray-900">{data.name || 'Your Name'}</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                  {data.email && <span>{data.email}</span>}
                  {data.phone && <span>{data.phone}</span>}
                  {data.location && <span>{data.location}</span>}
                </div>
                <div className="flex flex-wrap gap-x-4 mt-1 text-sm text-gray-500">
                  {data.linkedin && <span>{data.linkedin}</span>}
                  {data.portfolio && <span>{data.portfolio}</span>}
                </div>
              </div>

              {/* Summary */}
              {data.summary && (
                <div className="mb-5">
                  <h3 className={cn(
                    'text-xs font-bold uppercase tracking-wider mb-2',
                    template === 'modern' ? 'text-violet-700' : 'text-gray-800'
                  )}>Professional Summary</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
                </div>
              )}

              {/* Skills */}
              {data.skills.length > 0 && (
                <div className="mb-5">
                  <h3 className={cn(
                    'text-xs font-bold uppercase tracking-wider mb-2',
                    template === 'modern' ? 'text-violet-700' : 'text-gray-800'
                  )}>Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((s, i) => (
                      <span key={i} className={cn(
                        'px-2.5 py-1 rounded text-xs font-medium',
                        template === 'modern'
                          ? 'bg-violet-50 text-violet-700 border border-violet-200'
                          : 'bg-gray-100 text-gray-700'
                      )}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {data.experience.length > 0 && (
                <div className="mb-5">
                  <h3 className={cn(
                    'text-xs font-bold uppercase tracking-wider mb-3',
                    template === 'modern' ? 'text-violet-700' : 'text-gray-800'
                  )}>Work Experience</h3>
                  <div className="space-y-4">
                    {data.experience.map((job, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-bold text-gray-900">{job.title}</span>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-4">
                            {formatDate(job.start_date)} – {job.current ? 'Present' : formatDate(job.end_date)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          {job.company}{job.location && ` · ${job.location}`}
                        </div>
                        {job.description && (
                          <p className="text-sm text-gray-700 mt-1 leading-relaxed whitespace-pre-line">{job.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {data.education.length > 0 && (
                <div className="mb-5">
                  <h3 className={cn(
                    'text-xs font-bold uppercase tracking-wider mb-3',
                    template === 'modern' ? 'text-violet-700' : 'text-gray-800'
                  )}>Education</h3>
                  <div className="space-y-3">
                    {data.education.map((edu, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-bold text-gray-900">
                            {edu.degree}{edu.field && ` in ${edu.field}`}
                          </span>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-4">
                            {formatDate(edu.start_date)} – {formatDate(edu.end_date)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {edu.institution}{edu.gpa && ` · GPA: ${edu.gpa}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!data.name && !data.summary && data.skills.length === 0 && data.experience.length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <span className="text-4xl mb-3">📄</span>
                  <p className="text-sm text-gray-400">Fill in the editor to see your resume preview</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #resume-preview, #resume-preview * { visibility: visible; }
          #resume-preview { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}