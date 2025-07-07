// pages/api/tournoi/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { name, city, club, start_date, end_date } = req.body;

    try {
      const tournoi = await prisma.tournament.update({
        where: { id: String(id) },
        data: {
          name,
          city,
          club,
          start_date: new Date(start_date),
          end_date: new Date(end_date),
        },
      });

      res.status(200).json(tournoi);
    } catch (error) {
      console.error('Erreur de mise à jour :', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.tournament.delete({
        where: { id: String(id) },
      });

      res.status(204).end();
    } catch (error) {
      console.error('Erreur suppression :', error);
      res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
