// Fichier : app/api/competiteur/[id]/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.match(/\/competiteur\/([^\/]+)/)?.[1];

    if (!id) {
      return NextResponse.json({ message: 'ID requis' }, { status: 400 });
    }

    const data = await req.json();
    const updated = await prisma.competitor.update({
      where: { id },
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        birthday: new Date(data.birthday),
        club: data.club,
        country: data.country,
        weight: data.weight,
        rank: data.rank,
        gender: data.gender,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: 'Erreur de mise à jour' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.match(/\/competiteur\/([^\/]+)/)?.[1];

    if (!id) {
      return NextResponse.json({ message: 'ID requis' }, { status: 400 });
    }

    await prisma.competitor.update({
      where: { id },
      data: { hidden: true }, // Soft delete by setting hidden to true (1)
    });
    return NextResponse.json({ message: 'Compétiteur supprimé' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erreur lors de la suppression' }, { status: 500 });
  }
}