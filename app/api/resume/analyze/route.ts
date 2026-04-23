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
  "matched_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "overall_assessment": "<2-3 sentence summary>",
  "insights": [
    {
      "category": "Skills",
      "title": "<short title>",
      "description": "<detailed explanation>",
      "priority": "high",
      "action": "<specific actionable step>"
    }
  ]
}

Rules:
- match_score must be a number between 0 and 100
- matched_skills and missing_skills must be arrays of strings
- insights must have at least 5 items
- priority must be exactly "high", "medium", or "low"
- Do not include any text outside the JSON object
- Do not use markdown code blocks`;

export async function POST(req: NextRequest) {
  console.log('[RESUME ANALYZE] Request received');

  try {
    const { userId } = await auth();
    if (!userId) {
      console.log('[RESUME ANALYZE] Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { resume_text, job_description } = body;

    console.log('[RESUME ANALYZE] Resume length:', resume_text?.length);
    console.log('[RESUME ANALYZE] JD length:', job_description?.length);

    if (!resume_text || !job_description) {
      return NextResponse.json(
        { error: 'Resume text and job description are required' },
        { status: 400 }
      );
    }

    if (resume_text.length < 50) {
      return NextResponse.json(
        { error: 'Resume text is too short. Please paste more content.' },
        { status: 400 }
      );
    }

    if (job_description.length < 50) {
      return NextResponse.json(
        { error: 'Job description is too short. Please paste more content.' },
        { status: 400 }
      );
    }

    console.log('[RESUME ANALYZE] Calling Groq...');

    const userPrompt = `
## JOB DESCRIPTION:
${job_description.substring(0, 3000)}

## CANDIDATE RESUME:
${resume_text.substring(0, 3000)}

Analyze this resume against the job description. Return ONLY a valid JSON object with no markdown formatting.`;

    let rawResponse = '';
    try {
      rawResponse = await callGroq(SYSTEM_PROMPT, userPrompt, true);
      console.log('[RESUME ANALYZE] Groq response length:', rawResponse?.length);
      console.log('[RESUME ANALYZE] Groq response preview:', rawResponse?.substring(0, 200));
    } catch (groqErr: any) {
      console.error('[RESUME ANALYZE] Groq call failed:', groqErr?.message);
      return NextResponse.json(
        { error: `AI service error: ${groqErr?.message || 'Unknown Groq error'}` },
        { status: 500 }
      );
    }

    if (!rawResponse) {
      return NextResponse.json(
        { error: 'AI returned empty response' },
        { status: 500 }
      );
    }

    // Clean response — remove markdown if present
    let cleanedResponse = rawResponse.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    }
    if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    console.log('[RESUME ANALYZE] Parsing JSON...');

    let analysis: ResumeAnalysis;
    try {
      analysis = JSON.parse(cleanedResponse);
    } catch (parseErr: any) {
      console.error('[RESUME ANALYZE] JSON parse error:', parseErr?.message);
      console.error('[RESUME ANALYZE] Raw response was:', rawResponse);
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    // Validate the response structure
    if (typeof analysis.match_score !== 'number') {
      analysis.match_score = parseInt(String(analysis.match_score)) || 50;
    }

    if (!Array.isArray(analysis.matched_skills)) {
      analysis.matched_skills = [];
    }

    if (!Array.isArray(analysis.missing_skills)) {
      analysis.missing_skills = [];
    }

    if (!Array.isArray(analysis.insights)) {
      analysis.insights = [];
    }

    if (!analysis.overall_assessment) {
      analysis.overall_assessment = 'Analysis complete.';
    }

    console.log('[RESUME ANALYZE] Match score:', analysis.match_score);
    console.log('[RESUME ANALYZE] Insights count:', analysis.insights.length);

    // Store in database — don't crash if this fails
    try {
      const { error: dbError } = await supabaseAdmin
        .from('resume_analyses')
        .insert({
          clerk_user_id: userId,
          job_description: job_description.substring(0, 5000),
          resume_text: resume_text.substring(0, 5000),
          match_score: analysis.match_score,
          matched_skills: analysis.matched_skills,
          missing_skills: analysis.missing_skills,
          insights: analysis.insights,
        });

      if (dbError) {
        console.error('[RESUME ANALYZE] DB insert error (non-fatal):', dbError);
      }
    } catch (dbErr) {
      console.error('[RESUME ANALYZE] DB error (non-fatal):', dbErr);
    }

    console.log('[RESUME ANALYZE] Success!');
    return NextResponse.json({ analysis });
  } catch (err: any) {
    console.error('[RESUME ANALYZE] Unexpected error:', err?.message, err?.stack);
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}