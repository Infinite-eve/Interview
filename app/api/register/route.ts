import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: '用户创建成功', user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    return NextResponse.json({ message: '用户创建失败' }, { status: 500 });
  }
}