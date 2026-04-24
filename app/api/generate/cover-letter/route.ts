import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { callGroq } from '@/lib/groq';

const SYSTEM_PROMPT = `You are an expert career coach who writes compelling, personalized cover letters.

Write a professional cover letter that:
- Is 250-400 words
- Addresses the hiring manager by name if provided
- Highlights relevant experience from the candidate's profile
- Matches the job requirements specifically
- Sounds authentic and human, not generic
- Ends with a call to action

Return ONLY the cover letter text, no markdown, no JSON.`;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { job_description, company_name, hiring_manager, profile } = await req.json();

    if (!job_description?.trim()) {
      return NextResponse.json({ error: 'Job description required' }, { status: 400 });
    }

    const profileSummary = profile ? `
Candidate: ${profile.full_name || ''}
Summary: ${profile.summary || ''}
Skills: ${(profile.skills || []).join(', ')}
Experience: ${JSON.stringify(profile.work_history?.slice(0, 2))}
` : 'Profile not available';

    const userPrompt = `Write a cover letter for this position:

Company: ${company_name || 'the company'}
Hiring Manager: ${hiring_manager || 'Hiring Manager'}

Job Description:
${job_description.substring(0, 2500)}

Candidate Profile:
${profileSummary}

Write a compelling, personalized cover letter.`;

    const coverLetter = await callGroq(SYSTEM_PROMPT, userPrompt, false);

    return NextResponse.json({ cover_letter: coverLetter });
  } catch (err: any) {
    console.error('[COVER-LETTER] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}