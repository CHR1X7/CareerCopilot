import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { callGroq } from '@/lib/groq';
import { ResumeAnalysis } from '@/types';

const SYSTEM_PROMPT = `You are an expert technical recruiter and career coach with 15+ years of experience. 
Your job is to analyze a candidate's resume against a job description and provide actionable feedback.

You MUST respond with a valid JSON object in exactly this structure:
{
  "match_score": <integer 0-100>,
  "matched_skills": ["skill1", "skill2", ...],
  "missing_skills": ["skill1", "skill2", ...],
  "overall_assessment": "<2-3 sentence summary>",
  "insights": [
    {
      "category": "<Skills|Experience|Keywords|Formatting|Achievements>",
      "title": "<short title>",
      "description": "<detailed explanation>",
      "priority": "<high|medium|low>",
      "action": "<specific actionable step>"
    }
  ]
}

Be honest, specific, and actionable. Generate 5-7 insights minimum.`;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { resume_text, job_description } = await req.json();

    if (!resume_text || !job_description) {
      return NextResponse.json({ error: 'Resume text and job description are required' }, { status: 400 });
    }

    console.log(`[RESUME ANALYZE] User: ${userId} | Resume chars: ${resume_text.length} | JD chars: ${job_description.length}`);

    const userPrompt = `
## JOB DESCRIPTION:
${job_description}

## CANDIDATE RESUME:
${resume_text}

Analyze this resume against the job description and provide your structured JSON response.`;

    const rawResponse = await callGroq(SYSTEM_PROMPT, userPrompt, true);
    console.log(`[RESUME ANALYZE] Groq response received`);

    let analysis: ResumeAnalysis;
    try {
      analysis = JSON.parse(rawResponse);
    } catch {
      console.error('[RESUME ANALYZE] JSON parse error:', rawResponse);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    // Store in database
    const { error: dbError } = await supabaseAdmin.from('resume_analyses').insert({
      clerk_user_id: userId,
      job_description,
      resume_text,
      match_score: analysis.match_score,
      matched_skills: analysis.matched_skills,
      missing_skills: analysis.missing_skills,
      insights: analysis.insights,
    });

    if (dbError) console.error('[RESUME ANALYZE] DB insert error:', dbError);

    return NextResponse.json({ analysis });
  } catch (err) {
    console.error('[RESUME ANALYZE] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}