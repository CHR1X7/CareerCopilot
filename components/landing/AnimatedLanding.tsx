'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// ═══ ANIMATION VARIANTS ═══
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 100, damping: 12 },
  },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

// ═══ COMPONENTS ═══
function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-brand-400/20"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0, 0.6, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function TypeWriter({ texts }: { texts: string[] }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const text = texts[currentTextIndex];
    let timeout: NodeJS.Timeout;
    if (!deleting) {
      if (displayed.length < text.length) {
        timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setDeleting(true), 2000);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
      } else {
        setDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, currentTextIndex, texts]);

  return (
    <span className="gradient-text-brand">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[3px] h-[0.85em] bg-brand-500 ml-1 align-middle"
      />
    </span>
  );
}

function AnimatedCounter({ target, suffix = '' }: { target: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    const num = parseInt(target.replace(/[^0-9]/g, ''));
    if (isNaN(num)) { setDisplay(target); return; }
    let current = 0;
    const steps = 40;
    const increment = num / steps;
    const stepTime = 1500 / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) { current = num; clearInterval(timer); }
      if (target.includes('x')) setDisplay(Math.round(current) + 'x');
      else if (target.includes('s')) setDisplay('<' + Math.round(current) + 's');
      else if (target.includes('%')) setDisplay(Math.round(current) + '%');
      else setDisplay(Math.round(current).toString());
    }, stepTime);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{display}{suffix}</span>;
}

// ═══ FEATURE SECTION COMPONENT ═══
function FeatureSection({
  badge,
  badgeColor,
  title,
  titleHighlight,
  description,
  bullets,
  visual,
  reversed = false,
  ctaText,
  ctaHref,
}: {
  badge: string;
  badgeColor: string;
  title: string;
  titleHighlight: string;
  description: string;
  bullets: { icon: string; text: string }[];
  visual: React.ReactNode;
  reversed?: boolean;
  ctaText?: string;
  ctaHref?: string;
}) {
  return (
    <AnimatedSection className="relative z-10 max-w-5xl mx-auto px-6 py-20">
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${reversed ? 'direction-rtl' : ''}`}>
        {/* Text side */}
        <motion.div
          variants={reversed ? fadeInRight : fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={reversed ? 'md:order-2' : ''}
          style={{ direction: 'ltr' }}
        >
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${badgeColor} mb-5`}>
            <span className="text-[11px] font-semibold">{badge}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 leading-tight">
            {title}{' '}
            <span className="gradient-text-brand">{titleHighlight}</span>
          </h2>
          <p className="text-[15px] text-text-tertiary leading-relaxed mb-8">
            {description}
          </p>
          <div className="space-y-4">
            {bullets.map((b, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.12 }}
              >
                <div className="w-8 h-8 rounded-lg bg-surface-100 border border-border-subtle flex items-center justify-center flex-shrink-0">
                  <span className="text-base">{b.icon}</span>
                </div>
                <span className="text-[14px] text-text-secondary leading-relaxed pt-1">
                  {b.text}
                </span>
              </motion.div>
            ))}
          </div>
          {ctaText && ctaHref && (
            <motion.div className="mt-8" whileHover={{ x: 4 }}>
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 text-[14px] font-semibold text-brand-600 hover:text-brand-700 transition-colors"
              >
                {ctaText}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Visual side */}
        <motion.div
          variants={reversed ? fadeInLeft : fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={reversed ? 'md:order-1' : ''}
          style={{ direction: 'ltr' }}
        >
          {visual}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

// ═══ VISUAL MOCKUPS ═══
function ImportJobsVisual() {
  return (
    <motion.div className="relative" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
      <div className="bg-white border border-border-default rounded-2xl shadow-2xl shadow-violet-500/5 p-6 relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-50 to-transparent rounded-bl-3xl" />

        <div className="flex items-center gap-2 mb-5 relative">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-surface-50 border border-border-default rounded-xl">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted flex-shrink-0">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <motion.span
              className="text-[13px] text-text-muted"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              https://linkedin.com/jobs/view/...
            </motion.span>
          </div>
          <motion.div
            className="px-4 py-3 gradient-brand text-white text-[12px] font-semibold rounded-xl cursor-pointer shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Import
          </motion.div>
        </div>

        <motion.div
          className="p-5 bg-gradient-to-br from-violet-50/80 to-indigo-50/50 border border-violet-100 rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-white border border-violet-100 flex items-center justify-center shadow-sm">
              <span className="text-xl">🏢</span>
            </div>
            <div>
              <div className="text-[15px] font-bold text-text-primary">Senior Software Engineer</div>
              <div className="text-[12px] text-text-tertiary">Google · Mountain View, CA · Full-time</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {['React', 'TypeScript', 'Node.js', 'System Design', 'AWS'].map((s, i) => (
              <motion.span
                key={s}
                className="px-2.5 py-1 bg-white border border-violet-200 rounded-full text-[10px] font-semibold text-violet-700 shadow-sm"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + i * 0.08 }}
              >
                {s}
              </motion.span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2.5 bg-white rounded-full overflow-hidden border border-emerald-100">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '78%' }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[12px] font-bold text-emerald-600">78%</span>
          </div>
        </motion.div>
      </div>
      <div className="absolute -z-10 -top-3 -right-3 w-28 h-28 bg-gradient-to-br from-violet-100 to-indigo-50 rounded-2xl" />
      <div className="absolute -z-10 -bottom-3 -left-3 w-20 h-20 bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl" />
    </motion.div>
  );
}

function ResumeBuilderVisual() {
  return (
    <motion.div className="relative" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
      <div className="bg-white border border-border-default rounded-2xl shadow-2xl shadow-amber-500/5 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-50 to-transparent rounded-bl-3xl" />

        {/* Template tabs */}
        <div className="flex gap-2 mb-5 relative">
          {['Classic', 'Modern', 'Minimal'].map((t, i) => (
            <motion.div
              key={t}
              className={`px-4 py-2 rounded-lg text-[12px] font-semibold border ${
                i === 1
                  ? 'bg-brand-50 border-brand-200 text-brand-700'
                  : 'bg-surface-50 border-border-default text-text-muted'
              }`}
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              {t}
            </motion.div>
          ))}
        </div>

        {/* Resume preview */}
        <div className="bg-white border border-border-default rounded-xl p-5 shadow-inner">
          <motion.div className="space-y-3" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
            <div className="h-5 bg-gray-800 rounded w-2/5" />
            <div className="flex gap-3">
              {[1/4, 1/5, 1/6].map((w, i) => (
                <motion.div key={i} className="h-3 bg-surface-200 rounded" style={{ width: `${w * 100}%` }}
                  initial={{ width: 0 }} whileInView={{ width: `${w * 100}%` }} viewport={{ once: true }} transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                />
              ))}
            </div>
            <div className="h-px bg-border-default my-1" />
            <motion.div className="h-3 bg-brand-100 rounded w-1/3" initial={{ width: 0 }} whileInView={{ width: '33%' }} viewport={{ once: true }} transition={{ delay: 0.9, duration: 0.4 }} />
            {[100, 92, 80].map((w, i) => (
              <motion.div key={i} className="h-2.5 bg-surface-100 rounded" style={{ width: `${w}%` }}
                initial={{ width: 0 }} whileInView={{ width: `${w}%` }} viewport={{ once: true }} transition={{ delay: 1 + i * 0.08, duration: 0.4 }}
              />
            ))}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {['Python', 'React', 'AWS', 'SQL'].map((s, i) => (
                <motion.span key={s} className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded text-[9px] font-semibold text-emerald-700"
                  initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.2 + i * 0.08 }}
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ATS Score */}
        <motion.div
          className="mt-4 flex items-center justify-between p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span className="text-[12px] font-semibold text-emerald-700">ATS-Friendly Score</span>
          </div>
          <span className="text-[15px] font-black text-emerald-700">92/100</span>
        </motion.div>
      </div>
      <div className="absolute -z-10 -top-3 -left-3 w-28 h-28 bg-gradient-to-br from-amber-100 to-orange-50 rounded-2xl" />
      <div className="absolute -z-10 -bottom-3 -right-3 w-20 h-20 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl" />
    </motion.div>
  );
}

function CoverLetterVisual() {
  return (
    <motion.div className="relative" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
      <div className="bg-white border border-border-default rounded-2xl shadow-2xl shadow-pink-500/5 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-pink-50 to-transparent rounded-bl-3xl" />

        {/* Tabs */}
        <div className="flex gap-2 mb-5 relative">
          <div className="px-4 py-2 bg-surface-50 border border-border-default rounded-lg text-[12px] font-medium text-text-muted">📄 Resume</div>
          <div className="px-4 py-2 bg-brand-50 border border-brand-200 rounded-lg text-[12px] font-semibold text-brand-700">✉️ Cover Letter</div>
        </div>

        {/* Letter content */}
        <div className="bg-white border border-border-default rounded-xl p-5 shadow-inner">
          <motion.div className="space-y-2.5" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <div className="text-[11px] text-text-muted">Dear Hiring Manager,</div>
            {[100, 95, 88, 70].map((w, i) => (
              <motion.div key={i} className="h-2 bg-surface-100 rounded" style={{ width: `${w}%` }}
                initial={{ width: 0 }} whileInView={{ width: `${w}%` }} viewport={{ once: true }} transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
              />
            ))}
            <div className="h-4" />
            {[96, 100, 82].map((w, i) => (
              <motion.div key={i} className="h-2 bg-surface-100 rounded" style={{ width: `${w}%` }}
                initial={{ width: 0 }} whileInView={{ width: `${w}%` }} viewport={{ once: true }} transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
              />
            ))}
            <div className="h-4" />
            <motion.div className="h-2 bg-brand-100 rounded w-1/3" initial={{ width: 0 }} whileInView={{ width: '33%' }} viewport={{ once: true }} transition={{ delay: 1.4 }} />
            <div className="text-[11px] text-text-muted mt-2">Best regards, Jane Doe</div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <motion.div className="flex-1 px-3 py-2.5 bg-brand-50 border border-brand-200 rounded-xl text-[11px] font-semibold text-brand-700 text-center"
            whileHover={{ scale: 1.02 }}>📋 Copy</motion.div>
          <motion.div className="flex-1 px-3 py-2.5 bg-surface-50 border border-border-default rounded-xl text-[11px] font-semibold text-text-secondary text-center"
            whileHover={{ scale: 1.02 }}>📥 Download</motion.div>
        </div>
      </div>
      <div className="absolute -z-10 -top-3 -right-3 w-28 h-28 bg-gradient-to-br from-pink-100 to-rose-50 rounded-2xl" />
    </motion.div>
  );
}

function AutofillVisual() {
  const fields = [
    { label: 'Full Name', value: 'Jane Doe', copied: true },
    { label: 'Email', value: 'jane@example.com', copied: false },
    { label: 'Phone', value: '+1 (555) 123-4567', copied: false },
    { label: 'Location', value: 'San Francisco, CA', copied: false },
    { label: 'LinkedIn', value: 'linkedin.com/in/janedoe', copied: false },
  ];
  return (
    <motion.div className="relative" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
      <div className="bg-white border border-border-default rounded-2xl shadow-2xl shadow-sky-500/5 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-sky-50 to-transparent rounded-bl-3xl" />

        <div className="flex items-center gap-2 mb-5 relative">
          <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            </svg>
          </div>
          <span className="text-[14px] font-bold text-text-primary">Quick Autofill</span>
        </div>

        <div className="space-y-2">
          {fields.map((field, i) => (
            <motion.div
              key={i}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                field.copied
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-surface-50 border-border-default'
              }`}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              <div>
                <div className="text-[9px] font-semibold text-text-muted uppercase tracking-wider">{field.label}</div>
                <div className="text-[13px] text-text-primary font-medium">{field.value}</div>
              </div>
              <span className={`text-[11px] font-semibold ${field.copied ? 'text-emerald-600' : 'text-text-muted'}`}>
                {field.copied ? '✓ Copied' : 'Copy'}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute -z-10 -bottom-3 -left-3 w-24 h-24 bg-gradient-to-br from-sky-100 to-cyan-50 rounded-2xl" />
    </motion.div>
  );
}

function JobScoutVisual() {
  const jobs = [
    { title: 'ML Engineer', company: 'OpenAI', score: 92, loc: 'San Francisco', salary: '$180K-$250K' },
    { title: 'Full Stack Dev', company: 'Stripe', score: 85, loc: 'Remote', salary: '$150K-$200K' },
    { title: 'Backend Engineer', company: 'Airbnb', score: 78, loc: 'New York', salary: '$160K-$220K' },
  ];
  return (
    <motion.div className="relative" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
      <div className="bg-white border border-border-default rounded-2xl shadow-2xl shadow-emerald-500/5 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-3xl" />

        <div className="flex items-center justify-between mb-5 relative">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-base">🔍</span>
            </div>
            <span className="text-[14px] font-bold text-text-primary">Jobs For You</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">3 matches</span>
        </div>

        <div className="space-y-2.5">
          {jobs.map((job, i) => (
            <motion.div
              key={i}
              className="p-3.5 bg-surface-50 border border-border-default rounded-xl hover:border-brand-200 transition-all"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.12 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <div className="text-[13px] font-bold text-text-primary">{job.title}</div>
                  <div className="text-[11px] text-text-tertiary">{job.company} · {job.loc}</div>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  job.score >= 90 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  job.score >= 80 ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                  'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>{job.score}%</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold">{job.salary}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute -z-10 -top-3 -left-3 w-28 h-28 bg-gradient-to-br from-emerald-100 to-teal-50 rounded-2xl" />
    </motion.div>
  );
}

// ═══ MAIN COMPONENT ═══
export default function AnimatedLanding() {
  const { scrollYProgress } = useScroll();
  const navBg = useTransform(scrollYProgress, [0, 0.05], ['rgba(248,250,255,0)', 'rgba(248,250,255,0.95)']);
  const navBorder = useTransform(scrollYProgress, [0, 0.05], ['rgba(0,0,0,0)', 'rgba(0,0,0,0.06)']);

  return (
    <div className="min-h-screen overflow-hidden relative" style={{ background: 'linear-gradient(180deg, #f8faff 0%, #ffffff 25%, #f0f7ff 50%, #faf5ff 75%, #ffffff 100%)' }}>
      <Particles />

      {/* Blobs */}
      <motion.div className="blob blob-purple w-[600px] h-[600px] -top-[15%] left-[10%]" animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="blob blob-orange w-[400px] h-[400px] top-[20%] -right-[5%]" animate={{ x: [0, -20, 0], y: [0, 30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }} />
      <motion.div className="blob blob-blue w-[500px] h-[500px] top-[50%] left-[30%]" animate={{ x: [0, 20, 0], y: [0, -25, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 6 }} />
      <motion.div className="blob blob-pink w-[300px] h-[300px] top-[75%] right-[15%]" animate={{ x: [0, -15, 0], y: [0, 20, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 9 }} />

      {/* ═══ NAV ═══ */}
      <motion.nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: navBg, borderBottom: '1px solid', borderColor: navBorder, backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center justify-between px-8 h-16 max-w-6xl mx-auto">
          <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <motion.div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center shadow-md shadow-brand-500/20" whileHover={{ scale: 1.1, rotate: 5 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" /></svg>
            </motion.div>
            <span className="text-[15px] font-bold text-text-primary tracking-tight">CareerCopilot</span>
          </motion.div>
          <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Link href="/sign-in" className="text-[13px] text-text-tertiary hover:text-text-primary transition-colors font-medium px-4 py-2">Sign in</Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/sign-up" className="text-[13px] font-semibold text-white gradient-brand px-5 py-2.5 rounded-xl shadow-md shadow-brand-500/20">Get started free</Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.nav>

      {/* ═══ HERO ═══ */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20 text-center">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="flex justify-center mb-8">
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200" whileHover={{ scale: 1.05 }}>
              <motion.span className="w-2 h-2 rounded-full bg-brand-500" animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="text-[12px] font-semibold text-brand-700">Powered by AI — Blazing Fast</span>
            </motion.div>
          </motion.div>

          <motion.h1 variants={item} className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6">
            <span className="text-text-primary">Stop applying.</span><br />
            <TypeWriter texts={['Start landing interviews.', 'Get more callbacks.', 'Land your dream job.', 'Beat the ATS.']} />
          </motion.h1>

          <motion.p variants={item} className="text-lg text-text-tertiary max-w-xl mx-auto leading-relaxed mb-10">
            CareerCopilot uses AI to analyze your resume, generate tailored answers, scout real jobs, and track every application.
          </motion.p>

          <motion.div variants={item} className="flex items-center justify-center gap-4 flex-wrap">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link href="/sign-up" className="inline-flex items-center gap-2 text-[15px] font-semibold text-white gradient-brand px-8 py-4 rounded-2xl shadow-lg shadow-brand-500/25">🚀 Start for free</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link href="/sign-in" className="inline-flex items-center gap-2 text-[15px] font-semibold text-text-secondary bg-white border-2 border-border-default px-8 py-4 rounded-2xl shadow-sm hover:border-brand-300 hover:text-brand-600 transition-all">Sign in →</Link>
            </motion.div>
          </motion.div>

          <motion.p variants={item} className="text-[12px] text-text-muted mt-6 font-medium">No credit card required · Free forever · 2 min setup</motion.p>
        </motion.div>
      </div>

      {/* ═══ FEATURES GRID ═══ */}
      <AnimatedSection className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-3">Everything you need to land the job</h2>
          <p className="text-text-tertiary">Six AI-powered tools that work together</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: '📊', title: 'Resume Analyzer', desc: 'AI match scoring with keyword insights', g: 'from-violet-50 to-indigo-50', b: 'border-violet-200' },
            { icon: '📝', title: 'Resume Builder', desc: 'ATS-friendly templates with live preview', g: 'from-amber-50 to-orange-50', b: 'border-amber-200' },
            { icon: '✉️', title: 'Cover Letter', desc: 'AI-generated personalized letters', g: 'from-pink-50 to-rose-50', b: 'border-pink-200' },
            { icon: '🔍', title: 'Job Scout', desc: 'Real jobs matched to your profile', g: 'from-emerald-50 to-teal-50', b: 'border-emerald-200' },
            { icon: '✍️', title: 'Answer Generator', desc: 'Tailored interview answers', g: 'from-sky-50 to-cyan-50', b: 'border-sky-200' },
            { icon: '📋', title: 'App Tracker', desc: 'Visual pipeline to track progress', g: 'from-indigo-50 to-violet-50', b: 'border-indigo-200' },
          ].map((f, i) => (
            <motion.div key={i} variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}>
              <div className={`bg-gradient-to-br ${f.g} border ${f.b} rounded-2xl p-6 h-full hover:shadow-xl transition-shadow`}>
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-[15px] font-bold text-text-primary mb-1">{f.title}</h3>
                <p className="text-[12px] text-text-tertiary leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ═══ FEATURE: Import Jobs ═══ */}
      <FeatureSection
        badge="SMART IMPORT"
        badgeColor="bg-orange-50 border border-orange-200 text-orange-700"
        title="Import Jobs from"
        titleHighlight="Anywhere"
        description="Paste any job URL or description — our AI extracts the title, company, skills, and full description instantly."
        bullets={[
          { icon: '🔗', text: 'Paste any job URL and we extract everything automatically' },
          { icon: '🤖', text: 'AI identifies requirements, skills, and qualifications' },
          { icon: '⚡', text: 'One click to analyze your resume match or save to tracker' },
        ]}
        visual={<ImportJobsVisual />}
        ctaText="Try importing a job →"
        ctaHref="/sign-up"
      />

      {/* ═══ FEATURE: Resume Builder ═══ */}
      <FeatureSection
        badge="ATS OPTIMIZED"
        badgeColor="bg-emerald-50 border border-emerald-200 text-emerald-700"
        title="AI Customized Resumes"
        titleHighlight="& Cover Letters"
        description="Build ATS-friendly resumes with professional templates. AI scores your resume and suggests improvements in real-time."
        bullets={[
          { icon: '📝', text: 'Choose from professional templates with live preview' },
          { icon: '🎯', text: 'Real ATS scoring powered by AI — know your score before applying' },
          { icon: '📥', text: 'Export as PDF or text, ready to submit anywhere' },
          { icon: '✨', text: 'AI rewrites your experience to match each job' },
        ]}
        visual={<ResumeBuilderVisual />}
        reversed
        ctaText="Build your resume →"
        ctaHref="/sign-up"
      />

      {/* ═══ FEATURE: Cover Letter ═══ */}
      <FeatureSection
        badge="AI WRITER"
        badgeColor="bg-pink-50 border border-pink-200 text-pink-700"
        title="Cover Letters that"
        titleHighlight="Get Read"
        description="Generate personalized cover letters in seconds. AI uses your profile and the job description to craft compelling letters."
        bullets={[
          { icon: '✉️', text: 'Personalized to each company and role automatically' },
          { icon: '🎨', text: 'Professional tone that sounds human, not robotic' },
          { icon: '📋', text: 'Copy or download — ready to paste into applications' },
        ]}
        visual={<CoverLetterVisual />}
        ctaText="Generate a cover letter →"
        ctaHref="/sign-up"
      />

      {/* ═══ FEATURE: Job Scout ═══ */}
      <FeatureSection
        badge="REAL JOBS"
        badgeColor="bg-emerald-50 border border-emerald-200 text-emerald-700"
        title="Jobs Matched to"
        titleHighlight="Your Profile"
        description="AI scouts real job listings from multiple boards and scores each one against your skills, experience, and preferences."
        bullets={[
          { icon: '🔍', text: 'Real jobs from Remotive, Arbeitnow, Himalayas and more' },
          { icon: '📊', text: 'AI match score (0-100) based on your unique profile' },
          { icon: '💼', text: 'Apply directly, save to tracker, or analyze match in one click' },
        ]}
        visual={<JobScoutVisual />}
        reversed
        ctaText="Scout jobs now →"
        ctaHref="/sign-up"
      />

      {/* ═══ FEATURE: Autofill ═══ */}
      <FeatureSection
        badge="SAVE TIME"
        badgeColor="bg-sky-50 border border-sky-200 text-sky-700"
        title="One-Click"
        titleHighlight="Application Autofill"
        description="Store your profile once and copy any field instantly. No more retyping across hundreds of applications."
        bullets={[
          { icon: '💾', text: 'Save your complete profile, work history, and education' },
          { icon: '📋', text: 'Click any field to copy — paste into any application form' },
          { icon: '🔄', text: 'Edit anytime as your career grows' },
        ]}
        visual={<AutofillVisual />}
        ctaText="Set up your profile →"
        ctaHref="/sign-up"
      />

      {/* ═══ HOW IT WORKS ═══ */}
      <AnimatedSection className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-3">How it works</h2>
          <p className="text-text-tertiary">Get started in under 2 minutes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: '1', title: 'Create Profile', desc: 'Add your info, skills, and work history', color: 'bg-violet-100 text-violet-700 border-violet-200' },
            { step: '2', title: 'Find a Job', desc: 'Scout jobs or paste any URL', color: 'bg-sky-100 text-sky-700 border-sky-200' },
            { step: '3', title: 'AI Analyzes', desc: 'Get match score and suggestions', color: 'bg-amber-100 text-amber-700 border-amber-200' },
            { step: '4', title: 'Apply & Track', desc: 'Submit with confidence', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
          ].map((s, i) => (
            <motion.div key={i} className="text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
              <motion.div className={`w-14 h-14 rounded-2xl ${s.color} border flex items-center justify-center mx-auto mb-4 text-[20px] font-black`} whileHover={{ scale: 1.15, rotate: 5 }}>
                {s.step}
              </motion.div>
              <h3 className="text-[15px] font-bold text-text-primary mb-1">{s.title}</h3>
              <p className="text-[12px] text-text-tertiary">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ═══ STATS ═══ */}
      <AnimatedSection className="relative z-10 max-w-4xl mx-auto px-6 pb-16">
        <motion.div className="bg-gradient-to-r from-brand-50 via-white to-sky-50 border border-brand-100 rounded-2xl p-8 shadow-sm" whileHover={{ y: -4 }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: '3x', label: 'Higher callback rate' },
              { value: '<10s', label: 'Average analysis time' },
              { value: '100%', label: 'Free to get started' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="text-3xl font-black text-brand-600 mb-1"><AnimatedCounter target={s.value} /></div>
                <div className="text-[12px] text-text-muted">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatedSection>

      {/* ═══ CTA ═══ */}
      <AnimatedSection className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <motion.div className="gradient-brand rounded-3xl p-12 text-center text-white shadow-2xl shadow-brand-500/20 relative overflow-hidden" whileHover={{ y: -4 }}>
          <motion.div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5" animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 15, repeat: Infinity }} style={{ transform: 'translate(30%, -30%)' }} />
          <motion.div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 12, repeat: Infinity, delay: 3 }} style={{ transform: 'translate(-30%, 30%)' }} />
          <div className="relative z-10">
            <motion.h2 className="text-3xl font-bold mb-3" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>Ready to land your dream job?</motion.h2>
            <motion.p className="text-white/80 mb-8 max-w-md mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              Join job seekers who use CareerCopilot to stand out from the crowd.
            </motion.p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/sign-up" className="inline-flex items-center gap-2 text-[15px] font-semibold text-brand-700 bg-white px-8 py-4 rounded-2xl hover:bg-brand-50 transition-all shadow-lg">
                Get started for free 🚀
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatedSection>

      {/* ═══ FOOTER ═══ */}
      <motion.div className="relative z-10 border-t border-border-subtle" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 gradient-brand rounded-lg flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" /></svg>
            </div>
            <span className="text-[12px] text-text-muted font-medium">© 2025 CareerCopilot</span>
          </div>
          <span className="text-[12px] text-text-muted">Built with AI, for humans ✨</span>
        </div>
      </motion.div>
    </div>
  );
}