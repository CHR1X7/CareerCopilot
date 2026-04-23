import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="absolute top-8 left-8 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">CC</span>
        </div>
        <span className="text-white font-bold text-xl">CareerCopilot</span>
      </div>

      <div className="relative z-10">
        <SignUp
          forceRedirectUrl="/onboarding"
          fallbackRedirectUrl="/onboarding"
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-gray-900 border border-gray-800 shadow-2xl',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-400',
              formButtonPrimary:
                'bg-gradient-to-r from-violet-600 to-cyan-600 hover:opacity-90',
              formFieldInput: 'bg-gray-800 border-gray-700 text-white',
              formFieldLabel: 'text-gray-300',
              footerActionLink: 'text-violet-400 hover:text-violet-300',
              socialButtonsBlockButton:
                'bg-gray-800 border-gray-700 text-white hover:bg-gray-700',
              dividerLine: 'bg-gray-700',
              dividerText: 'text-gray-500',
            },
          }}
        />
      </div>
    </div>
  );
}