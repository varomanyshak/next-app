import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Liste des tournois filtrés par user_id
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'userId requis' }, { status: 400 });
    }

    const tournois = await prisma.tournament.findMany({
      where: {
        hidden: false,
        user_id: parseInt(userId, 10),
      },
    });

    return NextResponse.json(tournois);
  } catch (error) {
    console.error('Erreur lors de la récupération des tournois:', error);
    return NextResponse.json({ message: 'Erreur de récupération' }, { status: 500 });
  }
}

// POST - Créer un tournoi
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Récupérer l'userId depuis le frontend
    const userId = parseInt(body.userId, 10);

    if (!userId) {
      return NextResponse.json({ message: 'userId requis' }, { status: 400 });
    }

    const created = await prisma.tournament.create({
      data: {
        name: body.name,
        city: body.city,
        club: body.club,
        start_date: new Date(body.start_date),
        end_date: new Date(body.end_date),
        user_id: userId,
      },
    });

    return NextResponse.json(created);
  } catch (err) {
    console.error('Erreur POST tournoi:', err);
    return NextResponse.json({ message: 'Erreur lors de la création' }, { status: 500 });
  }
}
