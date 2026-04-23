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

  return completion.choices[0]?.message?.content || '';
}