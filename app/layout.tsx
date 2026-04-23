import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CareerCopilot - AI Job Application Assistant',
  description: 'Your AI-powered co-pilot to land your dream job',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      afterSignOutUrl="/sign-in"
    >
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
          {children}
          <Toaster
            position="top-right"
            theme="dark"
            richColors
          />
        </body>
      </html>
    </ClerkProvider>
  );
}