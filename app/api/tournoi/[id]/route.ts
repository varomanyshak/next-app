import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ message: 'ID requis' }, { status: 400 });
    }
    const data = await request.json();

    const updatedTournoi = await prisma.tournament.update({
      where: { id },
      data: {
        name: data.name,
        city: data.city,
        club: data.club,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        // This ensures Prisma doesn't fail if `user_id` is required
        ...(data.user_id && { user_id: Number(data.user_id) }),
      },
    });

    return NextResponse.json(updatedTournoi);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const id = pathname.match(/\/tournoi\/([^\/]+)/)?.[1];

    if (!id) {
      return NextResponse.json({ message: 'ID requis' }, { status: 400 });
    }

    await prisma.tournament.update({
      where: { id },
      data: { hidden: true }, // 👈 suppression logique
    });
    return NextResponse.json({ message: 'Tournoi marqué comme supprimé' });
  } catch (error) {
    return NextResponse.json({ message: 'Erreur de suppression' }, { status: 500 });
  }
}
