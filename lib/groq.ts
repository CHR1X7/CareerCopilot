import Groq from 'groq-sdk';

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export const GROQ_MODEL = 'llama-3.3-70b-versatile';

export async function callGroq(
  systemPrompt: string,
  userPrompt: string,
  jsonMode = true
): Promise<string> {
  console.log('[GROQ] Calling model:', GROQ_MODEL);
  console.log('[GROQ] API key exists:', !!process.env.GROQ_API_KEY);
  console.log('[GROQ] JSON mode:', jsonMode);

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      ...(jsonMode && { response_format: { type: 'json_object' } }),
    });

    const content = completion.choices[0]?.message?.content;
    console.log('[GROQ] Response received, length:', content?.length);

    if (!content) {
      throw new Error('Groq returned empty content');
    }

    return content;
  } catch (err: any) {
    console.error('[GROQ] Error:', err?.message);
    console.error('[GROQ] Error status:', err?.status);
    console.error('[GROQ] Error type:', err?.error?.type);
    throw err;
  }
}