import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await prisma.weightCategory.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur fetch weightCategory', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
