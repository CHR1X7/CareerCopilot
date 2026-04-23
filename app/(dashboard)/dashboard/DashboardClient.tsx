'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FileText, MessageSquare, Briefcase, TrendingUp,
  ArrowRight, Star, Zap, Target, Clock, CheckCircle
} from 'lucide-react'
import { Application, STATUS_CONFIG } from '@/types'
import { formatDate } from '@/lib/utils'

interface Props {
  user: { name: string; email: string }
  profile: any
  recentApplications: Application[]
  stats: { total: number; interviews: number; offers: number; responseRate: number }
}

const quickActions = [
  {
    title: 'Analyze Resume',
    desc: 'Get an AI match score for any job',
    icon: FileText,
    href: '/resume-analyzer',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
  },
  {
    title: 'Generate Answer',
    desc: 'AI-crafted interview answers',
    icon: MessageSquare,
    href: '/answer-generator',
    color: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50',
  },
  {
    title: 'Track Application',
    desc: 'Add & manage your applications',
    icon: Briefcase,
    href: '/applications',
    color: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50',
  },
]

export default function DashboardClient({ user, profile, recentApplications, stats }: Props) {
  const statCards = [
    { label: 'Total Applications', value: stats.total, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Interviews', value: stats.interviews, icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Offers', value: stats.offers, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Response Rate', value: `${stats.responseRate}%`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user.name}! 👋
            </h1>
            <p className="text-slate-500 mt-1">
              Your AI co-pilot is ready to help you land your dream job.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">AI Ready</span>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 mb-4">🚀 Quick Actions</h2>
          <div className="grid gap-4">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Link href={action.href}
                  className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{action.title}</div>
                    <div className="text-sm text-slate-500">{action.desc}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* AI Feature Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-purple-900 text-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold">Pro Tip from CareerCopilot</span>
            </div>
            <p className="text-sm text-white/70">
              Tailoring your resume to each job description increases your interview chances by 3x. 
              Start by using the Resume Analyzer on your target role.
            </p>
          </motion.div>
        </div>

        {/* Recent Applications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
            <Link href="/applications" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all →
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No applications yet</p>
              <Link href="/applications"
                className="mt-3 inline-block text-blue-600 text-sm font-medium hover:text-blue-800">
                Track your first application →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app, i) => {
                const config = STATUS_CONFIG[app.status]
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-slate-900 text-sm">{app.job_title}</div>
                        <div className="text-xs text-slate-500">{app.company_name}</div>
                      </div>
                      {app.match_score && (
                        <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                          app.match_score >= 80 ? 'bg-green-100 text-green-700' :
                          app.match_score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {app.match_score}%
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium status-${app.status}`}>
                        {config.icon} {config.label}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {formatDate(app.created_at)}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}