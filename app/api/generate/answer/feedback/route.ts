import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { answer_id, feedback, edited_answer } = await req.json()

    const updates: any = {}
    if (feedback !== undefined) updates.feedback = feedback
    if (edited_answer !== undefined) updates.user_edited_answer = edited_answer

    const { error } = await supabaseAdmin
      .from('generated_answers')
      .update(updates)
      .eq('id', answer_id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}