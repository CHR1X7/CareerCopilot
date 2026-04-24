import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { callGroq } from '@/lib/groq';

const SYSTEM_PROMPT = `You are an expert job posting analyzer. You will receive the HTML/text content of a job posting page. Extract the following information accurately:

Return ONLY valid JSON:
{
  "title": "exact job title from the posting",
  "company": "exact company name",
  "location": "exact location or Remote",
  "job_type": "Full-time/Part-time/Contract/Internship",
  "salary": "salary range if mentioned, otherwise null",
  "description": "the FULL job description including responsibilities, requirements, qualifications - preserve all details",
  "skills": ["skill1", "skill2"],
  "experience_level": "Entry/Mid/Senior/Lead",
  "apply_url": "application URL if found, otherwise null"
}

Rules:
- Extract REAL data from the content, do NOT make anything up
- If a field is not found in the content, use null
- For skills, extract from requirements/qualifications sections
- Keep the full description text, don't summarize
- Do not invent or guess information not present in the text`;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url, manualContent } = await req.json();

    let pageContent = manualContent || '';

    // If URL provided, try to fetch the page
    if (url?.trim() && !manualContent) {
      try {
        new URL(url);
      } catch {
        return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
      }

      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
          },
          redirect: 'follow',
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          // Can't fetch - ask user to paste content manually
          return NextResponse.json({
            error: 'Could not access this URL directly. Please paste the job description text instead.',
            needsManualInput: true,
          }, { status: 422 });
        }

        const html = await response.text();

        // Strip HTML tags but keep text content
        pageContent = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
          .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
          .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/\s+/g, ' ')
          .trim();
      } catch (fetchErr: any) {
        return NextResponse.json({
          error: 'Could not fetch this URL. The site may block automated access. Please paste the job description text instead.',
          needsManualInput: true,
        }, { status: 422 });
      }
    }

    if (!pageContent || pageContent.length < 50) {
      return NextResponse.json({
        error: 'No content to analyze. Please paste the job description text.',
        needsManualInput: true,
      }, { status: 400 });
    }

    // Truncate to fit in context window
    const truncated = pageContent.substring(0, 6000);

    console.log(`[IMPORT-JOB] Content length: ${truncated.length}`);

    const userPrompt = `Extract job posting details from this page content:\n\n${truncated}`;

    const rawResponse = await callGroq(SYSTEM_PROMPT, userPrompt, true);

    let job;
    try {
      job = JSON.parse(rawResponse);
    } catch {
      return NextResponse.json({ error: 'Failed to parse extracted data' }, { status: 500 });
    }

    // Validate - don't return if nothing meaningful was extracted
    if (!job.title && !job.company && !job.description) {
      return NextResponse.json({
        error: 'Could not extract job details. Please paste the full job description text instead.',
        needsManualInput: true,
      }, { status: 422 });
    }

    return NextResponse.json({ job });
  } catch (err: any) {
    console.error('[IMPORT-JOB] Error:', err?.message);
    return NextResponse.json(
      { error: err?.message || 'Failed to import job' },
      { status: 500 }
    );
  }
}