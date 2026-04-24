'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '@/hooks/useProfile';
import { WorkExperience, Education } from '@/types';
import { generateId, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'autofill', label: 'Autofill', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  )},
  { id: 'basics', label: 'Basic Info', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  )},
  { id: 'experience', label: 'Experience', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )},
  { id: 'education', label: 'Education', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )},
  { id: 'preferences', label: 'Preferences', icon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )},
];

function AutofillPanel({ profile }: { profile: any }) {
  const [copied, setCopied] = useState<string | null>(null);

  const fields = [
    { label: 'Full Name', value: profile?.full_name },
    { label: 'Email', value: profile?.email },
    { label: 'Phone', value: profile?.phone },
    { label: 'Location', value: profile?.location },
    { label: 'LinkedIn URL', value: profile?.linkedin_url },
    { label: 'Portfolio / Website', value: profile?.portfolio_url },
    { label: 'Professional Summary', value: profile?.summary },
  ].filter((f) => f.value);

  const copy = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = async () => {
    const text = fields.map((f) => `${f.label}: ${f.value}`).join('\n');
    await navigator.clipboard.writeText(text);
    toast.success('All fields copied!');
  };

  if (fields.length === 0) {
    return (
      <Card variant="default" padding="md">
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-2xl bg-surface-200 flex items-center justify-center mx-auto mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            </svg>
          </div>
          <p className="text-[13px] text-text-tertiary">
            Complete your basic info first
          </p>
          <p className="text-[12px] text-text-muted mt-1">
            Then use this tab to quickly copy fields into job application forms
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card variant="default" padding="md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-semibold text-text-primary">
              Quick Copy Fields
            </h3>
            <p className="text-[12px] text-text-muted mt-0.5">
              Click any field to copy it instantly for job application forms
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={copyAll}>
            Copy All
          </Button>
        </div>
        <div className="space-y-2">
          {fields.map((field) => (
            <button
              key={field.label}
              onClick={() => copy(field.label, field.value)}
              className="w-full flex items-center justify-between p-3 bg-surface-200 hover:bg-surface-300 rounded-xl border border-border-subtle hover:border-border-default transition-all group text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5 font-medium">
                  {field.label}
                </div>
                <div className="text-[13px] text-text-secondary truncate">
                  {field.value}
                </div>
              </div>
              <div
                className={cn(
                  'ml-4 flex items-center gap-1.5 text-[11px] font-medium transition-colors flex-shrink-0',
                  copied === field.label
                    ? 'text-accent-emerald'
                    : 'text-text-muted group-hover:text-text-secondary'
                )}
              >
                {copied === field.label ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    Copy
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card
        variant="default"
        className="bg-brand-500/5 border-brand-500/10"
        padding="md"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-text-primary mb-1">
              How to use Autofill
            </p>
            <p className="text-[12px] text-text-tertiary leading-relaxed">
              When filling out a job application form, click the field you need
              above to copy it, then paste it directly into the form. This works
              on any website!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  const { profile, loading, saving, saveProfile } = useProfile();
  const [activeTab, setActiveTab] = useState<
    'autofill' | 'basics' | 'experience' | 'education' | 'preferences'
  >('autofill');
  const [formData, setFormData] = useState<any>({});
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [showEduModal, setShowEduModal] = useState(false);
  const [newWork, setNewWork] = useState<Partial<WorkExperience>>({
    current: false,
  });
  const [newEdu, setNewEdu] = useState<Partial<Education>>({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const update = (updates: any) => {
    setFormData((p: any) => ({ ...p, ...updates }));
    setDirty(true);
  };

  const handleSave = async () => {
    await saveProfile(formData);
    setDirty(false);
  };

  const addWorkExperience = () => {
    if (!newWork.title || !newWork.company) {
      toast.error('Title and company are required');
      return;
    }
    const updated = [
      ...(formData.work_history || []),
      { ...newWork, id: generateId() },
    ];
    update({ work_history: updated });
    setShowWorkModal(false);
    setNewWork({ current: false });
    toast.success('Experience added!');
  };

  const removeWork = (id: string) => {
    update({
      work_history: formData.work_history.filter(
        (w: WorkExperience) => w.id !== id
      ),
    });
  };

  const addEducation = () => {
    if (!newEdu.institution) {
      toast.error('Institution is required');
      return;
    }
    const updated = [
      ...(formData.education || []),
      { ...newEdu, id: generateId() },
    ];
    update({ education: updated });
    setShowEduModal(false);
    setNewEdu({});
    toast.success('Education added!');
  };

  const removeEdu = (id: string) => {
    update({
      education: formData.education.filter((e: Education) => e.id !== id),
    });
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="skeleton h-10 w-48 rounded-xl" />
        <div className="skeleton h-12 w-full rounded-xl" />
        <div className="skeleton h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            My Profile
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            Keep your profile updated for better AI personalization
          </p>
        </div>
        {dirty && (
          <Button
            onClick={handleSave}
            loading={saving}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
                <path d="M7 3v4a1 1 0 0 0 1 1h7" />
              </svg>
            }
          >
            Save Changes
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-surface-100 border border-border-subtle rounded-2xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium transition-all',
              activeTab === tab.id
                ? 'bg-surface-300 text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            <span
              className={
                activeTab === tab.id ? 'text-brand-400' : 'text-text-muted'
              }
            >
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Autofill Tab */}
          {activeTab === 'autofill' && (
            <AutofillPanel profile={formData} />
          )}

          {/* Basic Info Tab */}
          {activeTab === 'basics' && (
            <Card variant="default" padding="md">
              <h3 className="text-[13px] font-semibold text-text-primary mb-5">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1.5 block">
                    Full Name
                  </label>
                  <input
                    className="input-field"
                    placeholder="John Doe"
                    value={formData.full_name || ''}
                    onChange={(e) => update({ full_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1.5 block">
                    Email
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="john@example.com"
                    value={formData.email || ''}
                    onChange={(e) => update({ email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1.5 block">
                    Phone
                  </label>
                  <input
                    className="input-field"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone || ''}
                    onChange={(e) => update({ phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1.5 block">
                    Location
                  </label>
                  <input
                    className="input-field"
                    placeholder="San Francisco, CA"
                    value={formData.location || ''}
                    onChange={(e) => update({ location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1.5 block">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedin_url || ''}
                    onChange={(e) => update({ linkedin_url: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1.5 block">
                    Portfolio / Website
                  </label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://..."
                    value={formData.portfolio_url || ''}
                    onChange={(e) => update({ portfolio_url: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1.5 block">
                    Professional Summary
                  </label>
                  <textarea
                    rows={5}
                    className="input-field resize-none"
                    placeholder="Brief summary of your experience, skills, and career goals..."
                    value={formData.summary || ''}
                    onChange={(e) => update({ summary: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-border-subtle flex justify-end">
                <Button
                  onClick={handleSave}
                  loading={saving}
                  size="sm"
                >
                  Save Changes
                </Button>
              </div>
            </Card>
          )}

          {/* Work Experience Tab */}
          {activeTab === 'experience' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-[12px] text-text-muted">
                  {(formData.work_history || []).length} positions added
                </p>
                <Button
                  size="sm"
                  onClick={() => setShowWorkModal(true)}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14" /><path d="M12 5v14" />
                    </svg>
                  }
                >
                  Add Position
                </Button>
              </div>

              {(formData.work_history || []).length === 0 ? (
                <Card variant="default" padding="md" className="text-center py-10">
                  <div className="w-12 h-12 rounded-2xl bg-surface-200 flex items-center justify-center mx-auto mb-3">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
                      <rect width="20" height="14" x="2" y="7" rx="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <p className="text-[13px] text-text-tertiary mb-4">
                    No work experience added
                  </p>
                  <Button size="sm" onClick={() => setShowWorkModal(true)}>
                    Add Your First Position
                  </Button>
                </Card>
              ) : (
                (formData.work_history as WorkExperience[]).map((job) => (
                  <Card key={job.id} variant="default" padding="md">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[14px] font-semibold text-text-primary">
                            {job.title}
                          </span>
                          {job.current && (
                            <Badge variant="success" size="sm" dot>
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="text-[13px] text-brand-400 font-medium mb-1">
                          {job.company}
                        </div>
                        <div className="text-[12px] text-text-muted">
                          {formatDate(job.start_date)} —{' '}
                          {job.current ? 'Present' : formatDate(job.end_date ?? undefined)}
                          {job.location && ` · ${job.location}`}
                        </div>
                        {job.description && (
                          <p className="text-[12px] text-text-tertiary mt-2 leading-relaxed line-clamp-2">
                            {job.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeWork(job.id)}
                        className="ml-4 w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-accent-rose hover:bg-rose-500/10 transition-all flex-shrink-0"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-[12px] text-text-muted">
                  {(formData.education || []).length} schools added
                </p>
                <Button
                  size="sm"
                  onClick={() => setShowEduModal(true)}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14" /><path d="M12 5v14" />
                    </svg>
                  }
                >
                  Add Education
                </Button>
              </div>

              {(formData.education || []).length === 0 ? (
                <Card variant="default" padding="md" className="text-center py-10">
                  <div className="w-12 h-12 rounded-2xl bg-surface-200 flex items-center justify-center mx-auto mb-3">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  </div>
                  <p className="text-[13px] text-text-tertiary mb-4">
                    No education added
                  </p>
                  <Button size="sm" onClick={() => setShowEduModal(true)}>
                    Add Education
                  </Button>
                </Card>
              ) : (
                (formData.education as Education[]).map((edu) => (
                  <Card key={edu.id} variant="default" padding="md">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-[14px] font-semibold text-text-primary mb-0.5">
                          {edu.degree}
                          {edu.field && ` in ${edu.field}`}
                        </div>
                        <div className="text-[13px] text-brand-400 font-medium mb-1">
                          {edu.institution}
                        </div>
                        <div className="text-[12px] text-text-muted">
                          {formatDate(edu.start_date)} —{' '}
                          {formatDate(edu.end_date ?? undefined)}
                          {edu.gpa && ` · GPA: ${edu.gpa}`}
                        </div>
                      </div>
                      <button
                        onClick={() => removeEdu(edu.id)}
                        className="ml-4 w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-accent-rose hover:bg-rose-500/10 transition-all"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <Card variant="default" padding="md">
              <h3 className="text-[13px] font-semibold text-text-primary mb-5">
                Your Job Preferences
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2 block">
                    Interested Roles
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(formData.interested_roles || []).map((r: string) => (
                      <Badge key={r} variant="brand" size="sm">{r}</Badge>
                    ))}
                    {!formData.interested_roles?.length && (
                      <span className="text-[12px] text-text-muted">None selected</span>
                    )}
                  </div>
                </div>

                <div className="divider" />

                <div>
                  <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2 block">
                    Preferred Locations
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(formData.preferred_locations || []).map((l: string) => (
                      <Badge key={l} variant="info" size="sm">{l}</Badge>
                    ))}
                    {!formData.preferred_locations?.length && (
                      <span className="text-[12px] text-text-muted">None selected</span>
                    )}
                  </div>
                </div>

                <div className="divider" />

                <div>
                  <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2 block">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(formData.skills || []).map((s: string) => (
                      <Badge key={s} variant="success" size="sm">{s}</Badge>
                    ))}
                    {!formData.skills?.length && (
                      <span className="text-[12px] text-text-muted">None selected</span>
                    )}
                  </div>
                </div>

                <div className="divider" />

                <div>
                  <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2 block">
                    Minimum Salary
                  </label>
                  <span className="text-2xl font-bold text-text-primary">
                    ${((formData.min_salary || 0) / 1000).toFixed(0)}
                    <span className="text-base text-text-muted font-normal">K/yr</span>
                  </span>
                </div>

                <div className="divider" />

                <div>
                  <label className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2 block">
                    Company Sizes
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(formData.company_sizes || []).map((s: string) => (
                      <Badge key={s} variant="default" size="sm">{s} employees</Badge>
                    ))}
                    {!formData.company_sizes?.length && (
                      <span className="text-[12px] text-text-muted">No preference</span>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-4 bg-brand-500/5 border border-brand-500/10 rounded-xl">
                  <p className="text-[12px] text-brand-400">
                    To update preferences, go through onboarding again or contact support.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Work Experience Modal */}
      <AnimatePresence>
        {showWorkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowWorkModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md"
            >
              <Card variant="elevated" padding="md">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[15px] font-bold text-text-primary">
                    Add Work Experience
                  </h3>
                  <button
                    onClick={() => setShowWorkModal(false)}
                    className="w-7 h-7 rounded-lg bg-surface-200 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Job Title *</label>
                      <input className="input-field text-[13px]" placeholder="Software Engineer" value={newWork.title || ''} onChange={(e) => setNewWork((p) => ({ ...p, title: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Company *</label>
                      <input className="input-field text-[13px]" placeholder="Google" value={newWork.company || ''} onChange={(e) => setNewWork((p) => ({ ...p, company: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Location</label>
                    <input className="input-field text-[13px]" placeholder="San Francisco, CA" value={newWork.location || ''} onChange={(e) => setNewWork((p) => ({ ...p, location: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Start Date</label>
                      <input type="month" className="input-field text-[13px]" value={newWork.start_date || ''} onChange={(e) => setNewWork((p) => ({ ...p, start_date: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">End Date</label>
                      <input type="month" className="input-field text-[13px]" disabled={newWork.current} value={newWork.end_date || ''} onChange={(e) => setNewWork((p) => ({ ...p, end_date: e.target.value }))} />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setNewWork((p) => ({ ...p, current: !p.current }))}
                      className={cn(
                        'w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer',
                        newWork.current ? 'bg-brand-600 border-brand-600' : 'border-border-strong'
                      )}
                    >
                      {newWork.current && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[12px] text-text-tertiary">Currently working here</span>
                  </label>
                  <div>
                    <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Description</label>
                    <textarea rows={3} className="input-field text-[13px] resize-none" placeholder="Key responsibilities and achievements..." value={newWork.description || ''} onChange={(e) => setNewWork((p) => ({ ...p, description: e.target.value }))} />
                  </div>
                </div>
                <div className="flex gap-2 mt-5">
                  <Button variant="secondary" fullWidth onClick={() => setShowWorkModal(false)}>Cancel</Button>
                  <Button fullWidth onClick={addWorkExperience}>Add Experience</Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Education Modal */}
      <AnimatePresence>
        {showEduModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowEduModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md"
            >
              <Card variant="elevated" padding="md">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[15px] font-bold text-text-primary">
                    Add Education
                  </h3>
                  <button
                    onClick={() => setShowEduModal(false)}
                    className="w-7 h-7 rounded-lg bg-surface-200 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Institution *</label>
                    <input className="input-field text-[13px]" placeholder="MIT" value={newEdu.institution || ''} onChange={(e) => setNewEdu((p) => ({ ...p, institution: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Degree</label>
                      <input className="input-field text-[13px]" placeholder="Bachelor of Science" value={newEdu.degree || ''} onChange={(e) => setNewEdu((p) => ({ ...p, degree: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Field of Study</label>
                      <input className="input-field text-[13px]" placeholder="Computer Science" value={newEdu.field || ''} onChange={(e) => setNewEdu((p) => ({ ...p, field: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Start Date</label>
                      <input type="month" className="input-field text-[13px]" value={newEdu.start_date || ''} onChange={(e) => setNewEdu((p) => ({ ...p, start_date: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">End Date</label>
                      <input type="month" className="input-field text-[13px]" value={newEdu.end_date || ''} onChange={(e) => setNewEdu((p) => ({ ...p, end_date: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">GPA (optional)</label>
                    <input className="input-field text-[13px]" placeholder="3.8" value={newEdu.gpa || ''} onChange={(e) => setNewEdu((p) => ({ ...p, gpa: e.target.value }))} />
                  </div>
                </div>
                <div className="flex gap-2 mt-5">
                  <Button variant="secondary" fullWidth onClick={() => setShowEduModal(false)}>Cancel</Button>
                  <Button fullWidth onClick={addEducation}>Add Education</Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}