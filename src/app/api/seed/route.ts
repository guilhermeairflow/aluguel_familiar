import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function GET() {
  try {
    const email = 'admin@aluguelfamiliar.com';
    const password = 'AluguelFamiliar@2026';
    
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      return NextResponse.json({ message: 'Usuário já existe' }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: 'Administrador',
        email,
        passwordHash: hashedPassword,
        role: 'ADMIN'
      }
    });

    return NextResponse.json({ message: 'Usuário administrador criado com sucesso', user: { email: user.email } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
