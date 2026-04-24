import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-0 noise-bg">
      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 h-16 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 2 7l10 5 10-5-10-5Z" />
              <path d="m2 17 10 5 10-5" />
              <path d="m2 12 10 5 10-5" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-text-primary tracking-tight">
            CareerCopilot
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-[13px] text-text-tertiary hover:text-text-primary transition-colors font-medium px-3 py-1.5"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="text-[13px] font-medium text-white gradient-brand px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-24 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/8 border border-brand-500/15 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-soft" />
          <span className="text-[11px] font-medium text-brand-300 tracking-wide">
            POWERED BY GROQ AI
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
          <span className="text-text-primary">Your AI co-pilot </span>
          <br />
          <span className="gradient-text-hero">to land your dream job</span>
        </h1>

        <p className="text-base text-text-tertiary max-w-lg mx-auto leading-relaxed mb-10">
          Analyze resumes, generate tailored answers, and track every
          application — all powered by AI that understands what recruiters
          want.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 text-sm font-medium text-white gradient-brand px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-[0_2px_8px_rgba(132,61,255,0.3),0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            Start for free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary bg-surface-100 border border-border-subtle px-6 py-3 rounded-xl hover:bg-surface-200 hover:border-border-default transition-all"
          >
            Sign in
          </Link>
        </div>

        <p className="text-[11px] text-text-muted mt-5">
          No credit card · Free forever tier · Setup in 2 minutes
        </p>
      </div>

      {/* Features */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              title: 'Resume Analyzer',
              desc: 'AI-powered match scoring against any job description with keyword optimization insights.',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                  <path d="M7 8h10" /><path d="M7 12h10" /><path d="M7 16h10" />
                </svg>
              ),
              color: 'text-brand-400',
              bg: 'bg-brand-500/8',
            },
            {
              title: 'Answer Generator',
              desc: 'Craft compelling, personalized answers to application questions based on your actual experience.',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                </svg>
              ),
              color: 'text-accent-sky',
              bg: 'bg-sky-500/8',
            },
            {
              title: 'Application Tracker',
              desc: 'Visual pipeline from submission to offer. Track status, notes, and match scores in one place.',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
                  <path d="m2 12 8.58 3.91a2 2 0 0 0 1.66 0L21 12" />
                  <path d="m2 17 8.58 3.91a2 2 0 0 0 1.66 0L21 17" />
                </svg>
              ),
              color: 'text-accent-emerald',
              bg: 'bg-emerald-500/8',
            },
          ].map((f, i) => (
            <div
              key={i}
              className="surface-primary rounded-2xl p-5 hover:border-border-default transition-all duration-200 group"
            >
              <div
                className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center ${f.color} mb-4`}
              >
                {f.icon}
              </div>
              <h3 className="text-[14px] font-semibold text-text-primary mb-1.5">
                {f.title}
              </h3>
              <p className="text-[12px] text-text-tertiary leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-border-subtle">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="text-[11px] text-text-muted">
            © 2025 CareerCopilot
          </span>
          <span className="text-[11px] text-text-muted">
            Built with AI, for humans
          </span>
        </div>
      </div>

      {/* Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-600/[0.03] rounded-full blur-3xl" />
      </div>
    </div>
  );
}