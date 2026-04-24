import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { callGroq } from '@/lib/groq';

const SYSTEM_PROMPT = `You are an expert career coach. Analyze the job description and identify the most likely application and interview questions this company would ask candidates.

Return ONLY a valid JSON object with no markdown:
{
  "questions": [
    "question 1",
    "question 2"
  ]
}

Return 6-8 highly relevant, specific questions based on the role requirements.`;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { job_description } = await req.json();

    if (!job_description?.trim()) {
      return NextResponse.json(
        { error: 'Job description required' },
        { status: 400 }
      );
    }

    const response = await callGroq(
      SYSTEM_PROMPT,
      `Analyze this job description and return relevant questions:\n\n${job_description.substring(0, 3000)}`,
      true
    );

    const parsed = JSON.parse(response);
    return NextResponse.json({ questions: parsed.questions || [] });
  } catch (err: any) {
    console.error('[QUESTIONS] Error:', err?.message);
    return NextResponse.json(
      { error: err?.message || 'Failed to extract questions' },
      { status: 500 }
    );
  }
}