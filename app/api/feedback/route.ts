import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { feature, rating, context } = await req.json();

    const { error } = await supabaseAdmin.from('feedback').insert({
      clerk_user_id: userId,
      feature,
      rating,
      context: context || {},
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('[FEEDBACK] DB error:', error);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to save feedback' },
      { status: 500 }
    );
  }
}