import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl flex items-center justify-center font-bold text-white text-sm">
            CC
          </div>
          <span className="text-xl font-bold text-white">CareerCopilot</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center px-4 pt-24 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-900/30 border border-violet-500/30 rounded-full text-violet-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-violet-400 rounded-full" />
            Powered by Groq AI — Blazing Fast Responses
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
            Your AI Co-Pilot
            <br />
            <span className="gradient-text">to Land Your Dream Job</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            CareerCopilot uses AI to analyze your resume, generate tailored
            answers, and track every application — so you can focus on what
            matters: the interview.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-2xl text-lg font-semibold hover:opacity-90 transition-all shadow-lg shadow-violet-500/20"
            >
              🚀 Start For Free
            </Link>
            <Link
              href="/sign-in"
              className="px-8 py-4 bg-gray-900 border border-gray-700 text-white rounded-2xl text-lg font-semibold hover:border-gray-600 transition-all"
            >
              Sign In →
            </Link>
          </div>

          <p className="text-gray-600 text-sm mt-4">
            No credit card required • Free forever tier
          </p>
        </div>

        {/* Features */}
        <div className="relative z-10 max-w-6xl mx-auto px-8 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '📊',
                title: 'Resume Analyzer',
                desc: 'Get a precise match score and actionable insights to tailor your resume for each job. Know exactly what keywords to add.',
              },
              {
                icon: '✍️',
                title: 'Answer Generator',
                desc: 'Generate compelling, personalized answers to application questions using your actual profile and experience.',
              },
              {
                icon: '📋',
                title: 'Application Tracker',
                desc: 'Visual pipeline to track every application from submission to offer. Never lose track of where you stand.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass-card hover:border-gray-700 transition-all"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 max-w-4xl mx-auto px-8 pb-24">
          <div className="glass-card">
            <div className="grid grid-cols-3 gap-8 text-center">
              {[
                { value: '3x', label: 'Higher callback rate with tailored resumes' },
                { value: '10s', label: 'Average AI analysis time' },
                { value: '100%', label: 'Free to get started' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl font-black gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}