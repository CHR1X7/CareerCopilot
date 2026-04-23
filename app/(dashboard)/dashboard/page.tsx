'use client';

import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useApplications } from '@/hooks/useApplications';
import { useProfile } from '@/hooks/useProfile';
import StatsOverview from '@/components/dashboard/StatsOverview';
import ApplicationPipeline from '@/components/dashboard/ApplicationPipeline';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { applications, loading: appsLoading } = useApplications();
  const { profile, loading: profileLoading } = useProfile();

  const loading = !isLoaded || profileLoading;
  const firstName =
    user?.firstName ||
    profile?.full_name?.split(' ')[0] ||
    'there';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
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
          <p className="text-gray-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">
            Good morning,{' '}
            <span className="gradient-text">{firstName}</span> 👋
          </h1>
          <p className="text-gray-400 mt-1">
            Here's your job search overview
          </p>
        </motion.div>
      </div>

      {/* Stats */}
      <StatsOverview applications={applications} loading={appsLoading} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        {[
          {
            icon: '📊',
            title: 'Resume Analyzer',
            desc: 'Check your resume match score',
            href: '/resume-analyzer',
            gradient: 'from-violet-600/20 to-purple-600/20',
            border: 'border-violet-500/30',
          },
          {
            icon: '✍️',
            title: 'Answer Generator',
            desc: 'Generate tailored answers',
            href: '/answer-generator',
            gradient: 'from-cyan-600/20 to-blue-600/20',
            border: 'border-cyan-500/30',
          },
          {
            icon: '📋',
            title: 'Track Application',
            desc: 'Add a new application',
            href: '/applications',
            gradient: 'from-emerald-600/20 to-green-600/20',
            border: 'border-emerald-500/30',
          },
        ].map((action, i) => (
          <Link key={i} href={action.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`p-5 rounded-2xl bg-gradient-to-br ${action.gradient} border ${action.border} cursor-pointer transition-all`}
            >
              <div className="text-3xl mb-3">{action.icon}</div>
              <div className="font-semibold text-white">{action.title}</div>
              <div className="text-sm text-gray-400 mt-1">{action.desc}</div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Pipeline */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            Application Pipeline
          </h2>
          <Link href="/applications">
            <Button variant="ghost" size="sm">
              View all →
            </Button>
          </Link>
        </div>
        <ApplicationPipeline
          applications={applications.slice(0, 5)}
          loading={appsLoading}
        />
      </div>

      {/* AI Tips */}
      <Card className="bg-gradient-to-br from-violet-900/20 to-cyan-900/20 border-violet-500/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
            🤖
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white mb-1">AI Tip of the Day</h3>
            <p className="text-gray-400 text-sm">
              Tailor your resume for each application. Our Resume Analyzer
              shows you exactly what keywords to add to increase your match
              score by up to 40%. Jobs with 80%+ match scores have 3x higher
              callback rates.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}