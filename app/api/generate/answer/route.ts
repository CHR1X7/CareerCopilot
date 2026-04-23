import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { callGroq } from '@/lib/groq';

const SYSTEM_PROMPT = `You are an expert career coach who helps candidates craft compelling, authentic answers to job application questions.

You have access to the candidate's profile and the job description. Your goal is to generate personalized, genuine answers that:
1. Highlight the candidate's relevant experience
2. Match the company's values and role requirements  
3. Are specific, not generic
4. Sound human and authentic, not robotic

You MUST respond with a valid JSON object:
{
  "answers": [
    {
      "question": "<the question asked>",
      "answer": "<200-400 word compelling answer>",
      "tips": ["<tip1>", "<tip2>", "<tip3>"]
    }
  ]
}`;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { job_description, questions } = await req.json();

    if (!job_description || !questions?.length) {
      return NextResponse.json({ error: 'Job description and questions are required' }, { status: 400 });
    }

    // Get user profile for personalization
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();

    const profileSummary = profile ? `
Name: ${profile.full_name}
Summary: ${profile.summary}
Skills: ${profile.skills?.join(', ')}
Work History: ${JSON.stringify(profile.work_history?.slice(0, 3))}
Education: ${JSON.stringify(profile.education?.slice(0, 2))}
` : 'Profile not available';

    const userPrompt = `
## CANDIDATE PROFILE:
${profileSummary}

## JOB DESCRIPTION:
${job_description}

## QUESTIONS TO ANSWER:
${questions.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n')}

Generate compelling, personalized answers for each question.`;

    console.log(`[ANSWER GEN] User: ${userId} | Questions: ${questions.length}`);

    const rawResponse = await callGroq(SYSTEM_PROMPT, userPrompt, true);
    const parsed = JSON.parse(rawResponse);

    return NextResponse.json({ answers: parsed.answers });
  } catch (err) {
    console.error('[ANSWER GEN] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}