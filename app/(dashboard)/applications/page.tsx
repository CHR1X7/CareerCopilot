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

const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(([key, val]) => ({
  value: key as ApplicationStatus,
  ...val,
}));

export default function ApplicationsPage() {
  const { applications, loading, addApplication, updateStatus, deleteApplication } = useApplications();
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>('all');
  const [newApp, setNewApp] = useState<Partial<Application>>({
    status: 'not_submitted',
  });
  const [saving, setSaving] = useState(false);

  const filteredApps = filterStatus === 'all'
    ? applications
    : applications.filter(a => a.status === filterStatus);

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

  const inputClass = "w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm";

  const pipelineStages = [
    { status: 'not_submitted', count: applications.filter(a => a.status === 'not_submitted').length },
    { status: 'submitted', count: applications.filter(a => a.status === 'submitted').length },
    { status: 'received_initial_response', count: applications.filter(a => a.status === 'received_initial_response').length },
    { status: 'interview_requested', count: applications.filter(a => a.status === 'interview_requested').length },
    { status: 'onsite_interview_requested', count: applications.filter(a => a.status === 'onsite_interview_requested').length },
    { status: 'offer_received', count: applications.filter(a => a.status === 'offer_received').length },
  ] as Array<{ status: ApplicationStatus; count: number }>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            📋 <span className="gradient-text-brand">Application Tracker</span>
          </h1>
          <p className="text-gray-400">Track every step of your job search journey</p>
        </div>
        <Button onClick={() => setShowModal(true)} icon={<span>+</span>}>
          Add Application
        </Button>
      </div>

      {/* Pipeline Visual */}
      <Card className="mb-6 overflow-x-auto">
        <h3 className="font-semibold text-white mb-4">Your Pipeline</h3>
        <div className="flex items-center gap-2 min-w-max">
          {pipelineStages.map((stage, i) => {
            const config = STATUS_CONFIG[stage.status];
            return (
              <div key={stage.status} className="flex items-center">
                <button
                  onClick={() => setFilterStatus(stage.status === filterStatus ? 'all' : stage.status)}
                  className={cn(
                    'flex flex-col items-center p-3 rounded-xl border transition-all min-w-[100px]',
                    filterStatus === stage.status
                      ? `${config.bgColor} border-current ${config.color}`
                      : 'border-gray-700 hover:border-gray-600'
                  )}
                >
                  <span className="text-xl mb-1">{config.icon}</span>
                  <span className={cn('text-xl font-bold', filterStatus === stage.status ? config.color : 'text-white')}>
                    {stage.count}
                  </span>
                  <span className="text-xs text-gray-500 text-center leading-tight">{config.label}</span>
                </button>
                {i < pipelineStages.length - 1 && (
                  <div className="w-6 h-px bg-gray-700 mx-1 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all',
            filterStatus === 'all' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white bg-gray-800'
          )}
        >
          All ({applications.length})
        </button>
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilterStatus(opt.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all',
              filterStatus === opt.value ? `bg-gray-700 ${opt.color}` : 'text-gray-500 hover:text-gray-300 bg-gray-900'
            )}
          >
            {opt.icon} {opt.label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="glass-card h-20 shimmer" />)}
        </div>
      ) : filteredApps.length === 0 ? (
        <Card className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <div className="text-xl font-semibold text-white mb-2">No applications found</div>
          <p className="text-gray-400 mb-6">Start tracking your job applications!</p>
          <Button onClick={() => setShowModal(true)}>Add Your First Application</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredApps.map((app, i) => {
              const config = STATUS_CONFIG[app.status];
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass-card p-4 hover:border-gray-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0', config.bgColor)}>
                        {config.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{app.job_title}</div>
                        <div className="text-sm text-gray-400">
                          {app.company_name}
                          {app.applied_date && <span className="ml-3 text-gray-600">Applied {new Date(app.applied_date).toLocaleDateString()}</span>}
                        </div>
                        {app.notes && <div className="text-xs text-gray-600 mt-1">{app.notes}</div>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {app.match_score && (
                        <div className="text-sm font-bold text-violet-400 bg-violet-900/30 px-3 py-1 rounded-lg">
                          {app.match_score}% match
                        </div>
                      )}
                      
                      {/* Status Updater */}
                      <select
                        value={app.status}
                        onChange={e => updateStatus(app.id!, e.target.value as ApplicationStatus)}
                        className={cn(
                          'text-xs font-medium px-3 py-1.5 rounded-lg border bg-transparent cursor-pointer focus:outline-none',
                          config.color, config.bgColor
                        )}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
                            {opt.icon} {opt.label}
                          </option>
                        ))}
                      </select>

                      {app.job_url && (
                        <a href={app.job_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm">🔗</Button>
                        </a>
                      )}
                      
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteApplication(app.id!)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add Application Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Add New Application</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white text-xl">×</button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Company Name *</label>
                    <input className={inputClass} placeholder="Google" value={newApp.company_name || ''} onChange={e => setNewApp(p => ({ ...p, company_name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Job Title *</label>
                    <input className={inputClass} placeholder="Software Engineer" value={newApp.job_title || ''} onChange={e => setNewApp(p => ({ ...p, job_title: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Job URL</label>
                  <input className={inputClass} placeholder="https://..." value={newApp.job_url || ''} onChange={e => setNewApp(p => ({ ...p, job_url: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Status</label>
                  <select
                    className={inputClass}
                    value={newApp.status}
                    onChange={e => setNewApp(p => ({ ...p, status: e.target.value as ApplicationStatus }))}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Notes</label>
                  <textarea className={inputClass} rows={3} placeholder="Add any notes..." value={newApp.notes || ''} onChange={e => setNewApp(p => ({ ...p, notes: e.target.value }))} />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleAdd} loading={saving}>Add Application</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}