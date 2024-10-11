import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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