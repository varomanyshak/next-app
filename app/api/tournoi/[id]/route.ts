import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// ✅ PUT: Update a tournament by ID
export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
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
        // Optional field
        ...(data.user_id && { user_id: Number(data.user_id) }),
      },
    });

    return NextResponse.json(updatedTournoi);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

// ✅ DELETE: Soft delete a tournament by ID
export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ message: 'ID requis' }, { status: 400 });
    }

    await prisma.tournament.update({
      where: { id },
      data: { hidden: true }, // 👈 Soft delete
    });

    return NextResponse.json({ message: 'Tournoi marqué comme supprimé' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erreur de suppression' }, { status: 500 });
  }
}
