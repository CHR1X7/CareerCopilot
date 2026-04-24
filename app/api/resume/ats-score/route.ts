import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { callGroq } from '@/lib/groq';

const SYSTEM_PROMPT = `You are an ATS (Applicant Tracking System) scoring engine. Analyze the resume data and score it on ATS-friendliness.

Score based on these criteria (each out of the points shown):
- Contact info completeness (name, email, phone, location): 15 points
- Professional summary present and well-written: 15 points  
- Skills section with relevant keywords: 20 points
- Work experience with descriptions: 25 points
- Education section: 10 points
- Proper formatting (no special characters, clean text): 10 points
- Overall completeness: 5 points

Return ONLY valid JSON:
{
  "score": <integer 0-100>,
  "breakdown": {
    "contact_info": { "score": <0-15>, "feedback": "..." },
    "summary": { "score": <0-15>, "feedback": "..." },
    "skills": { "score": <0-20>, "feedback": "..." },
    "experience": { "score": <0-25>, "feedback": "..." },
    "education": { "score": <0-10>, "feedback": "..." },
    "formatting": { "score": <0-10>, "feedback": "..." },
    "completeness": { "score": <0-5>, "feedback": "..." }
  },
  "top_improvements": ["improvement1", "improvement2", "improvement3"]
}

Be accurate and realistic. An empty resume should score very low.`;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { resumeData } = await req.json();

    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data required' }, { status: 400 });
    }

    const resumeText = `
Name: ${resumeData.name || ''}
Email: ${resumeData.email || ''}
Phone: ${resumeData.phone || ''}
Location: ${resumeData.location || ''}
LinkedIn: ${resumeData.linkedin || ''}
Portfolio: ${resumeData.portfolio || ''}
Summary: ${resumeData.summary || ''}
Skills: ${(resumeData.skills || []).join(', ')}
Experience: ${JSON.stringify(resumeData.experience || [])}
Education: ${JSON.stringify(resumeData.education || [])}
    `.trim();

    const response = await callGroq(
      SYSTEM_PROMPT,
      `Score this resume for ATS compatibility:\n\n${resumeText}`,
      true
    );

    const result = JSON.parse(response);

    // Validate score
    if (typeof result.score !== 'number' || result.score < 0 || result.score > 100) {
      result.score = Math.max(0, Math.min(100, parseInt(result.score) || 0));
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[ATS-SCORE] Error:', err?.message);
    return NextResponse.json({ error: err?.message || 'Failed to calculate score' }, { status: 500 });
  }
}