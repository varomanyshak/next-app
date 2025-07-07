import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const data = await req.json();

    const updated = await prisma.category.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur PUT /api/category/[id]", error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
