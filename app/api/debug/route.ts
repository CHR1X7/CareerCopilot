import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        authenticated: false,
        userId: null,
        profile: null,
        error: 'Not authenticated',
      });
    }

    const { data: profile, error: dbError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();

    return NextResponse.json({
      authenticated: true,
      userId,
      profile,
      dbError: dbError?.message || null,
      onboarding_completed: profile?.onboarding_completed ?? false,
    });
  } catch (err: any) {
    return NextResponse.json({
      authenticated: false,
      error: err?.message || 'Unknown error',
    });
  }
}