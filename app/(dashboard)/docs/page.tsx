'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'journey', label: '🗺️ User Journey', desc: 'User flow diagrams' },
  { id: 'architecture', label: '🏗️ Architecture', desc: 'System design' },
  { id: 'workflows', label: '⚙️ AI Workflows', desc: 'Agentic flowcharts' },
  { id: 'contracts', label: '📋 Data Contracts', desc: 'JSON schemas' },
  { id: 'wireframes', label: '🖼️ Wireframes', desc: 'Low-fi UI' },
  { id: 'operations', label: '🚀 Operations', desc: 'Deployment & logging' },
];

// ═══ FLOW NODE COMPONENTS ═══
function FlowNode({
  icon,
  title,
  desc,
  color = 'violet',
  size = 'md',
}: {
  icon: string;
  title: string;
  desc?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const colors: Record<string, string> = {
    violet: 'bg-violet-50 border-violet-200 text-violet-700',
    sky: 'bg-sky-50 border-sky-200 text-sky-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    rose: 'bg-rose-50 border-rose-200 text-rose-700',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
    brand: 'bg-brand-50 border-brand-200 text-brand-700',
  };

  const sizes = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-5 py-4',
  };

  return (
    <div className={cn('border rounded-xl text-center', colors[color], sizes[size])}>
      <div className="text-xl mb-1">{icon}</div>
      <div className={cn('font-bold', size === 'sm' ? 'text-[11px]' : 'text-[12px]')}>{title}</div>
      {desc && <div className="text-[10px] opacity-70 mt-0.5">{desc}</div>}
    </div>
  );
}

function Arrow({ dir = 'down', label }: { dir?: 'down' | 'right'; label?: string }) {
  if (dir === 'right') {
    return (
      <div className="flex items-center gap-1">
        <div className="h-px bg-gray-300 flex-1" />
        {label && <span className="text-[9px] text-gray-400 px-1">{label}</span>}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 flex-shrink-0">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-0.5 my-1">
      <div className="w-px h-4 bg-gray-300" />
      {label && <span className="text-[9px] text-gray-400">{label}</span>}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}

function Decision({ text }: { text: string }) {
  return (
    <div className="flex justify-center my-1">
      <div className="bg-amber-50 border-2 border-amber-300 px-4 py-2 rotate-0 rounded-lg text-[11px] font-bold text-amber-700 text-center">
        ◆ {text}
      </div>
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-text-primary mb-1">{title}</h2>
      <p className="text-text-tertiary text-sm">{subtitle}</p>
      <div className="h-1 w-16 bg-gradient-to-r from-brand-400 to-sky-400 rounded-full mt-3" />
    </div>
  );
}

function Box({
  children,
  title,
  color = 'gray',
  className = '',
}: {
  children: React.ReactNode;
  title?: string;
  color?: string;
  className?: string;
}) {
  const colors: Record<string, string> = {
    gray: 'border-gray-200 bg-gray-50',
    violet: 'border-violet-200 bg-violet-50/50',
    sky: 'border-sky-200 bg-sky-50/50',
    emerald: 'border-emerald-200 bg-emerald-50/50',
    amber: 'border-amber-200 bg-amber-50/50',
  };
  return (
    <div className={cn('border rounded-2xl p-5', colors[color], className)}>
      {title && <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">{title}</p>}
      {children}
    </div>
  );
}

// ═══ TAB CONTENT COMPONENTS ═══

function UserJourneyTab() {
  return (
    <div className="space-y-12">
      <SectionTitle title="User Journey Maps" subtitle="Step-by-step flows for every core feature interaction" />

      {/* Journey 1: Onboarding */}
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-black">1</span>
          Onboarding Flow
        </h3>
        <Box color="violet">
          <div className="flex flex-col items-center">
            <FlowNode icon="👤" title="User visits CareerCopilot" color="gray" />
            <Arrow />
            <FlowNode icon="🔐" title="Click 'Get Started'" desc="Redirected to Clerk auth" color="brand" />
            <Arrow label="Sign up with email / Google" />
            <FlowNode icon="✉️" title="Email Verification" desc="Clerk sends verification email" color="sky" />
            <Arrow label="Verified ✓" />
            <FlowNode icon="📋" title="8-Step Onboarding Wizard" desc="Guided profile setup" color="violet" />

            {/* 8 steps in a horizontal row */}
            <div className="w-full mt-4 mb-4">
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[
                  { n: '1', t: 'Basic Info', i: '👤' },
                  { n: '2', t: 'Roles', i: '💼' },
                  { n: '3', t: 'Locations', i: '📍' },
                  { n: '4', t: 'Experience', i: '📊' },
                ].map((s) => (
                  <FlowNode key={s.n} icon={s.i} title={`${s.n}. ${s.t}`} color="violet" size="sm" />
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { n: '5', t: 'Company Size', i: '🏢' },
                  { n: '6', t: 'Industries', i: '🏭' },
                  { n: '7', t: 'Skills', i: '⚡' },
                  { n: '8', t: 'Salary', i: '💰' },
                ].map((s) => (
                  <FlowNode key={s.n} icon={s.i} title={`${s.n}. ${s.t}`} color="violet" size="sm" />
                ))}
              </div>
            </div>

            <Arrow label="Profile saved to Supabase" />
            <FlowNode icon="🏠" title="Redirected to Dashboard" desc="onboarding_completed = true" color="emerald" />
          </div>
        </Box>
      </div>

      {/* Journey 2: Resume Analyzer Activation */}
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-black">2</span>
          Resume Analyzer Activation
        </h3>
        <Box color="sky">
          <div className="flex flex-col items-center">
            <FlowNode icon="🏠" title="User on Dashboard" color="gray" />
            <Arrow />
            <div className="grid grid-cols-3 gap-3 my-2 w-full">
              <FlowNode icon="📊" title="Click 'Analyze Resume'" desc="Via Quick Action" color="sky" size="sm" />
              <FlowNode icon="🔍" title="Scout a Job" desc="Click 'Analyze Match'" color="sky" size="sm" />
              <FlowNode icon="🔗" title="Import a Job" desc="Click 'Analyze Match'" color="sky" size="sm" />
            </div>
            <Arrow label="All paths lead to Resume Analyzer" />
            <FlowNode icon="📄" title="Paste Resume / Fill from Profile" desc="Autofill button populates textarea" color="sky" />
            <Arrow />
            <FlowNode icon="📝" title="Paste Job Description" desc="Manual or auto-loaded from Import/Scout" color="sky" />
            <Arrow />
            <FlowNode icon="🚀" title="Click 'Analyze Match'" desc="POST /api/resume/analyze" color="brand" />
            <Arrow label="AI Processing ~5-10s" />
            <FlowNode icon="📊" title="Results Displayed" desc="Score + Skills + Insights" color="emerald" />
            <Arrow />
            <div className="grid grid-cols-3 gap-3 my-2 w-full">
              <FlowNode icon="👍" title="Thumbs Up" desc="Feedback saved to DB" color="emerald" size="sm" />
              <FlowNode icon="👎" title="Thumbs Down" desc="Feedback saved to DB" color="rose" size="sm" />
              <FlowNode icon="📋" title="Add to Tracker" desc="Saved as application" color="indigo" size="sm" />
            </div>
          </div>
        </Box>
      </div>

      {/* Journey 3: Answer Generator */}
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black">3</span>
          Tailored Answer Agent Activation
        </h3>
        <Box color="amber">
          <div className="flex flex-col items-center">
            <FlowNode icon="✍️" title="Navigate to Answer Generator" color="gray" />
            <Arrow />
            <FlowNode icon="📝" title="Paste Job Description" color="amber" />
            <Arrow />
            <FlowNode icon="🤖" title="Click 'AI Extract Questions'" desc="POST /api/generate/questions" color="brand" />
            <Arrow label="OR manually select questions" />
            <FlowNode icon="☑️" title="Select Questions" desc="Common + AI-extracted + Custom" color="amber" />
            <Arrow />
            <FlowNode icon="✨" title="Click 'Generate Answers'" desc="POST /api/generate/answer" color="brand" />
            <Arrow label="AI reads your profile + JD" />
            <FlowNode icon="💬" title="Personalized Answers Shown" desc="With delivery tips" color="emerald" />
            <Arrow />
            <div className="grid grid-cols-4 gap-2 my-2 w-full">
              <FlowNode icon="✏️" title="Edit Answer" desc="Inline editor" color="sky" size="sm" />
              <FlowNode icon="📋" title="Copy" desc="To clipboard" color="violet" size="sm" />
              <FlowNode icon="👍" title="Rate Up" desc="Saved to DB" color="emerald" size="sm" />
              <FlowNode icon="👎" title="Rate Down" desc="Saved to DB" color="rose" size="sm" />
            </div>
          </div>
        </Box>
      </div>

      {/* Journey 4: Interaction & Feedback Loop */}
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">4</span>
          AI Interaction & Feedback Loop
        </h3>
        <Box color="emerald">
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <div className="text-sm font-bold text-text-primary mb-3">📤 AI Generates</div>
              <FlowNode icon="🤖" title="AI produces output" desc="Resume score / Answer" color="brand" />
              <Arrow />
              <FlowNode icon="👀" title="User reviews" desc="Presented clearly" color="violet" />
            </div>
            <div className="flex flex-col items-center">
              <div className="text-sm font-bold text-text-primary mb-3">✏️ User Intervenes</div>
              <FlowNode icon="✅" title="Accept as-is" desc="Copy / Apply" color="emerald" />
              <Arrow />
              <FlowNode icon="✏️" title="Edit content" desc="Inline editing" color="sky" />
              <Arrow />
              <FlowNode icon="❌" title="Reject / Retry" desc="Generate again" color="rose" />
            </div>
            <div className="flex flex-col items-center">
              <div className="text-sm font-bold text-text-primary mb-3">💬 Feedback Saved</div>
              <FlowNode icon="👍" title="Thumbs Up" desc="rating: 'up'" color="emerald" />
              <Arrow />
              <FlowNode icon="💾" title="POST /api/feedback" desc="Saved to DB" color="brand" />
              <Arrow />
              <FlowNode icon="📊" title="Future Training Data" desc="Improves AI quality" color="violet" />
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
}

function ArchitectureTab() {
  return (
    <div className="space-y-10">
      <SectionTitle title="System Architecture" subtitle="High-level diagram showing all system components and data flows" />

      {/* Main Architecture Diagram */}
      <Box color="gray">
        {/* Row 1: Client */}
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">CLIENT LAYER</p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: '🏠', t: 'Dashboard', d: 'Next.js Page' },
                { icon: '📊', t: 'Resume Analyzer', d: 'Next.js Page' },
                { icon: '🔍', t: 'Job Scout', d: 'Next.js Page' },
                { icon: '📋', t: 'App Tracker', d: 'Next.js Page' },
              ].map((c, i) => (
                <div key={i} className="bg-white border border-blue-200 rounded-lg p-2.5 text-center">
                  <div className="text-lg">{c.icon}</div>
                  <div className="text-[11px] font-bold text-blue-800">{c.t}</div>
                  <div className="text-[9px] text-blue-500">{c.d}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">React Hooks • Framer Motion • Tailwind CSS</span>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center gap-2 my-3">
          <div className="flex-1 h-px bg-gray-300" />
          <div className="text-[10px] text-gray-500 font-medium">HTTPS Requests • fetch() API calls</div>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Row 2: API Gateway */}
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">API LAYER — Next.js App Router (serverless)</p>
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                '/api/users',
                '/api/resume/analyze',
                '/api/resume/ats-score',
                '/api/generate/answer',
                '/api/generate/cover-letter',
                '/api/generate/questions',
                '/api/applications',
                '/api/jobs/scout',
                '/api/import-job',
              ].map((r) => (
                <div key={r} className="bg-white border border-violet-200 rounded-lg px-2.5 py-1.5 text-center">
                  <code className="text-[10px] font-bold text-violet-700">{r}</code>
                </div>
              ))}
            </div>
            <div className="flex gap-2 justify-center">
              <span className="text-[9px] font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">Clerk Auth Middleware</span>
              <span className="text-[9px] font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">TypeScript</span>
              <span className="text-[9px] font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">Error Handling</span>
            </div>
          </div>
        </div>

        {/* Row 3: Split into 3 services */}
        <div className="flex items-center gap-2 my-3">
          <div className="flex-1 h-px bg-gray-300" />
          <div className="text-[10px] text-gray-500 font-medium">Routes to appropriate services</div>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Auth Service */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
            <p className="text-[9px] font-bold uppercase tracking-widest text-orange-600 mb-2">Auth Service</p>
            <div className="bg-white border border-orange-200 rounded-lg p-2 text-center mb-2">
              <div className="text-lg">🔐</div>
              <div className="text-[11px] font-bold text-orange-800">Clerk</div>
              <div className="text-[9px] text-orange-500">User Management</div>
            </div>
            <div className="text-[9px] text-orange-600 space-y-0.5">
              <div>• JWT tokens</div>
              <div>• Session management</div>
              <div>• OAuth (Google)</div>
            </div>
          </div>

          {/* AI Agent Layer */}
          <div className="bg-brand-50 border border-brand-200 rounded-xl p-3">
            <p className="text-[9px] font-bold uppercase tracking-widest text-brand-600 mb-2">AI Agent Layer</p>
            <div className="bg-white border border-brand-200 rounded-lg p-2 text-center mb-2">
              <div className="text-lg">🤖</div>
              <div className="text-[11px] font-bold text-brand-800">Groq LLM</div>
              <div className="text-[9px] text-brand-500">llama-3.3-70b-versatile</div>
            </div>
            <div className="text-[9px] text-brand-600 space-y-0.5">
              <div>• Prompt engineering</div>
              <div>• JSON output parsing</div>
              <div>• Error handling</div>
            </div>
          </div>

          {/* Job APIs */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 mb-2">External Job APIs</p>
            <div className="space-y-1">
              {['Remotive', 'Arbeitnow', 'Himalayas'].map((api) => (
                <div key={api} className="bg-white border border-emerald-200 rounded-lg px-2 py-1 text-center">
                  <div className="text-[10px] font-bold text-emerald-800">{api}</div>
                  <div className="text-[8px] text-emerald-500">Free API</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center gap-2 my-3">
          <div className="flex-1 h-px bg-gray-300" />
          <div className="text-[10px] text-gray-500 font-medium">Read / Write operations</div>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Row 4: Database */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">DATA LAYER</p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="grid grid-cols-4 gap-3">
              {[
                { t: 'user_profiles', d: 'Profile + prefs', icon: '👤' },
                { t: 'applications', d: 'Job tracking', icon: '📋' },
                { t: 'resume_analyses', d: 'AI scores', icon: '📊' },
                { t: 'feedback', d: 'AI ratings', icon: '💬' },
              ].map((db) => (
                <div key={db.t} className="bg-white border border-emerald-200 rounded-lg p-2.5 text-center">
                  <div className="text-lg">{db.icon}</div>
                  <code className="text-[10px] font-bold text-emerald-800">{db.t}</code>
                  <div className="text-[9px] text-emerald-500">{db.d}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                Supabase PostgreSQL • Row Level Security • supabase-js SDK
              </span>
            </div>
          </div>
        </div>
      </Box>

      {/* Deployment Layer */}
      <Box color="violet" title="Deployment Layer">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-violet-200 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">▲</div>
            <div className="text-[13px] font-bold text-text-primary">Vercel</div>
            <div className="text-[11px] text-text-tertiary mt-1">Frontend + API Routes</div>
            <div className="text-[10px] text-text-muted mt-2">Auto-deploys from GitHub • Edge Network • Free tier</div>
          </div>
          <div className="bg-white border border-violet-200 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🐘</div>
            <div className="text-[13px] font-bold text-text-primary">Supabase</div>
            <div className="text-[11px] text-text-tertiary mt-1">PostgreSQL Database</div>
            <div className="text-[10px] text-text-muted mt-2">Managed DB • Free 500MB • REST + realtime</div>
          </div>
          <div className="bg-white border border-violet-200 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🔐</div>
            <div className="text-[13px] font-bold text-text-primary">Clerk</div>
            <div className="text-[11px] text-text-tertiary mt-1">Auth Provider</div>
            <div className="text-[10px] text-text-muted mt-2">JWT • OAuth • Free 10K users</div>
          </div>
        </div>
      </Box>
    </div>
  );
}

function WorkflowsTab() {
  return (
    <div className="space-y-12">
      <SectionTitle title="Agentic AI Workflows" subtitle="Detailed flowcharts for each AI agent — inputs, steps, tools, and outputs" />

      {/* Resume Scorer Workflow */}
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-black">A</span>
          Resume Scorer Agent Workflow
        </h3>
        <Box color="violet">
          <div className="grid grid-cols-5 gap-3 items-center">
            {/* INPUT */}
            <div className="space-y-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted text-center mb-2">INPUT</p>
              <FlowNode icon="📄" title="Resume Text" desc="Pasted or from profile" color="gray" size="sm" />
              <FlowNode icon="🔗" title="Job Description" desc="Pasted or imported" color="gray" size="sm" />
            </div>

            <Arrow dir="right" label="POST /api/resume/analyze" />

            {/* PROCESSING */}
            <div className="space-y-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted text-center mb-2">AGENT STEPS</p>
              <FlowNode icon="🔐" title="Step 1: Auth" desc="Verify Clerk JWT" color="amber" size="sm" />
              <FlowNode icon="🔧" title="Step 2: Validate" desc="Min length checks" color="amber" size="sm" />
              <FlowNode icon="🧠" title="Step 3: LLM Call" desc="Groq API w/ prompt" color="brand" size="sm" />
              <FlowNode icon="🔍" title="Step 4: Parse" desc="JSON.parse() + validate" color="amber" size="sm" />
              <FlowNode icon="💾" title="Step 5: Store" desc="Save to Supabase" color="emerald" size="sm" />
            </div>

            <Arrow dir="right" label="JSON response" />

            {/* OUTPUT */}
            <div className="space-y-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted text-center mb-2">OUTPUT</p>
              <FlowNode icon="📊" title="Match Score" desc="Integer 0-100" color="emerald" size="sm" />
              <FlowNode icon="✅" title="Matched Skills" desc="String array" color="emerald" size="sm" />
              <FlowNode icon="❌" title="Missing Skills" desc="String array" color="rose" size="sm" />
              <FlowNode icon="💡" title="5-7 Insights" desc="With priority + action" color="violet" size="sm" />
            </div>
          </div>

          {/* Prompt Engineering Box */}
          <div className="mt-5 bg-white border border-violet-200 rounded-xl p-4">
            <p className="text-[10px] font-bold text-violet-700 uppercase tracking-wider mb-2">🧠 System Prompt Engineering</p>
            <div className="font-mono text-[10px] text-text-secondary leading-relaxed bg-gray-50 rounded-lg p-3">
              <span className="text-violet-600">ROLE:</span> Expert technical recruiter with 15+ years experience<br />
              <span className="text-sky-600">TASK:</span> Analyze resume vs job description<br />
              <span className="text-emerald-600">FORMAT:</span> Respond ONLY in valid JSON — no markdown<br />
              <span className="text-amber-600">SCHEMA:</span> {'{'} match_score, matched_skills[], missing_skills[], insights[], overall_assessment {'}'}
            </div>
          </div>

          {/* Error Handling */}
          <div className="mt-3 bg-rose-50 border border-rose-200 rounded-xl p-3">
            <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wider mb-2">⚠️ Error Handling</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { e: 'JSON Parse Fail', h: 'Return 500 + retry message' },
                { e: 'Groq API Error', h: 'Return error.message to frontend' },
                { e: 'DB Write Fail', h: 'Non-fatal — still return analysis' },
              ].map((e, i) => (
                <div key={i} className="bg-white border border-rose-200 rounded-lg p-2">
                  <div className="text-[10px] font-bold text-rose-700">{e.e}</div>
                  <div className="text-[9px] text-rose-500 mt-0.5">{e.h}</div>
                </div>
              ))}
            </div>
          </div>
        </Box>
      </div>

      {/* Answer Generator Workflow */}
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-black">B</span>
          Tailored Answer Agent Workflow
        </h3>
        <Box color="sky">
          <div className="grid grid-cols-5 gap-3 items-start">
            <div className="space-y-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted text-center mb-2">INPUT</p>
              <FlowNode icon="👤" title="User Profile" desc="From Supabase" color="gray" size="sm" />
              <FlowNode icon="📝" title="Job Description" desc="Pasted text" color="gray" size="sm" />
              <FlowNode icon="❓" title="Questions Array" desc="Selected by user" color="gray" size="sm" />
            </div>

            <Arrow dir="right" label="POST /api/generate/answer" />

            <div className="space-y-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted text-center mb-2">AGENT STEPS</p>
              <FlowNode icon="🔐" title="Step 1: Auth" desc="Verify user JWT" color="amber" size="sm" />
              <FlowNode icon="📖" title="Step 2: Fetch Profile" desc="SELECT from Supabase" color="amber" size="sm" />
              <FlowNode icon="🔨" title="Step 3: Build Context" desc="Profile + JD + Questions" color="amber" size="sm" />
              <FlowNode icon="🧠" title="Step 4: LLM Call" desc="Career coach persona" color="brand" size="sm" />
              <FlowNode icon="🔍" title="Step 5: Parse JSON" desc="Extract answers array" color="amber" size="sm" />
            </div>

            <Arrow dir="right" label="answers array" />

            <div className="space-y-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted text-center mb-2">OUTPUT</p>
              <FlowNode icon="💬" title="Answer Text" desc="200-400 words" color="emerald" size="sm" />
              <FlowNode icon="🎯" title="Delivery Tips" desc="3 tips per answer" color="sky" size="sm" />
              <FlowNode icon="✏️" title="Editable" desc="User can modify" color="violet" size="sm" />
              <FlowNode icon="📋" title="Copyable" desc="One-click copy" color="violet" size="sm" />
            </div>
          </div>

          <div className="mt-5 bg-white border border-sky-200 rounded-xl p-4">
            <p className="text-[10px] font-bold text-sky-700 uppercase tracking-wider mb-2">🧠 Prompt Strategy</p>
            <div className="font-mono text-[10px] text-text-secondary leading-relaxed bg-gray-50 rounded-lg p-3">
              <span className="text-violet-600">PERSONA:</span> Expert career coach with hiring experience<br />
              <span className="text-sky-600">CONTEXT:</span> Candidate profile + Job description + Questions<br />
              <span className="text-emerald-600">RULES:</span> Specific, not generic. Use real experience. Sound human.<br />
              <span className="text-amber-600">OUTPUT:</span> {'{ "answers": [{ question, answer, tips[] }] }'}
            </div>
          </div>
        </Box>
      </div>

      {/* Job Scout Workflow */}
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">C</span>
          Job Scout Agent Workflow
        </h3>
        <Box color="emerald">
          <div className="flex flex-col items-center">
            <FlowNode icon="👤" title="POST /api/jobs/scout" desc="User triggers scout" color="gray" />
            <Arrow />
            <FlowNode icon="📖" title="Fetch User Profile" desc="Roles + Skills + Locations from Supabase" color="emerald" />
            <Arrow />
            <FlowNode icon="🔨" title="Build Search Queries" desc="top_role + top_skills joined as search term" color="amber" />
            <Arrow />
            <div className="grid grid-cols-3 gap-3 my-2 w-full">
              <FlowNode icon="🌐" title="Remotive API" desc="Remote jobs" color="emerald" size="sm" />
              <FlowNode icon="🌐" title="Arbeitnow API" desc="Global listings" color="emerald" size="sm" />
              <FlowNode icon="🌐" title="Himalayas API" desc="Remote jobs" color="emerald" size="sm" />
            </div>
            <Arrow label="Deduplicate by title+company" />
            <FlowNode icon="🔀" title="Merge + Deduplicate" desc="Unique jobs only" color="amber" />
            <Arrow />
            <FlowNode icon="🧠" title="AI Scoring" desc="Score 0-100 + match reason per job" color="brand" />
            <Arrow />
            <FlowNode icon="📊" title="Sort by match_score DESC" desc="Best matches first" color="emerald" />
            <Arrow />
            <FlowNode icon="✅" title="Return top 12 jobs" desc="With scores + reasons" color="emerald" />
          </div>
        </Box>
      </div>

      {/* ATS Score Workflow */}
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black">D</span>
          ATS Score Workflow
        </h3>
        <Box color="amber">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-3">Input</p>
              <div className="space-y-2">
                {['name + email + phone', 'professional summary', 'skills array', 'work_history JSONB', 'education JSONB'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-white border border-amber-200 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <code className="text-[10px] text-amber-800">{f}</code>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-3">AI Scoring Criteria</p>
              <div className="space-y-1.5">
                {[
                  { cat: 'Contact Info', pts: '15pts' },
                  { cat: 'Summary', pts: '15pts' },
                  { cat: 'Skills Keywords', pts: '20pts' },
                  { cat: 'Work Experience', pts: '25pts' },
                  { cat: 'Education', pts: '10pts' },
                  { cat: 'Formatting', pts: '10pts' },
                  { cat: 'Completeness', pts: '5pts' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-white border border-amber-200 rounded-lg">
                    <span className="text-[10px] text-amber-800 font-medium">{c.cat}</span>
                    <span className="text-[10px] font-bold text-amber-600">{c.pts}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-3">Output JSON</p>
              <div className="bg-gray-900 text-emerald-400 rounded-xl p-3 font-mono text-[9px] leading-relaxed">
                {`{
  "score": 87,
  "breakdown": {
    "contact_info": {
      "score": 14,
      "feedback": "..."
    },
    "skills": {
      "score": 18,
      "feedback": "..."
    }
  },
  "top_improvements": [
    "Add LinkedIn URL",
    "Expand skill keywords"
  ]
}`}
              </div>
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
}

function ContractsTab() {
  return (
    <div className="space-y-10">
      <SectionTitle title="Data Contracts" subtitle="Exact JSON schemas for all API inputs and outputs" />

      <div className="grid grid-cols-2 gap-6">
        {/* User Profile Schema */}
        <Box color="violet" title="User Profile Schema (Supabase)">
          <div className="bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-[10px] leading-relaxed overflow-auto max-h-80">
            {`{
  "id": "uuid",
  "clerk_user_id": "string (unique)",
  "full_name": "string | null",
  "email": "string | null",
  "phone": "string | null",
  "location": "string | null",
  "linkedin_url": "string | null",
  "portfolio_url": "string | null",
  "summary": "string | null",

  // Preferences arrays
  "interested_roles": "string[]",
  "preferred_locations": "string[]",
  "experience_levels": "string[]",
  "company_sizes": "string[]",
  "interested_industries": "string[]",
  "excluded_industries": "string[]",
  "skills": "string[]",
  "excluded_skills": "string[]",
  "min_salary": "integer",
  "leadership_preference": "string",

  // JSONB arrays
  "work_history": WorkExperience[],
  "education": Education[],
  "certifications": Certification[],

  "onboarding_completed": "boolean",
  "created_at": "timestamptz",
  "updated_at": "timestamptz"
}`}
          </div>
        </Box>

        {/* Resume Analysis Output */}
        <Box color="sky" title="Resume Analysis Output Schema">
          <div className="bg-gray-900 text-blue-400 rounded-xl p-4 font-mono text-[10px] leading-relaxed overflow-auto max-h-80">
            {`{
  "analysis": {
    "match_score": 82,         // integer 0-100
    "matched_skills": [        // string[]
      "React",
      "TypeScript",
      "Node.js"
    ],
    "missing_skills": [        // string[]
      "Kubernetes",
      "Go"
    ],
    "overall_assessment": "Strong candidate...",

    "insights": [              // Insight[]
      {
        "category": "Skills",  // enum
        "title": "Add Docker",
        "description": "...",
        "priority": "high",    // "high"|"medium"|"low"
        "action": "Add 'Docker' to skills"
      }
    ]
  }
}`}
          </div>
        </Box>

        {/* Application Schema */}
        <Box color="emerald" title="Application Tracking Schema">
          <div className="bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-[10px] leading-relaxed overflow-auto max-h-64">
            {`{
  "id": "uuid",
  "clerk_user_id": "string",
  "company_name": "string",
  "job_title": "string",
  "job_url": "string | null",
  "job_description": "text | null",
  "status": ApplicationStatus,
  // "not_submitted" | "submitted" |
  // "received_initial_response" |
  // "interview_requested" |
  // "onsite_interview_requested" |
  // "offer_received" | "rejected" |
  // "rejected_after_interview" |
  // "withdrawn"
  "match_score": "integer | null",
  "notes": "text | null",
  "applied_date": "timestamptz | null",
  "created_at": "timestamptz",
  "updated_at": "timestamptz"
}`}
          </div>
        </Box>

        {/* Feedback Schema */}
        <Box color="amber" title="Feedback & Answer Schemas">
          <div className="space-y-3">
            <div>
              <p className="text-[9px] font-bold text-amber-700 uppercase tracking-wider mb-1">Feedback Table</p>
              <div className="bg-gray-900 text-yellow-400 rounded-xl p-3 font-mono text-[10px] leading-relaxed">
                {`{
  "feature": "resume_analyzer",
  // | "answer_generator"
  "rating": "up" | "down",
  "context": { "match_score": 82 }
}`}
              </div>
            </div>
            <div>
              <p className="text-[9px] font-bold text-amber-700 uppercase tracking-wider mb-1">Generated Answer Output</p>
              <div className="bg-gray-900 text-yellow-400 rounded-xl p-3 font-mono text-[10px] leading-relaxed">
                {`{
  "answers": [{
    "question": "Why are you...",
    "answer": "Based on my...",
    "tips": [
      "Make eye contact",
      "Be specific"
    ]
  }]
}`}
              </div>
            </div>
          </div>
        </Box>
      </div>

      {/* WorkExperience Sub-schema */}
      <Box color="gray" title="Sub-schemas (JSONB fields in user_profiles)">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">WorkExperience</p>
            <div className="bg-gray-900 text-green-400 rounded-xl p-3 font-mono text-[10px] leading-relaxed">
              {`{
  "id": "string",
  "company": "string",
  "title": "string",
  "start_date": "YYYY-MM",
  "end_date": "YYYY-MM|null",
  "current": "boolean",
  "description": "string",
  "location": "string"
}`}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Education</p>
            <div className="bg-gray-900 text-blue-400 rounded-xl p-3 font-mono text-[10px] leading-relaxed">
              {`{
  "id": "string",
  "institution": "string",
  "degree": "string",
  "field": "string",
  "start_date": "YYYY-MM",
  "end_date": "YYYY-MM",
  "gpa": "string|null"
}`}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Scouted Job</p>
            <div className="bg-gray-900 text-purple-400 rounded-xl p-3 font-mono text-[10px] leading-relaxed">
              {`{
  "id": "string",
  "title": "string",
  "company": "string",
  "location": "string",
  "url": "string",
  "salary": "string|null",
  "match_score": "integer",
  "match_reason": "string",
  "source": "Remotive|..."
}`}
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}

function WireframesTab() {
  return (
    <div className="space-y-10">
      <SectionTitle title="Low-Fidelity Wireframes" subtitle="UI blueprints for all primary screens" />

      <div className="grid grid-cols-2 gap-6">
        {/* Dashboard */}
        <Box title="Dashboard — Main View" color="violet">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex" style={{ height: 280 }}>
              {/* Sidebar */}
              <div className="w-14 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-3 gap-3">
                <div className="w-8 h-8 bg-violet-200 rounded-lg" />
                {['🏠', '📊', '📝', '🔍', '📋', '👤'].map((i, idx) => (
                  <div key={idx} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${idx === 0 ? 'bg-violet-100' : ''}`}>{i}</div>
                ))}
              </div>
              {/* Main */}
              <div className="flex-1 p-3 bg-gray-50">
                <div className="h-4 bg-gray-800 rounded w-32 mb-1" />
                <div className="h-2.5 bg-gray-300 rounded w-24 mb-3" />
                {/* Stats */}
                <div className="grid grid-cols-4 gap-1.5 mb-3">
                  {['bg-violet-100', 'bg-sky-100', 'bg-emerald-100', 'bg-amber-100'].map((c, i) => (
                    <div key={i} className={`${c} rounded-lg p-2`}>
                      <div className="h-4 w-6 bg-gray-400 rounded mb-1" />
                      <div className="h-2 bg-gray-300 rounded w-full" />
                    </div>
                  ))}
                </div>
                {/* Quick actions */}
                <div className="grid grid-cols-4 gap-1.5 mb-3">
                  {['bg-violet-50', 'bg-sky-50', 'bg-amber-50', 'bg-emerald-50'].map((c, i) => (
                    <div key={i} className={`${c} border border-gray-200 rounded-lg p-2 text-center`}>
                      <div className="h-5 w-5 bg-gray-300 rounded mx-auto mb-1" />
                      <div className="h-2 bg-gray-400 rounded mb-0.5" />
                      <div className="h-1.5 bg-gray-300 rounded" />
                    </div>
                  ))}
                </div>
                {/* Jobs */}
                <div className="h-2 bg-gray-400 rounded w-20 mb-1.5" />
                <div className="grid grid-cols-2 gap-1.5">
                  {[0, 1].map((i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-lg p-2">
                      <div className="flex justify-between mb-1">
                        <div className="h-2.5 bg-gray-400 rounded w-24" />
                        <div className="h-2.5 bg-emerald-200 rounded w-8" />
                      </div>
                      <div className="h-2 bg-gray-300 rounded w-16" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Box>

        {/* Resume Analyzer */}
        <Box title="Resume Analyzer" color="sky">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div style={{ height: 280 }} className="p-3 bg-gray-50">
              <div className="h-3.5 bg-gray-800 rounded w-36 mb-0.5" />
              <div className="h-2 bg-gray-300 rounded w-48 mb-3" />
              {/* Two textareas */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-white border border-gray-200 rounded-lg p-2">
                  <div className="flex justify-between mb-1.5">
                    <div className="h-2 bg-gray-400 rounded w-16" />
                    <div className="h-2 bg-violet-300 rounded w-20" />
                  </div>
                  <div className="space-y-1">
                    {[100, 90, 95, 80, 70, 88].map((w, i) => (
                      <div key={i} className="h-1.5 bg-gray-200 rounded" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-2">
                  <div className="h-2 bg-gray-400 rounded w-24 mb-1.5" />
                  <div className="space-y-1">
                    {[100, 85, 90, 75, 80, 70].map((w, i) => (
                      <div key={i} className="h-1.5 bg-gray-200 rounded" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                </div>
              </div>
              {/* Analyze button */}
              <div className="flex justify-center mb-3">
                <div className="h-7 w-32 bg-violet-400 rounded-xl" />
              </div>
              {/* Score Ring + Skills */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white border border-gray-200 rounded-lg p-2 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-300 flex items-center justify-center">
                    <div className="h-3 bg-emerald-400 rounded w-8" />
                  </div>
                  <div className="h-2 bg-gray-300 rounded w-14 mt-1.5" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-2">
                  <div className="h-2 bg-emerald-300 rounded w-16 mb-1.5" />
                  <div className="flex flex-wrap gap-0.5">
                    {[20, 28, 22].map((w, i) => (
                      <div key={i} className="h-3 bg-emerald-100 border border-emerald-200 rounded-full" style={{ width: w }} />
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-2">
                  <div className="h-2 bg-rose-300 rounded w-16 mb-1.5" />
                  <div className="flex flex-wrap gap-0.5">
                    {[18, 25].map((w, i) => (
                      <div key={i} className="h-3 bg-rose-100 border border-rose-200 rounded-full" style={{ width: w }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>

        {/* Profile Settings */}
        <Box title="Profile / Settings Screen" color="emerald">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div style={{ height: 280 }} className="p-3 bg-gray-50">
              <div className="h-3.5 bg-gray-800 rounded w-24 mb-0.5" />
              <div className="h-2 bg-gray-300 rounded w-48 mb-3" />
              {/* 5 tabs */}
              <div className="flex gap-1.5 mb-3">
                {['Autofill', 'Basic Info', 'Experience', 'Education', 'Prefs'].map((t, i) => (
                  <div key={t} className={`h-6 px-2.5 rounded-lg text-[8px] flex items-center font-semibold ${i === 0 ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-600'}`}>{t}</div>
                ))}
              </div>
              {/* Autofill fields */}
              <div className="space-y-1.5">
                {['Full Name', 'Email', 'Phone', 'Location', 'LinkedIn'].map((f) => (
                  <div key={f} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-2.5 py-1.5">
                    <div>
                      <div className="h-1.5 bg-gray-300 rounded w-12 mb-0.5" />
                      <div className="h-2 bg-gray-400 rounded w-24" />
                    </div>
                    <div className="h-5 w-10 bg-gray-200 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Box>

        {/* Answer Generator */}
        <Box title="Generated Answer Component" color="amber">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div style={{ height: 280 }} className="p-3 bg-gray-50">
              <div className="h-3.5 bg-gray-800 rounded w-36 mb-3" />
              {/* Question + JD inputs side by side */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-white border border-gray-200 rounded-lg p-2">
                  <div className="h-2 bg-gray-400 rounded w-20 mb-1" />
                  <div className="h-16 bg-gray-100 rounded" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-2">
                  <div className="h-2 bg-gray-400 rounded w-20 mb-1" />
                  <div className="space-y-1">
                    {['Why are you a good fit?', 'Tell me about yourself', 'Greatest strength?'].map((q, i) => (
                      <div key={i} className="flex items-center gap-1.5 p-1 rounded">
                        <div className="w-3 h-3 rounded border border-gray-300" />
                        <div className="h-1.5 bg-gray-300 rounded flex-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Answer card */}
              <div className="bg-white border border-gray-200 rounded-lg p-2">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="h-2 bg-gray-400 rounded w-32" />
                  <div className="flex gap-1">
                    <div className="h-5 w-10 bg-gray-200 rounded-lg" />
                    <div className="h-5 w-10 bg-violet-200 rounded-lg" />
                  </div>
                </div>
                <div className="space-y-1 mb-2">
                  {[100, 95, 88, 92, 75].map((w, i) => (
                    <div key={i} className="h-1.5 bg-gray-200 rounded" style={{ width: `${w}%` }} />
                  ))}
                </div>
                {/* Tips */}
                <div className="bg-sky-50 border border-sky-200 rounded-lg p-1.5">
                  <div className="h-1.5 bg-sky-300 rounded w-16 mb-1" />
                  {[0, 1].map((i) => (
                    <div key={i} className="flex items-center gap-1 mb-0.5">
                      <div className="w-1 h-1 rounded-full bg-sky-400" />
                      <div className="h-1.5 bg-sky-200 rounded flex-1" />
                    </div>
                  ))}
                </div>
                {/* Feedback */}
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="h-1.5 bg-gray-300 rounded w-20" />
                  <div className="w-5 h-5 bg-emerald-100 rounded-lg" />
                  <div className="w-5 h-5 bg-rose-100 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
}

function OperationsTab() {
  return (
    <div className="space-y-10">
      <SectionTitle title="Production Operations" subtitle="Deployment strategy, monitoring, logging, and observability" />

      {/* Deployment Strategy */}
      <Box color="violet" title="Deployment Strategy">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { phase: 'Phase 1 — Now', icon: '🖥️', title: 'Vercel (Live)', items: ['Next.js serverless functions', 'Auto-deploy from GitHub main', 'Edge CDN worldwide', 'Free tier — 0 cost', 'Domain: career-copilot.vercel.app'] },
            { phase: 'Phase 2 — Future', icon: '🐳', title: 'Docker + Cloud', items: ['Containerize with Docker', 'Docker Compose for local dev', 'Deploy to AWS ECS or GCP Run', 'Environment secrets in AWS SM', 'Blue/green deployment'] },
            { phase: 'Phase 3 — Scale', icon: '☸️', title: 'Kubernetes', items: ['K8s orchestration', 'Horizontal pod autoscaling', 'Load balancer + ingress', 'Database read replicas', 'CDN for static assets'] },
          ].map((p, i) => (
            <div key={i} className="bg-white border border-violet-200 rounded-xl p-4">
              <div className="text-[9px] font-bold text-violet-500 uppercase tracking-wider mb-1">{p.phase}</div>
              <div className="text-3xl mb-2">{p.icon}</div>
              <div className="text-[13px] font-bold text-text-primary mb-2">{p.title}</div>
              <ul className="space-y-1">
                {p.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-[11px] text-text-tertiary">
                    <span className="text-violet-400 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CI/CD Pipeline */}
        <div className="bg-white border border-violet-200 rounded-xl p-4">
          <p className="text-[10px] font-bold text-violet-700 uppercase tracking-wider mb-3">CI/CD Pipeline</p>
          <div className="flex items-center gap-2">
            {[
              { icon: '👨‍💻', t: 'git push' },
              { icon: '🔄', t: 'GitHub Actions' },
              { icon: '🔍', t: 'TypeScript Check' },
              { icon: '🏗️', t: 'Next.js Build' },
              { icon: '▲', t: 'Vercel Deploy' },
              { icon: '✅', t: 'Live in 60s' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className="text-center flex-1">
                  <div className="text-lg">{s.icon}</div>
                  <div className="text-[9px] font-semibold text-text-tertiary">{s.t}</div>
                </div>
                {i < 5 && <div className="text-gray-300 text-xs">→</div>}
              </div>
            ))}
          </div>
        </div>
      </Box>

      {/* Logging & Observability */}
      <Box color="sky" title="Logging & Observability">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] font-bold text-sky-700 mb-3">API Request Logging</p>
            <div className="bg-gray-900 rounded-xl p-3 font-mono text-[10px] text-green-400 leading-relaxed">
              {`// Every API route logs:
console.log('[ENDPOINT] Request', {
  userId,
  method: req.method,
  timestamp: new Date().toISOString()
});

// On success:
console.log('[ENDPOINT] Success', {
  userId,
  processingTime: Date.now() - start
});

// On error:
console.error('[ENDPOINT] Error', {
  message: err.message,
  stack: err.stack
});`}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold text-sky-700 mb-3">Health Check Endpoint</p>
            <div className="bg-gray-900 rounded-xl p-3 font-mono text-[10px] text-blue-400 leading-relaxed mb-3">
              {`// GET /api/health
{
  "status": "healthy",
  "checks": {
    "supabase_url": true,
    "supabase_anon": true,
    "supabase_service": true,
    "clerk_publishable": true,
    "clerk_secret": true,
    "groq": true
  },
  "node_env": "production",
  "timestamp": "2025-01-01T..."
}`}
            </div>
            <p className="text-[11px] font-bold text-sky-700 mb-2">Vercel Observability</p>
            <div className="space-y-1.5">
              {[
                '✅ Vercel Analytics — page views, performance',
                '✅ Vercel Logs — real-time function logs',
                '✅ Vercel Speed Insights — Core Web Vitals',
                '✅ Supabase Dashboard — DB queries + errors',
                '✅ Clerk Dashboard — auth events + users',
              ].map((item, i) => (
                <div key={i} className="text-[11px] text-text-secondary">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </Box>

      {/* Environment Variables */}
      <Box color="amber" title="Environment Configuration">
        <div className="grid grid-cols-3 gap-3">
          {[
            { service: 'Clerk Auth', env: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY\nCLERK_SECRET_KEY\nNEXT_PUBLIC_CLERK_SIGN_IN_URL\nNEXT_PUBLIC_CLERK_SIGN_UP_URL', color: 'border-orange-200 bg-orange-50' },
            { service: 'Supabase DB', env: 'NEXT_PUBLIC_SUPABASE_URL\nNEXT_PUBLIC_SUPABASE_ANON_KEY\nSUPABASE_SERVICE_ROLE_KEY', color: 'border-emerald-200 bg-emerald-50' },
            { service: 'Groq AI', env: 'GROQ_API_KEY', color: 'border-violet-200 bg-violet-50' },
          ].map((e, i) => (
            <div key={i} className={`border rounded-xl p-3 ${e.color}`}>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2">{e.service}</p>
              <div className="bg-gray-900 rounded-lg p-2 font-mono text-[9px] text-green-400 whitespace-pre-line">{e.env}</div>
            </div>
          ))}
        </div>
      </Box>
    </div>
  );
}

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('journey');

  const CONTENT: Record<string, React.ReactNode> = {
    journey: <UserJourneyTab />,
    architecture: <ArchitectureTab />,
    workflows: <WorkflowsTab />,
    contracts: <ContractsTab />,
    wireframes: <WireframesTab />,
    operations: <OperationsTab />,
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Technical Documentation 📚
        </h1>
        <p className="text-sm text-text-tertiary mt-1">
          System architecture, user flows, AI workflows, and data contracts
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex flex-col items-start px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-brand-50 border-brand-200 text-brand-700'
                : 'bg-white border-border-default text-text-tertiary hover:border-border-strong hover:text-text-primary'
            )}
          >
            <span className="text-[13px] font-semibold">{tab.label}</span>
            <span className="text-[10px] opacity-70">{tab.desc}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {CONTENT[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}