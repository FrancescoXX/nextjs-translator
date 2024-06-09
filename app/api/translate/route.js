import { NextResponse } from 'next/server';

export async function POST(request) {
  const { text, source_lang, target_lang, tone } = await request.json();
  const apiKey = process.env.OPENAI_API_KEY;

  const translationPrompt = `Translate the following text from ${source_lang} to ${target_lang} with a ${tone} tone: "${text}"`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: translationPrompt }],
      max_tokens: 100,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    return NextResponse.json({ translation: data.choices[0].message.content.trim() }, { headers });
  } else {
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    return NextResponse.json({ error: 'Failed to get a valid response from OpenAI' }, { status: 500, headers });
  }
}

export async function OPTIONS() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return new Response(null, { headers });
}
