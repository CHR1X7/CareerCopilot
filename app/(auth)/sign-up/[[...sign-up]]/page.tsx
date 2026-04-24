import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SignUp } from '@clerk/nextjs';

export default async function SignUpPage() {
  const { userId } = await auth();
  if (userId) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob blob-purple w-[500px] h-[500px] -top-[10%] left-[20%]" />
        <div className="blob blob-orange w-[400px] h-[400px] bottom-[10%] right-[10%]" style={{ animationDelay: '-8s' }} />
      </div>

      <div className="absolute top-8 left-8 flex items-center gap-2">
        <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center shadow-md shadow-brand-500/20">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M12 2 2 7l10 5 10-5-10-5Z" />
            <path d="m2 17 10 5 10-5" />
            <path d="m2 12 10 5 10-5" />
          </svg>
        </div>
        <span className="text-[15px] font-bold text-text-primary">CareerCopilot</span>
      </div>

      <div className="relative z-10">
        <SignUp
          forceRedirectUrl="/onboarding"
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-white border border-border-default shadow-xl rounded-2xl',
              headerTitle: 'text-text-primary',
              headerSubtitle: 'text-text-tertiary',
              formButtonPrimary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-sm',
              formFieldInput: 'border-border-default text-text-primary bg-white rounded-xl focus:border-brand-400 focus:ring-brand-100',
              formFieldLabel: 'text-text-secondary',
              footerActionLink: 'text-brand-600 hover:text-brand-700',
              socialButtonsBlockButton: 'bg-white border-border-default text-text-primary hover:bg-surface-50 rounded-xl',
              dividerLine: 'bg-border-default',
              dividerText: 'text-text-muted',
            },
          }}
        />
      </div>
    </div>
  );
}