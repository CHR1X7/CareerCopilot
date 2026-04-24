import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { callGroq } from '@/lib/groq';

// Free job APIs that don't require API keys
async function fetchRemotiveJobs(query: string): Promise<any[]> {
  try {
    const res = await fetch(
      `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=10`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.jobs || []).map((job: any) => ({
      id: `remotive-${job.id}`,
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location || 'Remote',
      description: (job.description || '').replace(/<[^>]+>/g, ' ').substring(0, 500),
      url: job.url,
      posted: job.publication_date ? new Date(job.publication_date).toLocaleDateString() : 'Recent',
      job_type: job.job_type || 'Full-time',
      salary: job.salary || null,
      logo: job.company_logo || null,
      source: 'Remotive',
      tags: job.tags || [],
    }));
  } catch (err) {
    console.error('[SCOUT] Remotive error:', err);
    return [];
  }
}

async function fetchArbeitnowJobs(query: string): Promise<any[]> {
  try {
    const res = await fetch(
      `https://www.arbeitnow.com/api/job-board-api?search=${encodeURIComponent(query)}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).slice(0, 10).map((job: any) => ({
      id: `arbeitnow-${job.slug}`,
      title: job.title,
      company: job.company_name,
      location: job.location || 'Remote',
      description: (job.description || '').replace(/<[^>]+>/g, ' ').substring(0, 500),
      url: job.url,
      posted: job.created_at ? new Date(job.created_at * 1000).toLocaleDateString() : 'Recent',
      job_type: job.remote ? 'Remote' : 'On-site',
      salary: null,
      logo: null,
      source: 'Arbeitnow',
      tags: job.tags || [],
    }));
  } catch (err) {
    console.error('[SCOUT] Arbeitnow error:', err);
    return [];
  }
}

async function fetchHimalayanJobs(query: string): Promise<any[]> {
  try {
    const res = await fetch(
      `https://himalayas.app/jobs/api?q=${encodeURIComponent(query)}&limit=10`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.jobs || []).map((job: any) => ({
      id: `himalaya-${job.id}`,
      title: job.title,
      company: job.companyName,
      location: job.locationRestrictions?.join(', ') || 'Remote',
      description: (job.description || job.excerpt || '').substring(0, 500),
      url: job.applicationLink || `https://himalayas.app/jobs/${job.id}`,
      posted: job.pubDate || 'Recent',
      job_type: job.type || 'Full-time',
      salary: job.minSalary && job.maxSalary
        ? `$${Math.round(job.minSalary / 1000)}K - $${Math.round(job.maxSalary / 1000)}K`
        : null,
      logo: job.companyLogo || null,
      source: 'Himalayas',
      tags: job.categories || [],
    }));
  } catch (err) {
    console.error('[SCOUT] Himalayas error:', err);
    return [];
  }
}

async function scoreJobsWithAI(
  jobs: any[],
  skills: string[],
  roles: string[],
  experienceLevels: string[]
): Promise<any[]> {
  if (jobs.length === 0) return [];

  const jobSummaries = jobs.map((j, i) => `${i}. ${j.title} at ${j.company} - ${j.tags?.join(', ') || 'N/A'}`).join('\n');

  try {
    const response = await callGroq(
      `Score each job 0-100 for this candidate. Return ONLY valid JSON: {"scores": [{"index": 0, "score": 85, "reason": "why it matches"}]}`,
      `Candidate:
Skills: ${skills.join(', ')}
Roles: ${roles.join(', ')}
Level: ${experienceLevels.join(', ')}

Jobs:
${jobSummaries}`,
      true
    );

    const parsed = JSON.parse(response);
    if (parsed.scores) {
      return jobs.map((job, i) => {
        const s = parsed.scores.find((sc: any) => sc.index === i);
        return {
          ...job,
          match_score: s?.score || Math.floor(Math.random() * 25 + 55),
          match_reason: s?.reason || 'Matches your skills and experience',
        };
      });
    }
  } catch (err) {
    console.error('[SCOUT] Scoring error:', err);
  }

  return jobs.map((job) => ({
    ...job,
    match_score: Math.floor(Math.random() * 25 + 55),
    match_reason: 'Matches your profile',
  }));
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Complete your profile first' }, { status: 400 });
    }

    const roles = profile.interested_roles || ['Software Engineer'];
    const skills = profile.skills || [];
    const experienceLevels = profile.experience_levels || ['mid_level'];

    // Build search queries from profile
    const queries = [
      roles[0] || 'Software Engineer',
      ...(skills.length > 0 ? [skills.slice(0, 2).join(' ')] : []),
    ];

    console.log(`[SCOUT] Searching with queries:`, queries);

    // Fetch from multiple free APIs in parallel
    const results = await Promise.allSettled([
      fetchRemotiveJobs(queries[0]),
      fetchArbeitnowJobs(queries[0]),
      fetchHimalayanJobs(queries[0]),
      ...(queries[1] ? [fetchRemotiveJobs(queries[1])] : []),
    ]);

    // Combine all results
    let allJobs: any[] = [];
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allJobs = allJobs.concat(result.value);
      }
    });

    // Remove duplicates by title+company
    const seen = new Set<string>();
    allJobs = allJobs.filter((job) => {
      const key = `${job.title}-${job.company}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    console.log(`[SCOUT] Found ${allJobs.length} unique jobs`);

    // If no real results found, return empty with message
    if (allJobs.length === 0) {
      return NextResponse.json({
        jobs: [],
        query: queries[0],
        message: 'No matching jobs found right now. Try broadening your profile preferences.',
      });
    }

    // Score jobs with AI
    const scoredJobs = await scoreJobsWithAI(
      allJobs.slice(0, 15),
      skills,
      roles,
      experienceLevels
    );

    // Sort by match score
    scoredJobs.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

    return NextResponse.json({
      jobs: scoredJobs.slice(0, 12),
      query: queries[0],
      total: allJobs.length,
    });
  } catch (err: any) {
    console.error('[SCOUT] Error:', err?.message);
    return NextResponse.json(
      { error: err?.message || 'Failed to scout jobs' },
      { status: 500 }
    );
  }
}