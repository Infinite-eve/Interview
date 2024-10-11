import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const interviews = await prisma.interview.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, createdAt: true, audioUrl: true },
    });

    return NextResponse.json(interviews);
  } catch (error) {
    console.error('Failed to fetch interviews:', error);
    return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { interviewText } = await req.json();
  
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `分析以下面试内容并给出评价:\n\n${interviewText}`,
    max_tokens: 500,
  });

  return new Response(JSON.stringify({ analysis: response.data.choices[0].text }), {
    headers: { 'Content-Type': 'application/json' },
  });
}