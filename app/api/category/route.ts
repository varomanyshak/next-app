import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET: récupérer les catégories d'un tournoi
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tournoiId = searchParams.get('tournoiId');

  if (!tournoiId) {
    return NextResponse.json({ message: 'tournoiId requis' }, { status: 400 });
  }

  try {
    const categories = await prisma.category.findMany({
      where: {
        tournament_id: tournoiId,
        hidden: false, // 👈 Ne pas afficher les supprimées
      },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        rank: true,
        gender: true,
      },
    });


    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erreur GET catégories', error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des catégories" },
      { status: 500 }
    );
  }
}

// POST: créer une nouvelle catégorie
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, rank, gender, tournament_id, weight_category_id, age_group_id } = body;

    const newCategory = await prisma.category.create({
      data: {
        name,
        rank,
        gender,
        tournament_id,
        weight_category_id,
        age_group_id,
      },
    });

    return NextResponse.json(newCategory);
  } catch (error) {
    console.error('Erreur création catégorie:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    );
  }
}
