'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useProfile } from '@/hooks/useProfile';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const TEMPLATES = [
  { id: 'classic', name: 'Classic', preview: '📄', desc: 'Clean, professional, ATS-friendly' },
  { id: 'modern', name: 'Modern', preview: '🎨', desc: 'Contemporary with subtle colors' },
  { id: 'minimal', name: 'Minimal', preview: '⚪', desc: 'Simple, elegant, one-column' },
  { id: 'creative', name: 'Creative', preview: '🌈', desc: 'Bold design for creative roles' },
];

export default function ResumeBuilderPage() {
  const { profile, saving, saveProfile } = useProfile();
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const [resumeData, setResumeData] = useState({
    name: profile?.full_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    summary: profile?.summary || '',
    skills: profile?.skills || [],
    experience: profile?.work_history || [],
    education: profile?.education || [],
  });

  const handleSave = async () => {
    await saveProfile({
      full_name: resumeData.name,
      email: resumeData.email,
      phone: resumeData.phone,
      location: resumeData.location,
      summary: resumeData.summary,
      skills: resumeData.skills,
      work_history: resumeData.experience,
      education: resumeData.education,
    });
    toast.success('Resume saved!');
  };

  const handleExport = () => {
    toast.success('Resume exported as PDF! (Demo)');
    // In production: use react-pdf or html2pdf to generate PDF
  };

  const templateStyles: Record<string, string> = {
    classic: 'border-gray-200',
    modern: 'border-violet-200 bg-gradient-to-br from-violet-50/50 to-white',
    minimal: 'border-gray-100',
    creative: 'border-pink-200 bg-gradient-to-br from-pink-50/30 to-white',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Resume Builder 📝
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            Build ATS-friendly resumes with professional templates
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setPreviewMode(previewMode === 'edit' ? 'preview' : 'edit')}>
            {previewMode === 'edit' ? '👁️ Preview' : '✏️ Edit'}
          </Button>
          <Button onClick={handleSave} loading={saving}>💾 Save</Button>
          <Button variant="primary" onClick={handleExport}>📥 Export PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Editor */}
        <div className="space-y-4">
          {/* Template Selection */}
          <Card variant="default" padding="md">
            <h3 className="text-[13px] font-semibold text-text-primary mb-3">Choose Template</h3>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all',
                    selectedTemplate === t.id
                      ? 'border-brand-400 bg-brand-50 ring-2 ring-brand-200'
                      : 'border-border-subtle hover:border-border-default'
                  )}
                >
                  <div className="text-2xl mb-1">{t.preview}</div>
                  <div className="text-[13px] font-semibold text-text-primary">{t.name}</div>
                  <div className="text-[11px] text-text-tertiary">{t.desc}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Basic Info */}
          <Card variant="default" padding="md">
            <h3 className="text-[13px] font-semibold text-text-primary mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Full Name</label>
                <input className="input-field" value={resumeData.name} onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Email</label>
                  <input type="email" className="input-field" value={resumeData.email} onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })} />
                </div>
                <div>
                  <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Phone</label>
                  <input className="input-field" value={resumeData.phone} onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Location</label>
                <input className="input-field" value={resumeData.location} onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })} />
              </div>
            </div>
          </Card>

          {/* Summary */}
          <Card variant="default" padding="md">
            <h3 className="text-[13px] font-semibold text-text-primary mb-3">Professional Summary</h3>
            <textarea className="input-field resize-none h-32" value={resumeData.summary} onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })} placeholder="Brief overview of your experience and goals..." />
          </Card>

          {/* Skills */}
          <Card variant="default" padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-semibold text-text-primary">Skills</h3>
              <Badge variant="brand">{resumeData.skills?.length || 0}</Badge>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {resumeData.skills?.map((skill: string, i: number) => (
                <Badge key={i} variant="success" size="sm">
                  {skill}
                  <button onClick={() => setResumeData({ ...resumeData, skills: resumeData.skills.filter((_: any, idx: number) => idx !== i) })} className="ml-1 hover:text-red-500">×</button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="input-field flex-1" placeholder="Add a skill..." onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  setResumeData({ ...resumeData, skills: [...(resumeData.skills || []), e.currentTarget.value.trim()] });
                  e.currentTarget.value = '';
                }
              }} />
              <Button size="sm">Add</Button>
            </div>
          </Card>
        </div>

        {/* Right: Preview */}
        <div className="lg:sticky lg:top-8">
          <Card variant="elevated" padding="none" className={cn('overflow-hidden', templateStyles[selectedTemplate])}>
            {/* Resume Preview */}
            <div className="p-8 bg-white min-h-[600px]">
              {/* Header */}
              <div className="border-b-2 border-gray-200 pb-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{resumeData.name || 'Your Name'}</h2>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                  {resumeData.email && <span>📧 {resumeData.email}</span>}
                  {resumeData.phone && <span>📱 {resumeData.phone}</span>}
                  {resumeData.location && <span>📍 {resumeData.location}</span>}
                </div>
              </div>

              {/* Summary */}
              {resumeData.summary && (
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Summary</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{resumeData.summary}</p>
                </div>
              )}

              {/* Skills */}
              {resumeData.skills?.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {resumeData.experience?.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Experience</h3>
                  {resumeData.experience.map((job: any, i: number) => (
                    <div key={i} className="mb-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold text-gray-800">{job.title}</span>
                        <span className="text-xs text-gray-500">{job.start_date} - {job.current ? 'Present' : job.end_date}</span>
                      </div>
                      <div className="text-sm text-gray-600">{job.company} {job.location && `| ${job.location}`}</div>
                      {job.description && <p className="text-sm text-gray-700 mt-1">{job.description}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {resumeData.education?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Education</h3>
                  {resumeData.education.map((edu: any, i: number) => (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold text-gray-800">{edu.degree} {edu.field && `in ${edu.field}`}</span>
                        <span className="text-xs text-gray-500">{edu.start_date} - {edu.end_date}</span>
                      </div>
                      <div className="text-sm text-gray-600">{edu.institution} {edu.gpa && `| GPA: ${edu.gpa}`}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!resumeData.name && !resumeData.summary && !resumeData.skills?.length && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <span className="text-4xl mb-3">📄</span>
                  <p className="text-sm text-gray-500">Start editing to see your resume preview</p>
                </div>
              )}
            </div>

            {/* ATS Score */}
            <div className="px-6 py-4 bg-emerald-50 border-t border-emerald-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✅</span>
                  <span className="text-sm font-semibold text-emerald-700">ATS-Friendly Score</span>
                </div>
                <span className="text-lg font-bold text-emerald-700">92/100</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}