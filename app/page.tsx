import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-0 warm-bg overflow-hidden">
      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 h-16 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center shadow-md shadow-brand-500/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" />
            </svg>
          </div>
          <span className="text-[15px] font-bold text-text-primary tracking-tight">CareerCopilot</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-[13px] text-text-tertiary hover:text-text-primary transition-colors font-medium px-4 py-2">Sign in</Link>
          <Link href="/sign-up" className="text-[13px] font-semibold text-white gradient-brand px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-brand-500/20">Get started free</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200 mb-8">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-soft" />
          <span className="text-[12px] font-semibold text-brand-700">Powered by AI — Blazing Fast</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6">
          <span className="text-text-primary">Stop applying.<br /></span>
          <span className="gradient-text-brand">Start landing interviews.</span>
        </h1>

        <p className="text-lg text-text-tertiary max-w-xl mx-auto leading-relaxed mb-10">
          CareerCopilot uses AI to analyze your resume, generate tailored answers, and track every application — so you focus on what matters.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/sign-up" className="inline-flex items-center gap-2 text-[15px] font-semibold text-white gradient-brand px-8 py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-brand-500/25">
            🚀 Start for free
          </Link>
          <Link href="/sign-in" className="inline-flex items-center gap-2 text-[15px] font-semibold text-text-secondary bg-surface-0 border-2 border-border-default px-8 py-4 rounded-2xl hover:border-brand-300 hover:text-brand-600 transition-all">
            Sign in →
          </Link>
        </div>

        <p className="text-[12px] text-text-muted mt-6 font-medium">No credit card required · Free forever · 2 min setup</p>
      </div>

      {/* Features */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-3">Everything you need to land the job</h2>
          <p className="text-text-tertiary">Three AI-powered tools that work together for your success</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            { emoji: '📊', title: 'Resume Analyzer', desc: 'AI match scoring against any job. Know exactly what keywords to add to get past the ATS.', bg: 'bg-gradient-to-br from-brand-50 to-white', border: 'border-brand-100' },
            { emoji: '✍️', title: 'Answer Generator', desc: 'Craft compelling, personalized answers using your actual experience and the specific role.', bg: 'bg-gradient-to-br from-sky-50 to-white', border: 'border-sky-100' },
            { emoji: '📋', title: 'Application Tracker', desc: 'Visual pipeline from submission to offer. Never lose track of where you stand.', bg: 'bg-gradient-to-br from-emerald-50 to-white', border: 'border-emerald-100' },
          ].map((f, i) => (
            <div key={i} className={`${f.bg} border ${f.border} rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
              <div className="text-4xl mb-4">{f.emoji}</div>
              <h3 className="text-[16px] font-bold text-text-primary mb-2">{f.title}</h3>
              <p className="text-[13px] text-text-tertiary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social Proof */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-brand-50 via-white to-sky-50 border border-brand-100 rounded-2xl p-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: '3x', label: 'Higher callback rate with tailored resumes' },
              { value: '<10s', label: 'Average AI analysis time' },
              { value: '100%', label: 'Free to get started' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl font-black text-brand-600 mb-1">{s.value}</div>
                <div className="text-[12px] text-text-muted leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-border-subtle">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 gradient-brand rounded-lg flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" />
              </svg>
            </div>
            <span className="text-[12px] text-text-muted font-medium">© 2025 CareerCopilot</span>
          </div>
          <span className="text-[12px] text-text-muted">Built with AI, for humans ✨</span>
        </div>
      </div>

      {/* Blobs */}
      <div className="blob blob-purple w-[600px] h-[600px] -top-[15%] left-[10%]" />
      <div className="blob blob-orange w-[400px] h-[400px] top-[30%] -right-[5%]" style={{ animationDelay: '-10s' }} />
      <div className="blob blob-blue w-[500px] h-[500px] bottom-[5%] left-[30%]" style={{ animationDelay: '-5s' }} />
      <div className="blob blob-pink w-[300px] h-[300px] top-[10%] right-[20%]" style={{ animationDelay: '-15s' }} />
    </div>
  );
}