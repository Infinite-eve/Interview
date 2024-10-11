import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 保存文件到服务器
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(filepath, buffer);

    // 创建新的面试记录
    const interview = await prisma.interview.create({
      data: {
        userId: userId,
        audioUrl: `/uploads/${filename}`,
      },
    });

    // 触发AI分析
    fetch(`${process.env.NEXTAUTH_URL}/api/analyze/${interview.id}`, { method: 'POST' });

    return NextResponse.json({ message: 'File uploaded successfully', interviewId: interview.id });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};