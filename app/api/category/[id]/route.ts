import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// PUT: update category by ID
export async function PUT(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.match(/\/category\/([^\/]+)/)?.[1];

    if (!id) {
      return NextResponse.json({ message: 'ID requis' }, { status: 400 });
    }
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ message: 'ID invalide' }, { status: 400 });
    }

    const body = await req.json();
    const { name, rank, gender, tournament_id, weight_category_id, age_group_id } = body;

    const updatedCategory = await prisma.category.update({
      where: { id: numericId },
      data: {
        name,
        rank,
        gender,
        tournament_id,
        weight_category_id,
        age_group_id,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Erreur mise à jour catégorie:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la catégorie' },
      { status: 500 }
    );
  }
}

// DELETE: delete category by ID
export async function DELETE(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.match(/\/category\/([^\/]+)/)?.[1];

    if (!id) {
      return NextResponse.json({ message: 'ID requis' }, { status: 400 });
    }
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ message: 'ID invalide' }, { status: 400 });
    }

    // Soft delete (update `hidden` to true)
    const deletedCategory = await prisma.category.update({
      where: { id: numericId },
      data: { hidden: true },
    });

    return NextResponse.json(deletedCategory);
  } catch (error) {
    console.error('Erreur suppression catégorie:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la suppression de la catégorie' },
      { status: 500 }
    );
  }
}
