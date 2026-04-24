'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { GeneratedAnswer } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const COMMON_QUESTIONS = [
  'Why are you a good fit for this role?',
  'Tell me about yourself',
  'What is your greatest strength?',
  'What is your biggest weakness?',
  'Why do you want to work at this company?',
  'Where do you see yourself in 5 years?',
  'Describe a challenge you overcame',
  'What motivates you?',
  'Why are you leaving your current job?',
  'What are your salary expectations?',
];

export default function AnswerGeneratorPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [customQuestion, setCustomQuestion] = useState('');
  const [answers, setAnswers] = useState<GeneratedAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editedAnswer, setEditedAnswer] = useState('');
  const [feedback, setFeedback] = useState<Record<number, 'up' | 'down'>>({});

  const toggleQuestion = (q: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(q) ? prev.filter((item) => item !== q) : [...prev, q]
    );
  };

  const addCustom = () => {
    if (
      customQuestion.trim() &&
      !selectedQuestions.includes(customQuestion.trim())
    ) {
      setSelectedQuestions((prev) => [...prev, customQuestion.trim()]);
      setCustomQuestion('');
    }
  };

  const extractQuestionsFromJD = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste the job description first');
      return;
    }
    setExtracting(true);
    try {
      const res = await fetch('/api/generate/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_description: jobDescription }),
      });
      const data = await res.json();
      if (data.questions?.length) {
        setSelectedQuestions(data.questions);
        toast.success(`Found ${data.questions.length} relevant questions!`);
      } else {
        toast.error('Could not extract questions');
      }
    } catch {
      toast.error('Failed to extract questions');
    } finally {
      setExtracting(false);
    }
  };

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste the job description first');
      return;
    }
    if (selectedQuestions.length === 0) {
      toast.error('Please select at least one question');
      return;
    }

    setLoading(true);
    setAnswers([]);

    try {
      const res = await fetch('/api/generate/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: jobDescription,
          questions: selectedQuestions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.answers) {
        setAnswers(data.answers);
        toast.success(`Generated ${data.answers.length} answers!`);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyAnswer = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const startEdit = (idx: number, current: string) => {
    setEditingIdx(idx);
    setEditedAnswer(current);
  };

  const saveEdit = (idx: number) => {
    setAnswers((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, answer: editedAnswer } : a))
    );
    setEditingIdx(null);
    toast.success('Answer updated!');
  };

  const saveFeedback = async (idx: number, rating: 'up' | 'down') => {
    setFeedback((prev) => ({ ...prev, [idx]: rating }));
    toast.success(rating === 'up' ? 'Thanks!' : "We'll improve this");
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: 'answer_generator',
          rating,
          context: { question: answers[idx]?.question },
        }),
      });
    } catch {
      // non-fatal
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Answer Generator
        </h1>
        <p className="text-sm text-text-tertiary mt-1">
          Generate personalized, compelling answers tailored to each job
        </p>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Job Description */}
        <Card variant="default" padding="md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold text-text-primary">
              Job Description
            </span>
            <Button
              variant="outline"
              size="xs"
              onClick={extractQuestionsFromJD}
              loading={extracting}
              icon={
                !extracting ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                  </svg>
                ) : undefined
              }
            >
              {extracting ? 'Extracting...' : 'AI Extract Questions'}
            </Button>
          </div>
          <textarea
            className="input-field resize-none h-56 text-[13px]"
            placeholder="Paste the full job description here. The AI will extract relevant questions automatically..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-[11px] text-text-muted">
              {jobDescription.length > 0 && `${jobDescription.length} chars`}
            </span>
            {jobDescription && (
              <button
                onClick={() => setJobDescription('')}
                className="text-[11px] text-text-muted hover:text-accent-rose transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </Card>

        {/* Question Selection */}
        <Card variant="default" padding="md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold text-text-primary">
              Questions
            </span>
            <div className="flex items-center gap-2">
              {selectedQuestions.length > 0 && (
                <Badge variant="brand" size="sm">
                  {selectedQuestions.length} selected
                </Badge>
              )}
              {selectedQuestions.length > 0 && (
                <button
                  onClick={() => setSelectedQuestions([])}
                  className="text-[11px] text-text-muted hover:text-accent-rose transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Selected questions */}
          {selectedQuestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3 p-2.5 bg-brand-500/5 rounded-xl border border-brand-500/10">
              {selectedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => toggleQuestion(q)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full text-[11px] text-brand-300 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-accent-rose transition-all"
                >
                  {q.length > 35 ? q.substring(0, 35) + '...' : q}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              ))}
            </div>
          )}

          {/* Common questions list */}
          <div className="space-y-1 max-h-40 overflow-y-auto mb-3">
            {COMMON_QUESTIONS.map((q) => {
              const isSelected = selectedQuestions.includes(q);
              return (
                <button
                  key={q}
                  onClick={() => toggleQuestion(q)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all',
                    isSelected
                      ? 'bg-brand-500/10 border border-brand-500/20'
                      : 'hover:bg-surface-200 border border-transparent'
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-md border flex-shrink-0 flex items-center justify-center transition-all',
                      isSelected
                        ? 'bg-brand-600 border-brand-600'
                        : 'border-border-strong'
                    )}
                  >
                    {isSelected && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-[12px] leading-tight',
                      isSelected ? 'text-brand-300' : 'text-text-tertiary'
                    )}
                  >
                    {q}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom question input */}
          <div className="flex gap-2 pt-2 border-t border-border-subtle">
            <input
              type="text"
              placeholder="Add a custom question..."
              className="input-field text-[12px] py-2"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            />
            <Button variant="secondary" size="sm" onClick={addCustom}>
              Add
            </Button>
          </div>
        </Card>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleGenerate}
          loading={loading}
          icon={
            !loading ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              </svg>
            ) : undefined
          }
          className="px-10"
        >
          {loading ? 'Crafting your answers...' : 'Generate Answers'}
        </Button>
      </div>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card variant="default" className="text-center py-10">
              <div className="flex items-center justify-center gap-1.5 mb-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
              <p className="text-[13px] text-text-tertiary">
                AI is reviewing your profile and crafting personalized answers
              </p>
              <p className="text-[11px] text-text-muted mt-1">
                Usually takes 5–15 seconds
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Answers */}
      <AnimatePresence>
        {answers.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-semibold text-text-secondary">
                Your Personalized Answers
              </h2>
              <Badge variant="brand" size="sm">
                {answers.length} generated
              </Badge>
            </div>

            {answers.map((answer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card variant="default" padding="md">
                  {/* Question Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[11px] font-bold text-brand-400">
                          {i + 1}
                        </span>
                      </div>
                      <h4 className="text-[13px] font-semibold text-text-primary leading-snug">
                        {answer.question}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => startEdit(i, answer.answer)}
                        className="h-7 px-2.5 rounded-lg bg-surface-200 border border-border-subtle text-[11px] text-text-muted hover:text-text-primary transition-colors flex items-center gap-1"
                      >
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => copyAnswer(answer.answer, i)}
                        className={cn(
                          'h-7 px-2.5 rounded-lg border text-[11px] transition-all flex items-center gap-1',
                          copiedIdx === i
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-accent-emerald'
                            : 'bg-surface-200 border-border-subtle text-text-muted hover:text-text-primary'
                        )}
                      >
                        {copiedIdx === i ? (
                          <>
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                            Copied
                          </>
                        ) : (
                          <>
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Answer content */}
                  {editingIdx === i ? (
                    <div className="mb-4">
                      <textarea
                        className="input-field resize-none h-44 text-[13px] leading-relaxed"
                        value={editedAnswer}
                        onChange={(e) => setEditedAnswer(e.target.value)}
                        autoFocus
                      />
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={() => saveEdit(i)}>
                          Save Changes
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingIdx(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 p-4 bg-surface-50 rounded-xl border border-border-subtle">
                      <p className="text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap">
                        {answer.answer}
                      </p>
                    </div>
                  )}

                  {/* Tips */}
                  {answer.tips?.length > 0 && (
                    <div className="p-3 bg-surface-200 rounded-xl border border-border-subtle mb-4">
                      <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">
                        Delivery Tips
                      </p>
                      <ul className="space-y-1">
                        {answer.tips.map((tip, j) => (
                          <li
                            key={j}
                            className="text-[12px] text-text-tertiary flex items-start gap-2"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-brand-400 mt-0.5 flex-shrink-0"
                            >
                              <path d="M5 12h14" />
                              <path d="m12 5 7 7-7 7" />
                            </svg>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Feedback */}
                  <div className="flex items-center gap-2 pt-3 border-t border-border-subtle">
                    <span className="text-[11px] text-text-muted">
                      Was this helpful?
                    </span>
                    <button
                      onClick={() => saveFeedback(i, 'up')}
                      className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all',
                        feedback[i] === 'up'
                          ? 'bg-emerald-500/20 text-accent-emerald'
                          : 'bg-surface-200 text-text-muted hover:text-text-primary'
                      )}
                    >
                      👍
                    </button>
                    <button
                      onClick={() => saveFeedback(i, 'down')}
                      className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all',
                        feedback[i] === 'down'
                          ? 'bg-rose-500/20 text-accent-rose'
                          : 'bg-surface-200 text-text-muted hover:text-text-primary'
                      )}
                    >
                      👎
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}