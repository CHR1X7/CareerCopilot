'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { ResumeAnalysis } from '@/types';
import { getScoreColor, getScoreBg, cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Progress from '@/components/ui/Progress';
import Badge from '@/components/ui/Badge';

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
    maxFiles: 1,
    onDrop: async (files) => {
      const file = files[0];
      if (!file) return;

      if (file.type === 'text/plain') {
        const text = await file.text();
        setResumeText(text);
        toast.success('Resume loaded!');
      } else {
        // For PDF, we'll send to API
        const formData = new FormData();
        formData.append('file', file);
        toast.info('PDF parsing - please paste the text manually for now, or use a txt file.');
        setResumeText(`[PDF uploaded: ${file.name} - Please paste the text content]`);
      }
    },
  });

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast.error('Please provide both your resume and a job description');
      return;
    }

    setLoading(true);
    setAnalysis(null);
    setFeedback(null);

    try {
      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: resumeText, job_description: jobDescription }),
      });

      const data = await res.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
        toast.success('Analysis complete!');
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = {
    high: 'danger' as const,
    medium: 'warning' as const,
    low: 'info' as const,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          📊 Resume <span className="gradient-text">Analyzer</span>
        </h1>
        <p className="text-gray-400">Get your match score and actionable insights to land the job</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Resume Input */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Your Resume</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('paste')}
                className={cn('text-xs px-3 py-1 rounded-lg transition-all', activeTab === 'paste' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white')}
              >
                Paste Text
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={cn('text-xs px-3 py-1 rounded-lg transition-all', activeTab === 'upload' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white')}
              >
                Upload File
              </button>
            </div>
          </div>

          {activeTab === 'paste' ? (
            <textarea
              className="w-full h-64 bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-500 resize-none"
              placeholder="Paste your resume content here..."
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
            />
          ) : (
            <div
              {...getRootProps()}
              className={cn(
                'h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all',
                isDragActive ? 'border-violet-500 bg-violet-500/10' : 'border-gray-700 hover:border-gray-600'
              )}
            >
              <input {...getInputProps()} />
              <div className="text-4xl mb-3">📄</div>
              <div className="text-gray-400 text-sm text-center">
                {isDragActive ? 'Drop it here!' : 'Drag & drop your resume\nor click to browse'}
              </div>
              <div className="text-gray-600 text-xs mt-2">.txt files supported</div>
              {resumeText && <div className="mt-3 text-emerald-400 text-xs">✓ Resume loaded</div>}
            </div>
          )}

          <div className="mt-2 text-right text-xs text-gray-600">
            {resumeText.length} characters
          </div>
        </Card>

        {/* Job Description */}
        <Card>
          <h3 className="font-semibold text-white mb-4">Job Description</h3>
          <textarea
            className="w-full h-64 bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-500 resize-none"
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
          />
          <div className="mt-2 text-right text-xs text-gray-600">
            {jobDescription.length} characters
          </div>
        </Card>
      </div>

      <div className="flex justify-center mb-8">
        <Button
          size="lg"
          onClick={handleAnalyze}
          loading={loading}
          icon={<span>🔍</span>}
          className="px-12"
        >
          {loading ? 'AI is analyzing your resume...' : 'Analyze Resume Match'}
        </Button>
      </div>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card p-8 text-center mb-6"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-gray-400">🤖 AI agent is analyzing your resume against the job description...</p>
            <p className="text-gray-600 text-sm mt-2">This usually takes 5-10 seconds</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Score Hero */}
            <Card glow className="text-center py-10">
              <div className="mb-6">
                <div className={`text-8xl font-black ${getScoreColor(analysis.match_score)} mb-2`}>
                  {analysis.match_score}%
                </div>
                <div className="text-xl font-semibold text-white mb-1">Match Score</div>
                <Progress
                  value={analysis.match_score}
                  size="lg"
                  barClassName={`bg-gradient-to-r ${getScoreBg(analysis.match_score)}`}
                  className="max-w-md mx-auto mt-4"
                />
              </div>
              <p className="text-gray-300 max-w-2xl mx-auto">{analysis.overall_assessment}</p>
              
              {/* Feedback */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <span className="text-sm text-gray-500">Was this analysis helpful?</span>
                <button
                  onClick={() => { setFeedback('up'); toast.success('Thanks for your feedback!'); }}
                  className={cn('text-2xl transition-all hover:scale-110', feedback === 'up' ? 'opacity-100' : 'opacity-40 hover:opacity-80')}
                >👍</button>
                <button
                  onClick={() => { setFeedback('down'); toast.success('Thanks! We\'ll improve this.'); }}
                  className={cn('text-2xl transition-all hover:scale-110', feedback === 'down' ? 'opacity-100' : 'opacity-40 hover:opacity-80')}
                >👎</button>
              </div>
            </Card>

            {/* Skills Breakdown */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-emerald-400">✅</span> Matched Skills ({analysis.matched_skills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.matched_skills?.map(skill => (
                    <Badge key={skill} variant="success">{skill}</Badge>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-red-400">❌</span> Missing Skills ({analysis.missing_skills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.missing_skills?.map(skill => (
                    <Badge key={skill} variant="danger">{skill}</Badge>
                  ))}
                </div>
              </Card>
            </div>

            {/* Insights */}
            <Card>
              <h3 className="font-semibold text-white mb-6 text-lg">💡 Actionable Insights</h3>
              <div className="space-y-4">
                {analysis.insights?.map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="p-4 bg-gray-800/50 rounded-xl border border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={priorityColors[insight.priority]}>
                          {insight.priority.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-gray-500">{insight.category}</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-white mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-400 mb-3">{insight.description}</p>
                    <div className="flex items-start gap-2 p-3 bg-violet-900/20 rounded-lg border border-violet-500/20">
                      <span className="text-violet-400 text-sm mt-0.5">→</span>
                      <p className="text-sm text-violet-300">{insight.action}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}