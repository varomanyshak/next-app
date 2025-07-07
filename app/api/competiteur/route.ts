import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Liste des compétiteurs de l'utilisateur connecté
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'userId requis' }, { status: 400 });
    }

    const competiteurs = await prisma.competitor.findMany({
      where: {
        hidden: false,
        user_id: parseInt(userId, 10),
      },
      orderBy: {
        lastname: 'asc',
      },
    });

    return NextResponse.json(competiteurs);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération' },
      { status: 500 }
    );
  }
}

// POST - Création d’un nouveau compétiteur
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstname, lastname, birthday, club, country, weight, rank, gender, userId } = body;

    if (!userId) {
      return NextResponse.json({ message: 'userId requis' }, { status: 400 });
    }

    const newCompetitor = await prisma.competitor.create({
      data: {
        firstname,
        lastname,
        birthday: new Date(birthday),
        club,
        country,
        weight: parseInt(weight, 10),
        rank,
        gender,
        user_id: parseInt(userId, 10),
        hidden: false,
      },
    });

    return NextResponse.json(newCompetitor);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erreur lors de l'ajout du compétiteur" },
      { status: 500 }
    );
  }
}

// PUT - Soft delete d’un compétiteur (hidden = true)
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'id requis' }, { status: 400 });
    }

    const body = await req.json();

    const updatedCompetitor = await prisma.competitor.update({
      where: { id },
      data: {
        hidden: body.hidden === true || body.hidden === 'true',
      },
    });

    return NextResponse.json(updatedCompetitor);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du compétiteur' },
      { status: 500 }
    );
  }
}
