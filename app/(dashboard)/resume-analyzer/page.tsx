'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { ResumeAnalysis } from '@/types';
import { useProfile } from '@/hooks/useProfile';
import { getScoreColor, getScoreBg, cn, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Progress from '@/components/ui/Progress';
import Badge from '@/components/ui/Badge';
import { useState, useEffect } from 'react';

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const { profile } = useProfile();

  useEffect(() => {
  const imported = sessionStorage.getItem('imported_jd');
  if (imported) {
    setJobDescription(imported);
    setActiveTab('paste');
    sessionStorage.removeItem('imported_jd');
    toast.success('Job description loaded from Import Jobs!');
  }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/plain': ['.txt'] },
    maxFiles: 1,
    onDrop: async (files) => {
      const file = files[0];
      if (!file) return;
      const text = await file.text();
      setResumeText(text);
      toast.success('Resume loaded!');
    },
  });

  const autofillFromProfile = () => {
    if (!profile) {
      toast.error('No profile data found. Complete your profile first.');
      return;
    }

    const sections: string[] = [];

    // Header
    if (profile.full_name) {
      sections.push(profile.full_name.toUpperCase());
    }

    const contactParts: string[] = [];
    if (profile.email) contactParts.push(profile.email);
    if (profile.phone) contactParts.push(profile.phone);
    if (profile.location) contactParts.push(profile.location);
    if (contactParts.length > 0) {
      sections.push(contactParts.join(' | '));
    }

    const linkParts: string[] = [];
    if (profile.linkedin_url) linkParts.push(`LinkedIn: ${profile.linkedin_url}`);
    if (profile.portfolio_url) linkParts.push(`Portfolio: ${profile.portfolio_url}`);
    if (linkParts.length > 0) {
      sections.push(linkParts.join(' | '));
    }

    // Summary
    if (profile.summary) {
      sections.push('');
      sections.push('PROFESSIONAL SUMMARY');
      sections.push('---');
      sections.push(profile.summary);
    }

    // Skills
    if (profile.skills?.length) {
      sections.push('');
      sections.push('SKILLS');
      sections.push('---');
      sections.push(profile.skills.join(', '));
    }

    // Work Experience
    if (profile.work_history?.length) {
      sections.push('');
      sections.push('WORK EXPERIENCE');
      sections.push('---');
      profile.work_history.forEach((job: any) => {
        const dateLine = `${formatDate(job.start_date)} – ${
          job.current ? 'Present' : formatDate(job.end_date)
        }`;
        sections.push('');
        sections.push(`${job.title} | ${job.company}`);
        sections.push(`${dateLine}${job.location ? ' | ' + job.location : ''}`);
        if (job.description) {
          sections.push(job.description);
        }
      });
    }

    // Education
    if (profile.education?.length) {
      sections.push('');
      sections.push('EDUCATION');
      sections.push('---');
      profile.education.forEach((edu: any) => {
        sections.push('');
        const degree = [edu.degree, edu.field].filter(Boolean).join(' in ');
        sections.push(`${degree || 'Degree'} | ${edu.institution}`);
        const dateLine = `${formatDate(edu.start_date)} – ${formatDate(edu.end_date)}`;
        sections.push(dateLine + (edu.gpa ? ` | GPA: ${edu.gpa}` : ''));
      });
    }

    // Certifications
    if (profile.certifications?.length) {
      sections.push('');
      sections.push('CERTIFICATIONS');
      sections.push('---');
      profile.certifications.forEach((cert: any) => {
        sections.push(`${cert.name} – ${cert.issuer} (${formatDate(cert.date)})`);
      });
    }

    const resumeContent = sections.join('\n');

    if (resumeContent.trim().length < 30) {
      toast.error('Your profile is mostly empty. Add more details first.');
      return;
    }

    setResumeText(resumeContent);
    setActiveTab('paste');
    toast.success('Profile data loaded as resume!');
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast.error('Please provide both your resume and a job description');
      return;
    }

    if (resumeText.trim().length < 50) {
      toast.error('Resume text is too short — please paste more content');
      return;
    }

    if (jobDescription.trim().length < 50) {
      toast.error('Job description is too short — please paste more content');
      return;
    }

    setLoading(true);
    setAnalysis(null);
    setFeedback(null);

    try {
      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || `Server error: ${res.status}`);
        return;
      }

      if (data.analysis) {
        setAnalysis(data.analysis);
        toast.success('Analysis complete!');
      } else {
        toast.error('No analysis returned. Please try again.');
      }
    } catch (err: any) {
      toast.error(
        `Network error: ${err?.message || 'Please check your connection'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const saveFeedback = async (rating: 'up' | 'down') => {
    setFeedback(rating);
    toast.success(rating === 'up' ? 'Thanks!' : "We'll improve this");
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'resume_analyzer',
          rating,
          context: { match_score: analysis?.match_score },
        }),
      });
    } catch {
      // non-fatal
    }
  };

  const priorityVariants: Record<string, 'danger' | 'warning' | 'info'> = {
    high: 'danger',
    medium: 'warning',
    low: 'info',
  };

  const getScoreVariant = (
    score: number
  ): 'success' | 'warning' | 'danger' => {
    if (score >= 70) return 'success';
    if (score >= 40) return 'warning';
    return 'danger';
  };

  // Check if profile has enough data
  const profileHasData =
    profile &&
    (profile.full_name ||
      profile.summary ||
      profile.skills?.length ||
      profile.work_history?.length);

      
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Resume Analyzer
        </h1>
        <p className="text-sm text-text-tertiary mt-1">
          Paste your resume and a job description to get your match score and
          actionable insights
        </p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-2 gap-4">
        {/* Resume Input */}
        <Card variant="default" padding="md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold text-text-primary">
              Your Resume
            </span>
            <div className="flex items-center gap-2">
              {/* Autofill Button */}
              {profileHasData && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={autofillFromProfile}
                  icon={
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        width="8"
                        height="4"
                        x="8"
                        y="2"
                        rx="1"
                        ry="1"
                      />
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <path d="M9 14l2 2 4-4" />
                    </svg>
                  }
                >
                  Fill from Profile
                </Button>
              )}

              {/* Tab Switcher */}
              <div className="flex items-center gap-1 p-0.5 bg-surface-200 rounded-lg border border-border-subtle">
                <button
                  onClick={() => setActiveTab('paste')}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[11px] font-medium transition-all',
                    activeTab === 'paste'
                      ? 'bg-surface-400 text-text-primary'
                      : 'text-text-muted hover:text-text-secondary'
                  )}
                >
                  Paste
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[11px] font-medium transition-all',
                    activeTab === 'upload'
                      ? 'bg-surface-400 text-text-primary'
                      : 'text-text-muted hover:text-text-secondary'
                  )}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'paste' ? (
            <textarea
              className="input-field resize-none h-64 text-[13px]"
              placeholder="Paste your full resume here or click 'Fill from Profile' above to auto-generate from your profile data..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          ) : (
            <div
              {...getRootProps()}
              className={cn(
                'h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all',
                isDragActive
                  ? 'border-brand-500 bg-brand-500/5'
                  : 'border-border-default hover:border-border-strong hover:bg-surface-200'
              )}
            >
              <input {...getInputProps()} />
              <div className="w-10 h-10 rounded-xl bg-surface-200 flex items-center justify-center mb-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-text-muted"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="text-[13px] text-text-tertiary text-center">
                {isDragActive
                  ? 'Drop it here'
                  : 'Drag & drop or click to upload'}
              </p>
              <p className="text-[11px] text-text-muted mt-1">.txt files</p>
              {resumeText && (
                <div className="mt-2">
                  <Badge variant="success" dot>
                    Resume loaded
                  </Badge>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center mt-2">
            <span className="text-[11px] text-text-muted">
              {resumeText.length > 0 && `${resumeText.length} characters`}
            </span>
            <div className="flex items-center gap-3">
              {!profileHasData && (
                <span className="text-[11px] text-text-muted">
                  💡 Complete your{' '}
                  <a
                    href="/profile"
                    className="text-brand-400 hover:underline"
                  >
                    profile
                  </a>{' '}
                  to use autofill
                </span>
              )}
              {resumeText && (
                <button
                  onClick={() => setResumeText('')}
                  className="text-[11px] text-text-muted hover:text-accent-rose transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Job Description */}
        <Card variant="default" padding="md">
          <div className="mb-3">
            <span className="text-[13px] font-semibold text-text-primary">
              Job Description
            </span>
          </div>
          <textarea
            className="input-field resize-none h-64 text-[13px]"
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-[11px] text-text-muted">
              {jobDescription.length > 0 &&
                `${jobDescription.length} characters`}
            </span>
            {jobDescription && (
              <button
                onClick={() => setJobDescription('')}
                className="text-[11px] text-text-muted hover:text-accent-rose transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </Card>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleAnalyze}
          loading={loading}
          icon={
            !loading ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <path d="M7 8h10" />
                <path d="M7 12h10" />
                <path d="M7 16h10" />
              </svg>
            ) : undefined
          }
          className="px-10"
        >
          {loading ? 'Analyzing your resume...' : 'Analyze Match'}
        </Button>
      </div>

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
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
              <p className="text-[13px] text-text-tertiary">
                AI is analyzing your resume against the job description
              </p>
              <p className="text-[11px] text-text-muted mt-1">
                This usually takes 5–10 seconds
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {analysis && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Score Card */}
            <Card variant="elevated" className="text-center py-10">
              <div className="mb-6">
                {/* Score Ring */}
                <div className="relative w-36 h-36 mx-auto mb-5">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 120 120"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-surface-200"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      strokeWidth="8"
                      strokeLinecap="round"
                      stroke={
                        analysis.match_score >= 70
                          ? '#34d399'
                          : analysis.match_score >= 40
                          ? '#fbbf24'
                          : '#fb7185'
                      }
                      strokeDasharray={`${
                        (analysis.match_score / 100) * 339
                      } 339`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className={cn(
                        'text-4xl font-bold tabular-nums',
                        getScoreColor(analysis.match_score)
                      )}
                    >
                      {analysis.match_score}
                    </span>
                    <span className="text-[11px] text-text-muted font-medium">
                      / 100
                    </span>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-text-primary mb-1">
                  Match Score
                </h2>
                <Progress
                  value={analysis.match_score}
                  variant={getScoreVariant(analysis.match_score)}
                  size="md"
                  animated
                  className="max-w-xs mx-auto"
                />
              </div>

              <p className="text-[13px] text-text-tertiary max-w-lg mx-auto leading-relaxed">
                {analysis.overall_assessment}
              </p>

              {/* Feedback */}
              <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-border-subtle">
                <span className="text-[11px] text-text-muted">
                  Was this helpful?
                </span>
                <button
                  onClick={() => saveFeedback('up')}
                  className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all',
                    feedback === 'up'
                      ? 'bg-emerald-500/20 text-accent-emerald'
                      : 'bg-surface-200 text-text-muted hover:text-text-primary'
                  )}
                >
                  👍
                </button>
                <button
                  onClick={() => saveFeedback('down')}
                  className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all',
                    feedback === 'down'
                      ? 'bg-rose-500/20 text-accent-rose'
                      : 'bg-surface-200 text-text-muted hover:text-text-primary'
                  )}
                >
                  👎
                </button>
              </div>
            </Card>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card variant="default" padding="md">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-accent-emerald"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-semibold text-text-primary">
                    Matched Skills
                  </span>
                  <span className="text-[11px] text-text-muted ml-auto">
                    {analysis.matched_skills?.length || 0}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.matched_skills?.map((skill) => (
                    <Badge key={skill} variant="success" size="sm">
                      {skill}
                    </Badge>
                  ))}
                  {!analysis.matched_skills?.length && (
                    <span className="text-[12px] text-text-muted">
                      None found
                    </span>
                  )}
                </div>
              </Card>

              <Card variant="default" padding="md">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-md bg-rose-500/10 flex items-center justify-center">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-accent-rose"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-semibold text-text-primary">
                    Missing Skills
                  </span>
                  <span className="text-[11px] text-text-muted ml-auto">
                    {analysis.missing_skills?.length || 0}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missing_skills?.map((skill) => (
                    <Badge key={skill} variant="danger" size="sm">
                      {skill}
                    </Badge>
                  ))}
                  {!analysis.missing_skills?.length && (
                    <span className="text-[12px] text-text-muted">
                      None missing
                    </span>
                  )}
                </div>
              </Card>
            </div>

            {/* Insights */}
            <Card variant="default" padding="md">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-brand-500/10 flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-brand-400"
                  >
                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                  </svg>
                </div>
                <span className="text-[13px] font-semibold text-text-primary">
                  Actionable Insights
                </span>
                <span className="text-[11px] text-text-muted ml-auto">
                  {analysis.insights?.length || 0} suggestions
                </span>
              </div>

              <div className="space-y-3">
                {analysis.insights?.map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="p-4 bg-surface-200 rounded-xl border border-border-subtle"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={
                          priorityVariants[insight.priority] || 'info'
                        }
                        size="sm"
                        dot
                      >
                        {insight.priority?.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] text-text-muted uppercase tracking-wider">
                        {insight.category}
                      </span>
                    </div>
                    <h4 className="text-[13px] font-semibold text-text-primary mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-[12px] text-text-tertiary leading-relaxed mb-3">
                      {insight.description}
                    </p>
                    <div className="flex items-start gap-2 p-3 bg-brand-500/5 rounded-lg border border-brand-500/10">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-brand-400 mt-0.5 flex-shrink-0"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                      <p className="text-[12px] text-brand-300 leading-relaxed">
                        {insight.action}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}