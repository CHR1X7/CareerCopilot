'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/useProfile';
import { UserProfile } from '@/types';
import RoleSelector from './RoleSelector';
import LocationSelector from './LocationSelector';
import ExperienceLevel from './ExperienceLevel';
import CompanySize from './CompanySize';
import IndustrySelector from './IndustrySelector';
import SalarySelector from './SalarySelector';
import SkillsSelector from './SkillsSelector';
import ProfileBasics from './ProfileBasics';
import Button from '@/components/ui/Button';
import Progress from '@/components/ui/Progress';

const TOTAL_STEPS = 8;

const stepTitles = [
  'Basic Information',
  'Interested Roles',
  'Preferred Locations',
  'Experience Level',
  'Company Size',
  'Industries',
  'Skills',
  'Salary Expectations',
];

export default function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    interested_roles: [],
    preferred_locations: [],
    experience_levels: [],
    company_sizes: [],
    interested_industries: [],
    excluded_industries: [],
    skills: [],
    excluded_skills: [],
    min_salary: 0,
    leadership_preference: 'no_preference',
    work_history: [],
    education: [],
    certifications: [],
  });
  const router = useRouter();

  const updateData = (updates: Partial<UserProfile>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = async () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(s => s + 1);
    } else {
      await handleComplete();
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      // Save profile with onboarding_completed = true
      const payload = {
        ...formData,
        onboarding_completed: true,
      };

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save profile');
      }

      if (data.profile?.onboarding_completed) {
        // Hard redirect — not router.push — to force full page reload
        window.location.href = '/dashboard';
      } else {
        throw new Error('Profile not saved correctly');
      }
    } catch (err: any) {
      console.error('Onboarding save error:', err);
      alert('Failed to save profile. Please try again.');
      setCompleting(false);
    }
  };

  const steps = [
    <ProfileBasics
      key="basics"
      data={formData}
      onChange={updateData}
    />,
    <RoleSelector
      key="roles"
      selected={formData.interested_roles || []}
      onChange={(roles) => updateData({ interested_roles: roles })}
    />,
    <LocationSelector
      key="location"
      selected={formData.preferred_locations || []}
      onChange={(locs) => updateData({ preferred_locations: locs })}
    />,
    <ExperienceLevel
      key="exp"
      selected={formData.experience_levels || []}
      leadership={formData.leadership_preference || 'no_preference'}
      onChange={(levels, leadership) =>
        updateData({ experience_levels: levels, leadership_preference: leadership })
      }
    />,
    <CompanySize
      key="size"
      selected={formData.company_sizes || []}
      onChange={(sizes) => updateData({ company_sizes: sizes })}
    />,
    <IndustrySelector
      key="industry"
      selected={formData.interested_industries || []}
      excluded={formData.excluded_industries || []}
      onChange={(inc, exc) =>
        updateData({ interested_industries: inc, excluded_industries: exc })
      }
    />,
    <SkillsSelector
      key="skills"
      selected={formData.skills || []}
      excluded={formData.excluded_skills || []}
      onChange={(inc, exc) =>
        updateData({ skills: inc, excluded_skills: exc })
      }
    />,
    <SalarySelector
      key="salary"
      value={formData.min_salary || 0}
      onChange={(sal) => updateData({ min_salary: sal })}
    />,
  ];

  const progressPercent = ((step + 1) / TOTAL_STEPS) * 100;

  if (completing) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Setting up your workspace...
          </h2>
          <p className="text-gray-400 mb-6">
            Saving your profile and redirecting you to your dashboard
          </p>
          <div className="flex items-center justify-center gap-2">
            <div
              className="w-3 h-3 bg-violet-500 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="w-3 h-3 bg-violet-500 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <div
              className="w-3 h-3 bg-violet-500 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">CC</span>
            </div>
            <span className="text-2xl font-bold gradient-text">
              CareerCopilot
            </span>
          </div>
          <p className="text-gray-400">
            Let's set up your profile to get started
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              Step {step + 1} of {TOTAL_STEPS}
            </span>
            <span className="text-sm font-medium text-violet-400">
              {stepTitles[step]}
            </span>
          </div>
          <Progress
            value={progressPercent}
            size="md"
            barClassName="bg-gradient-to-r from-violet-500 to-cyan-500"
          />
        </div>

        {/* Step Content */}
        <div className="glass-card p-8 min-h-96">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="secondary"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            ← Back
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            loading={completing}
          >
            {step === TOTAL_STEPS - 1 ? '🚀 Complete Setup' : 'Continue →'}
          </Button>
        </div>

        {/* Skip option */}
        {step > 0 && step < TOTAL_STEPS - 1 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setStep(s => s + 1)}
              className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
            >
              Skip this step →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}