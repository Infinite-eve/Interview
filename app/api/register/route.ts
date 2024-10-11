import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 检查邮箱是否已被使用
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json({ message: '该邮箱已被注册' }, { status: 400 });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: '注册成功', user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: '注册失败，请稍后再试' }, { status: 500 });
  }
}