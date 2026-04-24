import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect('/dashboard');
  return (
    <div className="min-h-screen overflow-hidden" style={{ background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 30%, #f0f7ff 60%, #faf5ff 80%, #ffffff 100%)' }}>
      {/* Floating blobs */}
      <div className="blob blob-purple w-[600px] h-[600px] -top-[15%] left-[10%]" />
      <div className="blob blob-orange w-[400px] h-[400px] top-[20%] -right-[5%]" style={{ animationDelay: '-10s' }} />
      <div className="blob blob-blue w-[500px] h-[500px] top-[50%] left-[30%]" style={{ animationDelay: '-5s' }} />
      <div className="blob blob-pink w-[300px] h-[300px] top-[10%] right-[20%]" style={{ animationDelay: '-15s' }} />
      <div className="blob blob-green w-[350px] h-[350px] bottom-[10%] right-[10%]" style={{ animationDelay: '-20s' }} />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 h-16 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center shadow-md shadow-brand-500/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2 2 7l10 5 10-5-10-5Z" />
              <path d="m2 17 10 5 10-5" />
              <path d="m2 12 10 5 10-5" />
            </svg>
          </div>
          <span className="text-[15px] font-bold text-text-primary tracking-tight">
            CareerCopilot
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-[13px] text-text-tertiary hover:text-text-primary transition-colors font-medium px-4 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="text-[13px] font-semibold text-white gradient-brand px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-brand-500/20"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* ═══════════════════════════════════
           HERO SECTION
      ═══════════════════════════════════ */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200 mb-8">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-soft" />
          <span className="text-[12px] font-semibold text-brand-700">
            Powered by AI — Blazing Fast
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6">
          <span className="text-text-primary">Stop applying.</span>
          <br />
          <span className="gradient-text-brand">Start landing interviews.</span>
        </h1>

        <p className="text-lg text-text-tertiary max-w-xl mx-auto leading-relaxed mb-10">
          CareerCopilot uses AI to analyze your resume, generate tailored
          answers, and track every application — so you focus on what matters.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-white gradient-brand px-8 py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-brand-500/25"
          >
            🚀 Start for free
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-text-secondary bg-white border-2 border-border-default px-8 py-4 rounded-2xl hover:border-brand-300 hover:text-brand-600 transition-all shadow-sm"
          >
            Sign in →
          </Link>
        </div>

        <p className="text-[12px] text-text-muted mt-6 font-medium">
          No credit card required · Free forever · 2 min setup
        </p>
      </div>

      {/* ═══════════════════════════════════
           CORE FEATURES — 3 Cards
      ═══════════════════════════════════ */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-3">
            Everything you need to land the job
          </h2>
          <p className="text-text-tertiary">
            Three AI-powered tools that work together for your success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                  <path d="M7 8h10" /><path d="M7 12h10" /><path d="M7 16h10" />
                </svg>
              ),
              title: 'Resume Analyzer',
              desc: 'AI match scoring against any job. Know exactly what keywords to add to get past the ATS and land interviews.',
              gradient: 'from-violet-50 to-indigo-50',
              border: 'border-violet-200',
              iconBg: 'bg-violet-100',
              iconColor: 'text-violet-600',
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                </svg>
              ),
              title: 'Answer Generator',
              desc: 'Craft compelling, personalized answers using your actual experience and the specific role requirements.',
              gradient: 'from-sky-50 to-cyan-50',
              border: 'border-sky-200',
              iconBg: 'bg-sky-100',
              iconColor: 'text-sky-600',
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
                  <path d="m2 12 8.58 3.91a2 2 0 0 0 1.66 0L21 12" />
                  <path d="m2 17 8.58 3.91a2 2 0 0 0 1.66 0L21 17" />
                </svg>
              ),
              title: 'Application Tracker',
              desc: 'Visual pipeline from submission to offer. Track status, notes, and match scores all in one place.',
              gradient: 'from-emerald-50 to-teal-50',
              border: 'border-emerald-200',
              iconBg: 'bg-emerald-100',
              iconColor: 'text-emerald-600',
            },
          ].map((f, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${f.gradient} border ${f.border} rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              <div className={`w-14 h-14 rounded-2xl ${f.iconBg} ${f.iconColor} flex items-center justify-center mb-5`}>
                {f.icon}
              </div>
              <h3 className="text-[17px] font-bold text-text-primary mb-2">
                {f.title}
              </h3>
              <p className="text-[13px] text-text-tertiary leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════
           FEATURE HIGHLIGHT — Import Jobs
      ═══════════════════════════════════ */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 mb-5">
              <span className="text-[11px] font-semibold text-orange-700">NEW FEATURE</span>
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-4 leading-tight">
              Import Jobs from{' '}
              <span className="gradient-text-brand">Anywhere</span>
            </h2>
            <p className="text-[15px] text-text-tertiary leading-relaxed mb-6">
              Our AI scans and extracts job descriptions from any Job Board or
              URL. Just paste a link — we handle the rest. Works with LinkedIn,
              Indeed, Greenhouse, Lever, and hundreds more.
            </p>
            <div className="space-y-4">
              {[
                { icon: '🔗', text: 'Paste any job URL and we extract the full description' },
                { icon: '🤖', text: 'AI identifies requirements, skills, and qualifications' },
                { icon: '⚡', text: 'Instantly analyze against your resume' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <span className="text-[14px] text-text-secondary leading-relaxed">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-brand-600 hover:text-brand-700 transition-colors"
              >
                Try it now →
              </Link>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="bg-white border border-border-default rounded-2xl shadow-xl p-6">
              {/* URL Input Mockup */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-surface-50 border border-border-default rounded-xl">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted flex-shrink-0">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <span className="text-[13px] text-text-muted">https://linkedin.com/jobs/view/123...</span>
                </div>
                <div className="px-4 py-3 gradient-brand text-white text-[12px] font-semibold rounded-xl">
                  Import
                </div>
              </div>

              {/* Extracted Job Card Mockup */}
              <div className="p-4 bg-gradient-to-br from-violet-50 to-white border border-violet-100 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                    <span className="text-lg">🏢</span>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-text-primary">Senior Software Engineer</div>
                    <div className="text-[12px] text-text-tertiary">Google · Mountain View, CA</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {['React', 'TypeScript', 'Node.js', 'System Design'].map(s => (
                    <span key={s} className="px-2.5 py-1 bg-white border border-violet-200 rounded-full text-[10px] font-semibold text-violet-700">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 bg-emerald-400 rounded-full" style={{ width: '78%' }} />
                  <span className="text-[11px] font-bold text-emerald-600">78% match</span>
                </div>
              </div>
            </div>

            {/* Decorative dots */}
            <div className="absolute -z-10 -top-4 -right-4 w-32 h-32 dot-pattern opacity-50 rounded-2xl" />
            <div className="absolute -z-10 -bottom-4 -left-4 w-24 h-24 dot-pattern opacity-50 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════
           FEATURE HIGHLIGHT — AI Resumes & Cover Letters
      ═══════════════════════════════════ */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: Visual */}
          <div className="relative order-2 md:order-1">
            <div className="bg-white border border-border-default rounded-2xl shadow-xl p-6">
              {/* Document Tabs Mockup */}
              <div className="flex gap-2 mb-5">
                <div className="px-4 py-2 bg-brand-50 border border-brand-200 rounded-lg text-[12px] font-semibold text-brand-700">
                  📄 Resume
                </div>
                <div className="px-4 py-2 bg-surface-100 border border-border-default rounded-lg text-[12px] font-medium text-text-tertiary">
                  ✉️ Cover Letter
                </div>
              </div>

              {/* Resume Preview Mockup */}
              <div className="bg-white border border-border-default rounded-xl p-5 shadow-inner">
                <div className="space-y-3">
                  <div className="h-5 bg-text-primary rounded w-2/5" />
                  <div className="flex gap-3">
                    <div className="h-3 bg-surface-200 rounded w-1/4" />
                    <div className="h-3 bg-surface-200 rounded w-1/5" />
                    <div className="h-3 bg-surface-200 rounded w-1/6" />
                  </div>
                  <div className="h-px bg-border-default my-2" />
                  <div className="h-3 bg-brand-100 rounded w-1/4" />
                  <div className="space-y-1.5">
                    <div className="h-2.5 bg-surface-100 rounded w-full" />
                    <div className="h-2.5 bg-surface-100 rounded w-11/12" />
                    <div className="h-2.5 bg-surface-100 rounded w-4/5" />
                  </div>
                  <div className="h-3 bg-brand-100 rounded w-1/3 mt-3" />
                  <div className="space-y-1.5">
                    <div className="h-2.5 bg-surface-100 rounded w-full" />
                    <div className="h-2.5 bg-surface-100 rounded w-10/12" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {['Python', 'React', 'AWS', 'SQL'].map(s => (
                      <span key={s} className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded text-[9px] font-semibold text-emerald-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ATS Score */}
              <div className="mt-4 flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✅</span>
                  <span className="text-[12px] font-semibold text-emerald-700">ATS-Friendly Score</span>
                </div>
                <span className="text-[14px] font-bold text-emerald-700">92/100</span>
              </div>
            </div>

            <div className="absolute -z-10 -top-4 -left-4 w-32 h-32 dot-pattern opacity-50 rounded-2xl" />
          </div>

          {/* Right: Text */}
          <div className="order-1 md:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 mb-5">
              <span className="text-[11px] font-semibold text-emerald-700">AI POWERED</span>
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-4 leading-tight">
              AI Customized Resumes{' '}
              <span className="gradient-text-brand">& Cover Letters</span>
            </h2>
            <p className="text-[15px] text-text-tertiary leading-relaxed mb-6">
              Generate tailored resumes and cover letters for each application
              with AI that understands job requirements. Our builder creates
              ATS-friendly documents that pass automated screening.
            </p>
            <div className="space-y-4">
              {[
                { icon: '📝', text: 'Build ATS-friendly resumes with our intuitive builder' },
                { icon: '🎨', text: 'Choose from professional templates and customize' },
                { icon: '✨', text: 'AI rewrites your experience to match each job' },
                { icon: '✉️', text: 'Generate matching cover letters in seconds' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <span className="text-[14px] text-text-secondary leading-relaxed">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-white gradient-brand px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-brand-500/20"
              >
                Build your resume →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════
           FEATURE HIGHLIGHT — Autofill
      ═══════════════════════════════════ */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 mb-5">
              <span className="text-[11px] font-semibold text-sky-700">SAVE TIME</span>
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-4 leading-tight">
              One-Click{' '}
              <span className="gradient-text-brand">Application Autofill</span>
            </h2>
            <p className="text-[15px] text-text-tertiary leading-relaxed mb-6">
              Store your profile once and autofill application forms instantly.
              No more retyping your name, email, work history, and education
              across hundreds of applications.
            </p>
            <div className="space-y-4">
              {[
                { icon: '💾', text: 'Save your profile, work history, and education once' },
                { icon: '📋', text: 'Copy any field instantly to paste into forms' },
                { icon: '🔄', text: 'Keep your profile updated as your career grows' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <span className="text-[14px] text-text-secondary leading-relaxed">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="bg-white border border-border-default rounded-2xl shadow-xl p-6">
              {/* Autofill Fields Mockup */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  </svg>
                </div>
                <span className="text-[14px] font-bold text-text-primary">Quick Autofill</span>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Full Name', value: 'Jane Doe', copied: true },
                  { label: 'Email', value: 'jane@example.com', copied: false },
                  { label: 'Phone', value: '+1 (555) 123-4567', copied: false },
                  { label: 'Location', value: 'San Francisco, CA', copied: false },
                  { label: 'LinkedIn', value: 'linkedin.com/in/janedoe', copied: false },
                ].map((field, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      field.copied
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-surface-50 border-border-default hover:border-brand-200 hover:bg-brand-50'
                    }`}
                  >
                    <div>
                      <div className="text-[9px] font-semibold text-text-muted uppercase tracking-wider">
                        {field.label}
                      </div>
                      <div className="text-[13px] text-text-primary font-medium">
                        {field.value}
                      </div>
                    </div>
                    <span className={`text-[11px] font-semibold ${
                      field.copied ? 'text-emerald-600' : 'text-text-muted'
                    }`}>
                      {field.copied ? '✓ Copied' : 'Copy'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -z-10 -bottom-4 -right-4 w-28 h-28 dot-pattern opacity-50 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════
           HOW IT WORKS
      ═══════════════════════════════════ */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-3">
            How it works
          </h2>
          <p className="text-text-tertiary">
            Get started in under 2 minutes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Create Profile', desc: 'Add your info, skills, and work history once', color: 'bg-violet-100 text-violet-700 border-violet-200' },
            { step: '2', title: 'Find a Job', desc: 'Paste any job URL or description', color: 'bg-sky-100 text-sky-700 border-sky-200' },
            { step: '3', title: 'AI Analyzes', desc: 'Get match score and tailored suggestions', color: 'bg-amber-100 text-amber-700 border-amber-200' },
            { step: '4', title: 'Apply & Track', desc: 'Submit with confidence and track progress', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className={`w-12 h-12 rounded-2xl ${s.color} border flex items-center justify-center mx-auto mb-4 text-[18px] font-black`}>
                {s.step}
              </div>
              <h3 className="text-[15px] font-bold text-text-primary mb-1">
                {s.title}
              </h3>
              <p className="text-[12px] text-text-tertiary leading-relaxed">
                {s.desc}
              </p>
              {i < 3 && (
                <div className="hidden md:block mt-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-border-strong mx-auto rotate-90 md:rotate-0">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════
           SOCIAL PROOF / STATS
      ═══════════════════════════════════ */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-brand-50 via-white to-sky-50 border border-brand-100 rounded-2xl p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: '3x', label: 'Higher callback rate with tailored resumes' },
              { value: '<10s', label: 'Average AI analysis time' },
              { value: '100%', label: 'Free to get started' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl font-black text-brand-600 mb-1">
                  {s.value}
                </div>
                <div className="text-[12px] text-text-muted leading-tight">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════
           CTA SECTION
      ═══════════════════════════════════ */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="gradient-brand rounded-3xl p-12 text-center text-white shadow-2xl shadow-brand-500/20 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-3">
              Ready to land your dream job?
            </h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              Join thousands of job seekers who use CareerCopilot to stand out
              from the competition.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-brand-700 bg-white px-8 py-4 rounded-2xl hover:bg-brand-50 transition-all shadow-lg"
            >
              Get started for free 🚀
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════
           FOOTER
      ═══════════════════════════════════ */}
      <div className="relative z-10 border-t border-border-subtle">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 gradient-brand rounded-lg flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" />
              </svg>
            </div>
            <span className="text-[12px] text-text-muted font-medium">
              © 2026 CareerCopilot
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[12px] text-text-muted hover:text-text-secondary cursor-pointer transition-colors">Privacy</span>
            <span className="text-[12px] text-text-muted hover:text-text-secondary cursor-pointer transition-colors">Terms</span>
            <span className="text-[12px] text-text-muted">Built with next.js✨</span>
          </div>
        </div>
      </div>
    </div>
  );
}