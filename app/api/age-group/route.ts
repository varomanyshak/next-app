// Fichier : app/api/age-group/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await prisma.ageGroup.findMany();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Erreur de récupération' }, { status: 500 });
  }
}
