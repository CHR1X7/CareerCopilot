'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useProfile } from '@/hooks/useProfile';
import { useApplications } from '@/hooks/useApplications';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface ScoutedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  posted: string;
  job_type: string;
  salary: string | null;
  logo: string | null;
  match_score: number;
  match_reason: string;
  source: string;
}

export default function JobScoutPage() {
  const [jobs, setJobs] = useState<ScoutedJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { profile } = useProfile();
  const { addApplication } = useApplications();
  const router = useRouter();

  const handleScout = async () => {
    setLoading(true);
    setJobs([]);
    setSearched(true);

    try {
      const res = await fetch('/api/jobs/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setJobs(data.jobs || []);

      if (data.jobs?.length > 0) {
        toast.success(`Found ${data.jobs.length} jobs matching your profile!`);
      } else {
        toast.info('No jobs found. Try updating your profile preferences.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to scout jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (job: ScoutedJob) => {
    try {
      await addApplication({
        company_name: job.company,
        job_title: job.title,
        job_url: job.url || undefined,
        job_description: job.description,
        match_score: job.match_score,
        status: 'not_submitted',
      });
      setSavedIds((prev) => new Set([...prev, job.id]));
      toast.success(`${job.title} at ${job.company} added to tracker!`);
    } catch {
      toast.error('Failed to save job');
    }
  };

  const handleAnalyze = (job: ScoutedJob) => {
    if (job.description) {
      sessionStorage.setItem('imported_jd', job.description);
      router.push('/resume-analyzer');
      toast.success('Job loaded in Resume Analyzer!');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  // Profile summary for the header
  const profileSummary = profile ? {
    roles: (profile.interested_roles || []).slice(0, 3),
    skills: (profile.skills || []).slice(0, 5),
    locations: (profile.preferred_locations || []).slice(0, 3),
  } : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Job Scout 🔍
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            AI finds jobs matching your profile, skills, and preferences
          </p>
        </div>
        <Button onClick={handleScout} loading={loading} size="lg">
          {loading ? 'Scouting...' : searched ? '🔄 Scout Again' : '🚀 Scout Jobs'}
        </Button>
      </div>

      {/* Profile Match Card */}
      {profileSummary && (
        <Card
          variant="default"
          padding="md"
          className="bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-200"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[13px] font-semibold text-text-primary mb-2">
                Searching based on your profile
              </h3>
              <div className="flex flex-wrap gap-4">
                {profileSummary.roles.length > 0 && (
                  <div>
                    <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                      Roles
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileSummary.roles.map((r) => (
                        <Badge key={r} variant="brand" size="sm">
                          {r}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {profileSummary.skills.length > 0 && (
                  <div>
                    <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                      Skills
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileSummary.skills.map((s) => (
                        <Badge key={s} variant="success" size="sm">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {profileSummary.locations.length > 0 && (
                  <div>
                    <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                      Locations
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileSummary.locations.map((l) => (
                        <Badge key={l} variant="info" size="sm">
                          {l}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => router.push('/profile')}
                className="text-[11px] text-brand-600 hover:text-brand-700 font-medium mt-2 transition-colors"
              >
                Edit preferences →
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card variant="default" className="text-center py-12">
              <div className="flex items-center justify-center gap-1.5 mb-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
              <p className="text-[14px] font-medium text-text-primary mb-1">
                AI is scouting jobs for you...
              </p>
              <p className="text-[12px] text-text-muted">
                Searching based on your skills, roles, and preferences
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!loading && !searched && (
        <Card variant="default" className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            Ready to find your next opportunity?
          </h3>
          <p className="text-[13px] text-text-tertiary max-w-md mx-auto mb-6">
            Click "Scout Jobs" and our AI will search for positions that match
            your skills, preferred roles, and locations from your profile.
          </p>
          <Button onClick={handleScout} size="lg">
            🚀 Scout Jobs Now
          </Button>
        </Card>
      )}

      {/* No Results */}
      {!loading && searched && jobs.length === 0 && (
        <Card variant="default" className="text-center py-12">
          <div className="text-4xl mb-3">😕</div>
          <h3 className="text-lg font-bold text-text-primary mb-2">
            No matching jobs found
          </h3>
          <p className="text-[13px] text-text-tertiary mb-4">
            Try updating your profile with more roles or broader location
            preferences.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => router.push('/profile')}>
              Update Profile
            </Button>
            <Button onClick={handleScout}>Try Again</Button>
          </div>
        </Card>
      )}

      {/* Job Results */}
      <AnimatePresence>
        {!loading && jobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-semibold text-text-secondary">
                Found {jobs.length} jobs for you
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="default" size="sm">
                  Sorted by match score
                </Badge>
              </div>
            </div>

            {jobs.map((job, i) => {
              const isSaved = savedIds.has(job.id);
              const isExpanded = expandedId === job.id;

              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card
                    variant="interactive"
                    padding="none"
                    className={cn(
                      'overflow-hidden',
                      isExpanded && 'ring-2 ring-brand-200'
                    )}
                  >
                    {/* Main Row */}
                    <div
                      className="p-5 cursor-pointer"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : job.id)
                      }
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          {/* Company Logo / Placeholder */}
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-surface-100 to-surface-200 border border-border-subtle flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {job.logo ? (
                              <img
                                src={job.logo}
                                alt={job.company}
                                className="w-full h-full object-contain p-1.5"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  (e.target as HTMLImageElement).parentElement!.innerHTML =
                                    '<span class="text-lg">🏢</span>';
                                }}
                              />
                            ) : (
                              <span className="text-lg">🏢</span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="text-[15px] font-bold text-text-primary leading-tight">
                              {job.title}
                            </h3>
                            <div className="text-[13px] text-text-tertiary mt-0.5">
                              {job.company}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                {job.location}
                              </span>
                              <span className="text-border-strong">·</span>
                              <span className="text-[11px] text-text-muted">
                                {job.job_type}
                              </span>
                              {job.salary && (
                                <>
                                  <span className="text-border-strong">·</span>
                                  <span className="text-[11px] font-semibold text-emerald-600">
                                    {job.salary}
                                  </span>
                                </>
                              )}
                              {job.posted && (
                                <>
                                  <span className="text-border-strong">·</span>
                                  <span className="text-[11px] text-text-muted">
                                    {job.posted}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Match Score */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <div
                            className={cn(
                              'px-3 py-1.5 rounded-xl border text-[13px] font-bold tabular-nums',
                              getScoreColor(job.match_score)
                            )}
                          >
                            {job.match_score}% match
                          </div>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={cn(
                              'text-text-muted transition-transform',
                              isExpanded && 'rotate-180'
                            )}
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-0 border-t border-border-subtle">
                            {/* Match Reason */}
                            {job.match_reason && (
                              <div className="mt-4 p-3 bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-100 rounded-xl">
                                <div className="flex items-start gap-2">
                                  <span className="text-sm mt-0.5">✨</span>
                                  <div>
                                    <span className="text-[11px] font-semibold text-brand-700">
                                      Why this matches you
                                    </span>
                                    <p className="text-[12px] text-text-secondary mt-0.5">
                                      {job.match_reason}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Description */}
                            {job.description && (
                              <div className="mt-4">
                                <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">
                                  About this role
                                </h4>
                                <p className="text-[13px] text-text-secondary leading-relaxed">
                                  {job.description}
                                </p>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 mt-4 pt-4 border-t border-border-subtle">
                              {job.url && (
                                <a
                                  href={job.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Button size="sm">
                                    🔗 Apply Now
                                  </Button>
                                </a>
                              )}
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveJob(job);
                                }}
                                disabled={isSaved}
                              >
                                {isSaved ? '✓ Saved' : '📋 Save to Tracker'}
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAnalyze(job);
                                }}
                              >
                                📊 Analyze Match
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(
                                    job.description || ''
                                  );
                                  toast.success('Description copied!');
                                }}
                              >
                                📋 Copy
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}