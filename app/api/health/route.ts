import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabase_anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabase_service: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    clerk_publishable: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    clerk_secret: !!process.env.CLERK_SECRET_KEY,
    groq: !!process.env.GROQ_API_KEY,
    // Show partial values to verify they're correct
    supabase_url_value: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
    node_env: process.env.NODE_ENV,
  };

  const allGood = checks.supabase_url &&
    checks.supabase_anon &&
    checks.supabase_service &&
    checks.clerk_publishable &&
    checks.clerk_secret;

  return NextResponse.json({
    status: allGood ? 'healthy' : 'missing env vars',
    checks,
  });
}