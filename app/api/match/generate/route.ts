import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { competitors, categories, tournamentId } = await req.json();
    if (!competitors || !categories || !tournamentId) {
      return NextResponse.json({ message: 'Données manquantes (compétiteurs, catégories, tournoi)' }, { status: 400 });
    }

    // Group competitors by category (by rank + gender)
    let matchesCreated = 0;
    for (const cat of categories) {
      // Find all competitors for this category (by rank+gender, as in your frontend)
      const group = competitors.filter(
        (c: any) =>
          c.rank.toLowerCase().trim() === cat.rank.toLowerCase().trim() &&
          c.gender === cat.gender
      );

      // Generate unique pairs for this group
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          await prisma.match.create({
            data: {
              category_id: cat.id,
              tournament_id: tournamentId, // AJOUT OBLIGATOIRE !
              round: 1,
              competitor1_id: group[i].id,
              competitor2_id: group[j].id,
              score1: 0,
              score2: 0,
              status: 'pending'
            }
          });
          matchesCreated++;
        }
      }
    }

    return NextResponse.json({ success: true, matchesCreated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erreur lors de la création des matchs' }, { status: 500 });
  }
}
