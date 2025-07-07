import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const tournoi = await prisma.tournament.findUnique({
      where: { id: String(id) },
    });
    return res.status(200).json(tournoi);
  }

  if (req.method === 'PUT') {
    const data = req.body;
    const tournoi = await prisma.tournament.update({
      where: { id: String(id) },
      data,
    });
    return res.status(200).json(tournoi);
  }

  return res.status(405).json({ message: 'Méthode non autorisée' });
}
