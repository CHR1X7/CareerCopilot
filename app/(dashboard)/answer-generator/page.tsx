'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { GeneratedAnswer } from '@/types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const COMMON_QUESTIONS = [
  'Why are you a good fit for this role?',
  'What is your greatest strength?',
  'What is your biggest weakness?',
  'Why do you want to work at this company?',
  'Tell me about yourself',
  'Where do you see yourself in 5 years?',
  'Describe a challenge you overcame',
  'What motivates you?',
];

export default function AnswerGeneratorPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [customQuestion, setCustomQuestion] = useState('');
  const [answers, setAnswers] = useState<GeneratedAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editedAnswer, setEditedAnswer] = useState('');

  const toggleQuestion = (q: string) => {
    setSelectedQuestions(prev =>
      prev.includes(q) ? prev.filter(item => item !== q) : [...prev, q]
    );
  };

  const addCustom = () => {
    if (customQuestion.trim() && !selectedQuestions.includes(customQuestion.trim())) {
      setSelectedQuestions(prev => [...prev, customQuestion.trim()]);
      setCustomQuestion('');
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
      if (data.answers) {
        setAnswers(data.answers);
        toast.success(`Generated ${data.answers.length} personalized answers!`);
      } else {
        throw new Error(data.error);
      }
    } catch {
      toast.error('Generation failed. Please try again.');
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

  const startEdit = (idx: number, currentAnswer: string) => {
    setEditingIdx(idx);
    setEditedAnswer(currentAnswer);
  };

  const saveEdit = (idx: number) => {
    setAnswers(prev => prev.map((a, i) => i === idx ? { ...a, answer: editedAnswer } : a));
    setEditingIdx(null);
    toast.success('Answer updated!');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          ✍️ Answer <span className="gradient-text">Generator</span>
        </h1>
        <p className="text-gray-400">Generate personalized, compelling answers tailored to the job</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* JD Input */}
        <Card>
          <h3 className="font-semibold text-white mb-4">Job Description</h3>
          <textarea
            className="w-full h-48 bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-500 resize-none"
            placeholder="Paste the job description here so the AI can personalize your answers..."
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
          />
        </Card>

        {/* Question Selection */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Select Questions</h3>
            <span className="text-sm text-gray-500">{selectedQuestions.length} selected</span>
          </div>
          <div className="space-y-2 max-h-44 overflow-y-auto mb-3">
            {COMMON_QUESTIONS.map(q => (
              <label
                key={q}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 mt-0.5 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                    selectedQuestions.includes(q) ? 'bg-violet-600 border-violet-600' : 'border-gray-600 group-hover:border-violet-500'
                  }`}
                  onClick={() => toggleQuestion(q)}
                >
                  {selectedQuestions.includes(q) && <span className="text-white text-xs">✓</span>}
                </div>
                <span className="text-sm text-gray-300 leading-tight">{q}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add custom question..."
              className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500"
              value={customQuestion}
              onChange={e => setCustomQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustom()}
            />
            <button onClick={addCustom} className="px-3 py-2 bg-violet-600 rounded-xl text-white text-sm hover:bg-violet-700">
              Add
            </button>
          </div>
        </Card>
      </div>

      <div className="flex justify-center mb-8">
        <Button
          size="lg"
          onClick={handleGenerate}
          loading={loading}
          icon={<span>✨</span>}
          className="px-12"
        >
          {loading ? 'AI is crafting your answers...' : 'Generate Personalized Answers'}
        </Button>
      </div>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card p-8 text-center mb-6"
          >
            <div className="text-4xl mb-4 animate-pulse">🤖</div>
            <p className="text-gray-400">Analyzing your profile and crafting personalized answers...</p>
            <p className="text-gray-600 text-sm mt-2">The AI is reviewing your work history and the job requirements</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Answers */}
      <AnimatePresence>
        {answers.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Your Personalized Answers</h2>
              <span className="text-sm text-gray-500">{answers.length} answers generated</span>
            </div>

            {answers.map((answer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-violet-600/30 rounded-lg flex items-center justify-center text-violet-400 text-sm font-bold">
                        {i + 1}
                      </div>
                      <h4 className="font-semibold text-white">{answer.question}</h4>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(i, answer.answer)}
                        className="px-3 py-1.5 text-xs bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => copyAnswer(answer.answer, i)}
                        className="px-3 py-1.5 text-xs bg-violet-600/20 border border-violet-500/30 rounded-lg text-violet-400 hover:bg-violet-600/30 transition-colors"
                      >
                        {copiedIdx === i ? '✓ Copied!' : '📋 Copy'}
                      </button>
                    </div>
                  </div>

                  {editingIdx === i ? (
                    <div className="mb-4">
                      <textarea
                        className="w-full h-40 bg-gray-800/50 border border-violet-500 rounded-xl p-4 text-sm text-gray-300 focus:outline-none resize-none"
                        value={editedAnswer}
                        onChange={e => setEditedAnswer(e.target.value)}
                      />
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={() => saveEdit(i)}>Save Changes</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingIdx(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 p-4 bg-gray-800/30 rounded-xl">
                      {answer.answer}
                    </p>
                  )}

                  {answer.tips?.length > 0 && (
                    <div className="p-4 bg-cyan-900/20 border border-cyan-500/20 rounded-xl">
                      <p className="text-xs font-semibold text-cyan-400 mb-2">💡 DELIVERY TIPS</p>
                      <ul className="space-y-1">
                        {answer.tips.map((tip, j) => (
                          <li key={j} className="text-xs text-gray-400 flex items-start gap-2">
                            <span className="text-cyan-500 mt-0.5">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}