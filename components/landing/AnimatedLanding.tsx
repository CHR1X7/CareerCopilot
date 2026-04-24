'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// Stagger children animation
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

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
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
// Animated counter
function AnimatedCounter({ target, suffix = '' }: { target: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    // If target is not a pure number like "3x" or "<10s"
    const num = parseInt(target.replace(/[^0-9]/g, ''));
    if (isNaN(num)) {
      setDisplay(target);
      return;
    }

    let current = 0;
    const duration = 1500;
    const steps = 40;
    const increment = num / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= num) {
        current = num;
        clearInterval(timer);
      }
      // Preserve original format
      if (target.includes('K')) setDisplay(Math.round(current) + 'K');
      else if (target.includes('%')) setDisplay(Math.round(current) + '%');
      else if (target.includes('x')) setDisplay(Math.round(current) + 'x');
      else if (target.includes('s')) setDisplay('<' + Math.round(current) + 's');
      else setDisplay(Math.round(current).toString());
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{display}{suffix}</span>;
}

// Section wrapper with scroll animation
function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Floating particles
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-brand-400/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Typing animation for hero
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
        className="inline-block w-[3px] h-[1em] bg-brand-500 ml-1 align-middle"
      />
    </span>
  );
}

export default function AnimatedLanding() {
  const { scrollYProgress } = useScroll();
  const navBg = useTransform(
    scrollYProgress,
    [0, 0.05],
    ['rgba(248, 250, 255, 0)', 'rgba(248, 250, 255, 0.95)']
  );
  const navBorder = useTransform(
    scrollYProgress,
    [0, 0.05],
    ['rgba(0,0,0,0)', 'rgba(0,0,0,0.06)']
  );
  const navShadow = useTransform(
    scrollYProgress,
    [0, 0.05],
    ['0 0 0 0 rgba(0,0,0,0)', '0 1px 12px 0 rgba(0,0,0,0.05)']
  );

  return (
    <div
      className="min-h-screen overflow-hidden relative"
      style={{
        background:
          'linear-gradient(180deg, #f8faff 0%, #ffffff 25%, #f0f7ff 50%, #faf5ff 75%, #ffffff 100%)',
      }}
    >
      {/* Particles */}
      <Particles />

      {/* Blobs with animation */}
      <motion.div
        className="blob blob-purple w-[600px] h-[600px] -top-[15%] left-[10%]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="blob blob-orange w-[400px] h-[400px] top-[20%] -right-[5%]"
        animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 0.9, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      <motion.div
        className="blob blob-blue w-[500px] h-[500px] top-[50%] left-[30%]"
        animate={{ x: [0, 20, 0], y: [0, -25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />
      <motion.div
        className="blob blob-pink w-[300px] h-[300px] top-[10%] right-[20%]"
        animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 9 }}
      />
      <motion.div
        className="blob blob-green w-[350px] h-[350px] bottom-[10%] right-[10%]"
        animate={{ x: [0, 25, 0], y: [0, -15, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut', delay: 12 }}
      />

      {/* ═══ STICKY NAV ═══ */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 max-w-6xl mx-auto"
        style={{
          backgroundColor: navBg,
          borderBottom: `1px solid`,
          borderColor: navBorder,
          boxShadow: navShadow,
          backdropFilter: 'blur(12px)',
        }}
      >
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center shadow-md shadow-brand-500/20"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2 2 7l10 5 10-5-10-5Z" />
              <path d="m2 17 10 5 10-5" />
              <path d="m2 12 10 5 10-5" />
            </svg>
          </motion.div>
          <span className="text-[15px] font-bold text-text-primary tracking-tight">
            CareerCopilot
          </span>
        </motion.div>

        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/sign-in"
            className="text-[13px] text-text-tertiary hover:text-text-primary transition-colors font-medium px-4 py-2"
          >
            Sign in
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/sign-up"
              className="text-[13px] font-semibold text-white gradient-brand px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-brand-500/20"
            >
              Get started free
            </Link>
          </motion.div>
        </motion.div>
      </motion.nav>

      {/* ═══ HERO ═══ */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20 text-center">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Badge */}
          <motion.div variants={item} className="flex justify-center mb-8">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200"
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-brand-500"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[12px] font-semibold text-brand-700">
                Powered by AI — Blazing Fast
              </span>
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={item}
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6"
          >
            <span className="text-text-primary">Stop applying.</span>
            <br />
            <TypeWriter
              texts={[
                'Start landing interviews.',
                'Get more callbacks.',
                'Land your dream job.',
                'Beat the ATS.',
              ]}
            />
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="text-lg text-text-tertiary max-w-xl mx-auto leading-relaxed mb-10"
          >
            CareerCopilot uses AI to analyze your resume, generate tailored answers,
            and track every application — so you focus on what matters.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={item}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-white gradient-brand px-8 py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-brand-500/25"
              >
                🚀 Start for free
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-text-secondary bg-white border-2 border-border-default px-8 py-4 rounded-2xl hover:border-brand-300 hover:text-brand-600 transition-all shadow-sm"
              >
                Sign in →
              </Link>
            </motion.div>
          </motion.div>

          {/* Sub-text */}
          <motion.p
            variants={item}
            className="text-[12px] text-text-muted mt-6 font-medium"
          >
            No credit card required · Free forever · 2 min setup
          </motion.p>
        </motion.div>
      </div>

      {/* ═══ FEATURES ═══ */}
      <AnimatedSection className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl font-bold text-text-primary mb-3"
          >
            Everything you need to land the job
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-tertiary"
          >
            Six AI-powered tools that work together for your success
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                  <path d="M7 8h10" /><path d="M7 12h10" /><path d="M7 16h10" />
                </svg>
              ),
              title: 'Resume Analyzer',
              desc: 'AI match scoring against any job. Know exactly what keywords to add to get past the ATS.',
              gradient: 'from-violet-50 to-indigo-50',
              border: 'border-violet-200',
              iconBg: 'bg-violet-100',
              iconColor: 'text-violet-600',
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                </svg>
              ),
              title: 'Answer Generator',
              desc: 'Craft compelling, personalized answers using your actual experience and role requirements.',
              gradient: 'from-sky-50 to-cyan-50',
              border: 'border-sky-200',
              iconBg: 'bg-sky-100',
              iconColor: 'text-sky-600',
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                  <path d="M11 8v6" /><path d="M8 11h6" />
                </svg>
              ),
              title: 'Job Scout',
              desc: 'Real jobs from multiple boards, AI-matched to your profile with personalized scoring.',
              gradient: 'from-emerald-50 to-teal-50',
              border: 'border-emerald-200',
              iconBg: 'bg-emerald-100',
              iconColor: 'text-emerald-600',
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
                </svg>
              ),
              title: 'Resume Builder',
              desc: 'Build ATS-friendly resumes with templates, live preview, and real ATS scoring.',
              gradient: 'from-amber-50 to-orange-50',
              border: 'border-amber-200',
              iconBg: 'bg-amber-100',
              iconColor: 'text-amber-600',
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              ),
              title: 'Cover Letter',
              desc: 'AI generates personalized cover letters tailored to each application instantly.',
              gradient: 'from-pink-50 to-rose-50',
              border: 'border-pink-200',
              iconBg: 'bg-pink-100',
              iconColor: 'text-pink-600',
            },
            {
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
                  <path d="m2 12 8.58 3.91a2 2 0 0 0 1.66 0L21 12" />
                  <path d="m2 17 8.58 3.91a2 2 0 0 0 1.66 0L21 17" />
                </svg>
              ),
              title: 'Application Tracker',
              desc: 'Visual pipeline from submission to offer. Never lose track of where you stand.',
              gradient: 'from-indigo-50 to-violet-50',
              border: 'border-indigo-200',
              iconBg: 'bg-indigo-100',
              iconColor: 'text-indigo-600',
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div
                className={`bg-gradient-to-br ${f.gradient} border ${f.border} rounded-2xl p-7 h-full hover:shadow-xl transition-shadow duration-300`}
              >
                <motion.div
                  className={`w-14 h-14 rounded-2xl ${f.iconBg} ${f.iconColor} flex items-center justify-center mb-5`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  {f.icon}
                </motion.div>
                <h3 className="text-[17px] font-bold text-text-primary mb-2">{f.title}</h3>
                <p className="text-[13px] text-text-tertiary leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ═══ IMPORT JOBS FEATURE ═══ */}
      <AnimatedSection className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 mb-5">
              <span className="text-[11px] font-semibold text-orange-700">SMART IMPORT</span>
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-4 leading-tight">
              Import Jobs from{' '}
              <span className="gradient-text-brand">Anywhere</span>
            </h2>
            <p className="text-[15px] text-text-tertiary leading-relaxed mb-6">
              Paste any job URL or description — our AI extracts the title, company,
              skills, and full description instantly.
            </p>
            <div className="space-y-4">
              {[
                { icon: '🔗', text: 'Paste any job URL and we extract everything' },
                { icon: '🤖', text: 'AI identifies requirements and qualifications' },
                { icon: '⚡', text: 'One click to analyze or save to tracker' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                >
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <span className="text-[14px] text-text-secondary leading-relaxed">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div
              className="bg-white border border-border-default rounded-2xl shadow-xl p-6"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-surface-50 border border-border-default rounded-xl">
                  <span className="text-text-muted text-sm">🔗</span>
                  <motion.span
                    className="text-[13px] text-text-muted"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    https://linkedin.com/jobs/view/...
                  </motion.span>
                </div>
                <motion.div
                  className="px-4 py-3 gradient-brand text-white text-[12px] font-semibold rounded-xl cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Import
                </motion.div>
              </div>

              <motion.div
                className="p-4 bg-gradient-to-br from-violet-50 to-white border border-violet-100 rounded-xl"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-lg">🏢</div>
                  <div>
                    <div className="text-[14px] font-bold text-text-primary">Senior Software Engineer</div>
                    <div className="text-[12px] text-text-tertiary">Google · Mountain View, CA</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {['React', 'TypeScript', 'Node.js', 'System Design'].map((s, i) => (
                    <motion.span
                      key={s}
                      className="px-2.5 py-1 bg-white border border-violet-200 rounded-full text-[10px] font-semibold text-violet-700"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <motion.div
                    className="h-2 bg-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: '78%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
                  />
                  <span className="text-[11px] font-bold text-emerald-600">78% match</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ═══ HOW IT WORKS ═══ */}
      <AnimatedSection className="relative z-10 max-w-5xl mx-auto px-6 py-16">
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
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <motion.div
                className={`w-14 h-14 rounded-2xl ${s.color} border flex items-center justify-center mx-auto mb-4 text-[20px] font-black`}
                whileHover={{ scale: 1.15, rotate: 5 }}
              >
                {s.step}
              </motion.div>
              <h3 className="text-[15px] font-bold text-text-primary mb-1">{s.title}</h3>
              <p className="text-[12px] text-text-tertiary">{s.desc}</p>
              {i < 3 && (
                <motion.div
                  className="hidden md:block mt-6"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-border-strong mx-auto">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ═══ STATS ═══ */}
      <AnimatedSection className="relative z-10 max-w-4xl mx-auto px-6 pb-16">
        <motion.div
          className="bg-gradient-to-r from-brand-50 via-white to-sky-50 border border-brand-100 rounded-2xl p-8 shadow-sm"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: '3', suffix: 'x', label: 'Higher callback rate' },
              { value: '10', suffix: 's', label: 'Average analysis time' },
              { value: '100', suffix: '%', label: 'Free to get started' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="text-3xl font-black text-brand-600 mb-1">
                  <AnimatedCounter target={s.value + s.suffix} />
                </div>
                <div className="text-[12px] text-text-muted">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatedSection>

      {/* ═══ CTA ═══ */}
      <AnimatedSection className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <motion.div
          className="gradient-brand rounded-3xl p-12 text-center text-white shadow-2xl shadow-brand-500/20 relative overflow-hidden"
          whileHover={{ y: -4 }}
        >
          <motion.div
            className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
            style={{ transform: 'translate(30%, -30%)' }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5"
            animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 12, repeat: Infinity, delay: 3 }}
            style={{ transform: 'translate(-30%, 30%)' }}
          />

          <div className="relative z-10">
            <motion.h2
              className="text-3xl font-bold mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to land your dream job?
            </motion.h2>
            <motion.p
              className="text-white/80 mb-8 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Join job seekers who use CareerCopilot to stand out.
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-brand-700 bg-white px-8 py-4 rounded-2xl hover:bg-brand-50 transition-all shadow-lg"
              >
                Get started for free 🚀
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatedSection>

      {/* ═══ FOOTER ═══ */}
      <motion.div
        className="relative z-10 border-t border-border-subtle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 gradient-brand rounded-lg flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                <path d="m2 17 10 5 10-5" />
                <path d="m2 12 10 5 10-5" />
              </svg>
            </div>
            <span className="text-[12px] text-text-muted font-medium">© 2025 CareerCopilot</span>
          </div>
          <span className="text-[12px] text-text-muted">Built with AI, for humans ✨</span>
        </div>
      </motion.div>
    </div>
  );
}