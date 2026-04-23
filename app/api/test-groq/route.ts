import { NextResponse } from 'next/server';
import { callGroq } from '@/lib/groq';

export async function GET() {
  try {
    const result = await callGroq(
      'You are a helpful assistant. Always respond with valid JSON.',
      'Return this exact JSON: {"status": "working", "message": "Groq is connected"}',
      true
    );

    return NextResponse.json({
      success: true,
      groq_key_exists: !!process.env.GROQ_API_KEY,
      groq_key_prefix: process.env.GROQ_API_KEY?.substring(0, 10),
      result: JSON.parse(result),
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      groq_key_exists: !!process.env.GROQ_API_KEY,
      groq_key_prefix: process.env.GROQ_API_KEY?.substring(0, 10),
      error: err?.message,
      error_status: err?.status,
      error_type: err?.error?.type,
    });
  }
}