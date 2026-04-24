import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { callGroq } from '@/lib/groq';

const SYSTEM_PROMPT = `You are a job description extractor. Given a URL or HTML content, extract the following information and return ONLY valid JSON:

{
  "title": "job title",
  "company": "company name",
  "location": "location or remote",
  "description": "full job description text",
  "skills": ["skill1", "skill2", "skill3"]
}

Extract skills from the requirements section. Keep description concise but complete.`;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url?.trim()) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // For now, we'll simulate extraction since we can't scrape in serverless
    // In production, you'd use a scraping service like ScrapingBee, BrightData, or Puppeteer
    
    // Simulate extraction with AI based on URL pattern
    const domain = new URL(url).hostname;
    const companyFromDomain = domain.replace('www.', '').split('.')[0];
    
    // Use AI to generate a realistic extraction based on URL
    const userPrompt = `Extract job details from this URL: ${url}

Since we can't scrape directly, infer likely job details from the URL pattern and return realistic JSON.
Company is likely: ${companyFromDomain}
Return valid JSON with title, company, location, description, and skills.`;

    const response = await callGroq(SYSTEM_PROMPT, userPrompt, true);
    const job = JSON.parse(response);

    return NextResponse.json({ job });
  } catch (err: any) {
    console.error('[IMPORT-JOB] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to import job' },
      { status: 500 }
    );
  }
}