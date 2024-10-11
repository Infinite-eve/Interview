import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const interview = await prisma.interview.findUnique({
      where: { id: params.id },
    });

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    return NextResponse.json(interview);
  } catch (error) {
    console.error('Failed to fetch interview:', error);
    return NextResponse.json({ error: 'Failed to fetch interview' }, { status: 500 });
  }
}