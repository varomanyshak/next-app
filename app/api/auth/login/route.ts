import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: { username: body.username },
    });

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Mot de passe incorrect' }, { status: 401 });
    }

    // Renvoie l'ID et le username
    return NextResponse.json({
      id: user.id,
      username: user.username,
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json({ message: 'Erreur interne' }, { status: 500 });
  }
}
