'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '@/hooks/useProfile';
import { WorkExperience, Education } from '@/types';
import { generateId, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { profile, loading, saving, saveProfile } = useProfile();
  const [activeTab, setActiveTab] = useState<'basics' | 'experience' | 'education' | 'preferences'>('basics');
  const [formData, setFormData] = useState<any>({});
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [showEduModal, setShowEduModal] = useState(false);
  const [newWork, setNewWork] = useState<Partial<WorkExperience>>({ current: false });
  const [newEdu, setNewEdu] = useState<Partial<Education>>({});

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const handleSave = async () => {
    await saveProfile(formData);
  };

  const addWorkExperience = () => {
    const updated = [...(formData.work_history || []), { ...newWork, id: generateId() }];
    setFormData((p: any) => ({ ...p, work_history: updated }));
    setShowWorkModal(false);
    setNewWork({ current: false });
    toast.success('Work experience added!');
  };

  const removeWork = (id: string) => {
    setFormData((p: any) => ({ ...p, work_history: p.work_history.filter((w: WorkExperience) => w.id !== id) }));
  };

  const addEducation = () => {
    const updated = [...(formData.education || []), { ...newEdu, id: generateId() }];
    setFormData((p: any) => ({ ...p, education: updated }));
    setShowEduModal(false);
    setNewEdu({});
  };

  const removeEdu = (id: string) => {
    setFormData((p: any) => ({ ...p, education: p.education.filter((e: Education) => e.id !== id) }));
  };

  const inputClass = "w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 text-sm transition-colors";
  const labelClass = "block text-sm font-medium text-gray-400 mb-1.5";

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-400">Loading profile...</div></div>;
  }

  const tabs = [
    { id: 'basics', label: '👤 Basic Info' },
    { id: 'experience', label: '💼 Work History' },
    { id: 'education', label: '🎓 Education' },
    { id: 'preferences', label: '⚙️ Preferences' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            👤 My <span className="gradient-text">Profile</span>
          </h1>
          <p className="text-gray-400">Keep your profile updated for better AI personalization</p>
        </div>
        <Button onClick={handleSave} loading={saving} icon={<span>💾</span>}>
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-gray-900 rounded-xl border border-gray-800 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Basic Info Tab */}
      {activeTab === 'basics' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Full Name</label>
                <input className={inputClass} value={formData.full_name || ''} onChange={e => setFormData((p: any) => ({ ...p, full_name: e.target.value }))} placeholder="John Doe" />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input className={inputClass} type="email" value={formData.email || ''} onChange={e => setFormData((p: any) => ({ ...p, email: e.target.value }))} placeholder="john@example.com" />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input className={inputClass} value={formData.phone || ''} onChange={e => setFormData((p: any) => ({ ...p, phone: e.target.value }))} placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <input className={inputClass} value={formData.location || ''} onChange={e => setFormData((p: any) => ({ ...p, location: e.target.value }))} placeholder="San Francisco, CA" />
              </div>
              <div>
                <label className={labelClass}>LinkedIn URL</label>
                <input className={inputClass} value={formData.linkedin_url || ''} onChange={e => setFormData((p: any) => ({ ...p, linkedin_url: e.target.value }))} placeholder="https://linkedin.com/in/..." />
              </div>
              <div>
                <label className={labelClass}>Portfolio / Website</label>
                <input className={inputClass} value={formData.portfolio_url || ''} onChange={e => setFormData((p: any) => ({ ...p, portfolio_url: e.target.value }))} placeholder="https://..." />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Professional Summary</label>
                <textarea rows={4} className={inputClass} value={formData.summary || ''} onChange={e => setFormData((p: any) => ({ ...p, summary: e.target.value }))} placeholder="Tell us about your professional background..." />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Work Experience Tab */}
      {activeTab === 'experience' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Work Experience</h2>
            <Button size="sm" onClick={() => setShowWorkModal(true)} icon={<span>+</span>}>Add Experience</Button>
          </div>

          {(formData.work_history || []).length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-4xl mb-3">💼</div>
              <div className="text-gray-400 mb-4">No work experience added yet</div>
              <Button onClick={() => setShowWorkModal(true)}>Add Your First Job</Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {(formData.work_history as WorkExperience[]).map((job) => (
                <Card key={job.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-white text-lg">{job.title}</div>
                      <div className="text-violet-400 font-medium">{job.company}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatDate(job.start_date)} — {job.current ? 'Present' : formatDate(job.end_date)}
                        {job.location && <span className="ml-3">📍 {job.location}</span>}
                      </div>
                      {job.description && <p className="text-sm text-gray-400 mt-2 leading-relaxed">{job.description}</p>}
                    </div>
                    <button onClick={() => removeWork(job.id)} className="text-gray-600 hover:text-red-400 transition-colors ml-4 text-lg">🗑️</button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Work Modal */}
          {showWorkModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="glass-card w-full max-w-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Add Work Experience</h3>
                  <button onClick={() => setShowWorkModal(false)} className="text-gray-400 text-xl">×</button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Job Title *</label>
                      <input className={inputClass} placeholder="Software Engineer" value={newWork.title || ''} onChange={e => setNewWork(p => ({ ...p, title: e.target.value }))} />
                    </div>
                    <div>
                      <label className={labelClass}>Company *</label>
                      <input className={inputClass} placeholder="Google" value={newWork.company || ''} onChange={e => setNewWork(p => ({ ...p, company: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Location</label>
                    <input className={inputClass} placeholder="San Francisco, CA" value={newWork.location || ''} onChange={e => setNewWork(p => ({ ...p, location: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Start Date</label>
                      <input type="month" className={inputClass} value={newWork.start_date || ''} onChange={e => setNewWork(p => ({ ...p, start_date: e.target.value }))} />
                    </div>
                    <div>
                      <label className={labelClass}>End Date</label>
                      <input type="month" className={inputClass} disabled={newWork.current} value={newWork.end_date || ''} onChange={e => setNewWork(p => ({ ...p, end_date: e.target.value }))} />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={newWork.current || false} onChange={e => setNewWork(p => ({ ...p, current: e.target.checked }))} className="rounded" />
                    <span className="text-sm text-gray-400">Currently working here</span>
                  </label>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea rows={3} className={inputClass} placeholder="Describe your responsibilities and achievements..." value={newWork.description || ''} onChange={e => setNewWork(p => ({ ...p, description: e.target.value }))} />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="secondary" className="flex-1" onClick={() => setShowWorkModal(false)}>Cancel</Button>
                  <Button className="flex-1" onClick={addWorkExperience}>Add Experience</Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Education Tab */}
      {activeTab === 'education' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Education</h2>
            <Button size="sm" onClick={() => setShowEduModal(true)} icon={<span>+</span>}>Add Education</Button>
          </div>

          {(formData.education || []).length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-4xl mb-3">🎓</div>
              <div className="text-gray-400 mb-4">No education added yet</div>
              <Button onClick={() => setShowEduModal(true)}>Add Education</Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {(formData.education as Education[]).map(edu => (
                <Card key={edu.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-white">{edu.degree} in {edu.field}</div>
                      <div className="text-violet-400">{edu.institution}</div>
                      <div className="text-sm text-gray-500 mt-1">{formatDate(edu.start_date)} — {formatDate(edu.end_date)}</div>
                      {edu.gpa && <div className="text-sm text-gray-500">GPA: {edu.gpa}</div>}
                    </div>
                    <button onClick={() => removeEdu(edu.id)} className="text-gray-600 hover:text-red-400 transition-colors text-lg">🗑️</button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {showEduModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="glass-card w-full max-w-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Add Education</h3>
                  <button onClick={() => setShowEduModal(false)} className="text-gray-400 text-xl">×</button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Institution *</label>
                    <input className={inputClass} placeholder="MIT" value={newEdu.institution || ''} onChange={e => setNewEdu(p => ({ ...p, institution: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Degree</label>
                      <input className={inputClass} placeholder="Bachelor of Science" value={newEdu.degree || ''} onChange={e => setNewEdu(p => ({ ...p, degree: e.target.value }))} />
                    </div>
                    <div>
                      <label className={labelClass}>Field of Study</label>
                      <input className={inputClass} placeholder="Computer Science" value={newEdu.field || ''} onChange={e => setNewEdu(p => ({ ...p, field: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Start Date</label>
                      <input type="month" className={inputClass} value={newEdu.start_date || ''} onChange={e => setNewEdu(p => ({ ...p, start_date: e.target.value }))} />
                    </div>
                    <div>
                      <label className={labelClass}>End Date</label>
                      <input type="month" className={inputClass} value={newEdu.end_date || ''} onChange={e => setNewEdu(p => ({ ...p, end_date: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>GPA (optional)</label>
                    <input className={inputClass} placeholder="3.8" value={newEdu.gpa || ''} onChange={e => setNewEdu(p => ({ ...p, gpa: e.target.value }))} />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="secondary" className="flex-1" onClick={() => setShowEduModal(false)}>Cancel</Button>
                  <Button className="flex-1" onClick={addEducation}>Add Education</Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Preferences Tab */}
         {activeTab === 'preferences' && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <Card>
      <h3 className="font-semibold text-white mb-4">Your Preferences</h3>
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-400 mb-2 block">
            Interested Roles
          </label>
          <div className="flex flex-wrap gap-2">
            {(formData.interested_roles || []).map((r: string) => (
              // ✅ brand instead of violet
              <Badge key={r} variant="brand">{r}</Badge>
            ))}
            {!(formData.interested_roles?.length) && (
              <span className="text-gray-600 text-sm">None selected</span>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-400 mb-2 block">
            Preferred Locations
          </label>
          <div className="flex flex-wrap gap-2">
            {(formData.preferred_locations || []).map((l: string) => (
              <Badge key={l} variant="info">{l}</Badge>
            ))}
            {!(formData.preferred_locations?.length) && (
              <span className="text-gray-600 text-sm">None selected</span>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-400 mb-2 block">
            Skills
          </label>
          <div className="flex flex-wrap gap-2">
            {(formData.skills || []).map((s: string) => (
              <Badge key={s} variant="success">{s}</Badge>
            ))}
            {!(formData.skills?.length) && (
              <span className="text-gray-600 text-sm">None selected</span>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-400 mb-2 block">
            Minimum Salary
          </label>
          <div className="text-2xl font-bold text-white">
            ${((formData.min_salary || 0) / 1000).toFixed(0)}K/year
          </div>
        </div>

        <div className="p-4 bg-brand-500/5 border border-brand-500/10 rounded-xl">
          <p className="text-sm text-brand-400">
            💡 To update your preferences, complete the onboarding wizard again.
          </p>
        </div>
      </div>
    </Card>
  </motion.div>
)}
    </div>
  );
}