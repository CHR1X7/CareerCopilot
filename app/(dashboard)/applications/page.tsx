'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApplications } from '@/hooks/useApplications';
import { Application, ApplicationStatus, STATUS_CONFIG } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const STATUS_STYLES: Record<ApplicationStatus, { label: string; bg: string; text: string; icon: string }> = {
  not_submitted: { label: 'Not Submitted', bg: 'bg-gray-100', text: 'text-gray-700', icon: '📝' },
  submitted: { label: 'Submitted', bg: 'bg-blue-50', text: 'text-blue-700', icon: '📤' },
  received_initial_response: { label: 'Response Received', bg: 'bg-cyan-50', text: 'text-cyan-700', icon: '📧' },
  interview_requested: { label: 'Interview Requested', bg: 'bg-violet-50', text: 'text-violet-700', icon: '🎤' },
  onsite_interview_requested: { label: 'Onsite Interview', bg: 'bg-purple-50', text: 'text-purple-700', icon: '🏢' },
  offer_received: { label: 'Offer Received', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '🎉' },
  rejected: { label: 'Rejected', bg: 'bg-red-50', text: 'text-red-700', icon: '❌' },
  rejected_after_interview: { label: 'Rejected After Interview', bg: 'bg-orange-50', text: 'text-orange-700', icon: '😔' },
  withdrawn: { label: 'Withdrawn', bg: 'bg-yellow-50', text: 'text-yellow-700', icon: '🚪' },
};

const ALL_STATUSES = Object.entries(STATUS_STYLES).map(([key, val]) => ({
  value: key as ApplicationStatus,
  ...val,
}));

export default function ApplicationsPage() {
  const { applications, loading, addApplication, updateStatus, deleteApplication } = useApplications();
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>('all');
  const [newApp, setNewApp] = useState<Partial<Application>>({ status: 'not_submitted' });
  const [saving, setSaving] = useState(false);

  const filteredApps = filterStatus === 'all'
    ? applications
    : applications.filter((a) => a.status === filterStatus);

  const handleAdd = async () => {
    if (!newApp.company_name || !newApp.job_title) {
      toast.error('Company name and job title are required');
      return;
    }
    setSaving(true);
    try {
      await addApplication(newApp);
      setShowModal(false);
      setNewApp({ status: 'not_submitted' });
    } finally {
      setSaving(false);
    }
  };

  // Pipeline counts
  const pipelineStages = [
    { status: 'not_submitted' as ApplicationStatus, count: applications.filter((a) => a.status === 'not_submitted').length },
    { status: 'submitted' as ApplicationStatus, count: applications.filter((a) => a.status === 'submitted').length },
    { status: 'received_initial_response' as ApplicationStatus, count: applications.filter((a) => a.status === 'received_initial_response').length },
    { status: 'interview_requested' as ApplicationStatus, count: applications.filter((a) => a.status === 'interview_requested').length },
    { status: 'onsite_interview_requested' as ApplicationStatus, count: applications.filter((a) => a.status === 'onsite_interview_requested').length },
    { status: 'offer_received' as ApplicationStatus, count: applications.filter((a) => a.status === 'offer_received').length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Application Tracker 📋</h1>
          <p className="text-sm text-text-tertiary mt-1">Track every step of your job search</p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ Add Application</Button>
      </div>

      {/* Pipeline */}
      <Card variant="default" padding="md" className="overflow-x-auto">
        <h3 className="text-[13px] font-semibold text-text-primary mb-3">Your Pipeline</h3>
        <div className="flex items-center gap-2 min-w-max">
          {pipelineStages.map((stage, i) => {
            const style = STATUS_STYLES[stage.status];
            return (
              <div key={stage.status} className="flex items-center">
                <button
                  onClick={() => setFilterStatus(stage.status === filterStatus ? 'all' : stage.status)}
                  className={cn(
                    'flex flex-col items-center p-3 rounded-xl border transition-all min-w-[90px]',
                    filterStatus === stage.status
                      ? `${style.bg} border-current ${style.text} ring-2 ring-current ring-opacity-20`
                      : 'border-border-default hover:border-border-strong bg-white'
                  )}
                >
                  <span className="text-lg mb-1">{style.icon}</span>
                  <span className={cn('text-lg font-bold', filterStatus === stage.status ? style.text : 'text-text-primary')}>
                    {stage.count}
                  </span>
                  <span className="text-[10px] text-text-muted text-center leading-tight mt-0.5">{style.label}</span>
                </button>
                {i < pipelineStages.length - 1 && (
                  <div className="w-4 h-px bg-border-default mx-1 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all border',
            filterStatus === 'all'
              ? 'bg-brand-50 text-brand-700 border-brand-200'
              : 'text-text-muted border-transparent hover:text-text-secondary hover:bg-surface-100'
          )}
        >
          All ({applications.length})
        </button>
        {ALL_STATUSES.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilterStatus(opt.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all border',
              filterStatus === opt.value
                ? `${opt.bg} ${opt.text} border-current border-opacity-30`
                : 'text-text-muted border-transparent hover:text-text-secondary hover:bg-surface-100'
            )}
          >
            {opt.icon} {opt.label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <Card variant="default" className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <div className="text-xl font-semibold text-text-primary mb-2">No applications found</div>
          <p className="text-text-tertiary mb-6">Start tracking your job applications!</p>
          <Button onClick={() => setShowModal(true)}>Add Your First Application</Button>
        </Card>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filteredApps.map((app, i) => {
              const style = STATUS_STYLES[app.status];
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-white border border-border-default rounded-xl p-4 flex items-center justify-between hover:border-border-strong hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-lg', style.bg)}>
                      {style.icon}
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-text-primary">{app.job_title}</div>
                      <div className="text-[12px] text-text-tertiary">
                        {app.company_name}
                        {app.applied_date && (
                          <span className="ml-2 text-text-muted">
                            · Applied {new Date(app.applied_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {app.notes && (
                        <div className="text-[11px] text-text-muted mt-0.5 truncate max-w-[300px]">{app.notes}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {app.match_score && (
                      <span className={cn(
                        'text-[12px] font-bold px-2.5 py-1 rounded-lg tabular-nums',
                        app.match_score >= 80 ? 'bg-emerald-50 text-emerald-700' :
                        app.match_score >= 60 ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      )}>
                        {app.match_score}%
                      </span>
                    )}

                    {/* Status Dropdown */}
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id!, e.target.value as ApplicationStatus)}
                      className={cn(
                        'text-[11px] font-semibold px-3 py-1.5 rounded-lg border cursor-pointer appearance-none pr-6',
                        'bg-no-repeat bg-right',
                        style.bg, style.text,
                        'border-current border-opacity-20'
                      )}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 6px center',
                      }}
                    >
                      {ALL_STATUSES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.icon} {opt.label}
                        </option>
                      ))}
                    </select>

                    {app.job_url && (
                      <a
                        href={app.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-surface-100 border border-border-subtle flex items-center justify-center text-text-muted hover:text-brand-600 hover:border-brand-200 transition-all"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}

                    <button
                      onClick={() => deleteApplication(app.id!)}
                      className="w-8 h-8 rounded-lg bg-surface-100 border border-border-subtle flex items-center justify-center text-text-muted hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg"
            >
              <Card variant="elevated" padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[16px] font-bold text-text-primary">Add New Application</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Company *</label>
                      <input className="input-field" placeholder="Google" value={newApp.company_name || ''} onChange={(e) => setNewApp((p) => ({ ...p, company_name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Job Title *</label>
                      <input className="input-field" placeholder="Software Engineer" value={newApp.job_title || ''} onChange={(e) => setNewApp((p) => ({ ...p, job_title: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Job URL</label>
                    <input className="input-field" placeholder="https://..." value={newApp.job_url || ''} onChange={(e) => setNewApp((p) => ({ ...p, job_url: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Status</label>
                    <select
                      className="input-field"
                      value={newApp.status}
                      onChange={(e) => setNewApp((p) => ({ ...p, status: e.target.value as ApplicationStatus }))}
                    >
                      {ALL_STATUSES.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1 block">Notes</label>
                    <textarea className="input-field resize-none h-20" placeholder="Any notes..." value={newApp.notes || ''} onChange={(e) => setNewApp((p) => ({ ...p, notes: e.target.value }))} />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="secondary" fullWidth onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button fullWidth onClick={handleAdd} loading={saving}>Add Application</Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}