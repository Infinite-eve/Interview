import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, education, skills, projects, workExperience } = await req.json();

    const resume = await prisma.resume.upsert({
      where: { userId: userId },
      update: { education, skills, projects, workExperience },
      create: { userId, education, skills, projects, workExperience },
    });

    return NextResponse.json(resume);
  } catch (error) {
    console.error('Failed to update resume:', error);
    return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 });
  }
}