import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      ...(data.user_id && { user_id: Number(data.user_id) }),
    },
  });

  return NextResponse.json(updatedTournoi);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ message: 'ID requis' }, { status: 400 });
  }

  await prisma.tournament.update({
    where: { id },
    data: { hidden: true },
  });

  return NextResponse.json({ message: 'Tournoi marqué comme supprimé' });
}
