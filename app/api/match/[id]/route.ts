// /app/api/match/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust if you use another DB setup

export async function PATCH(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);
    const matchId = pathname.match(/\/match\/([^\/]+)/)?.[1];

    if (!matchId) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const { score1, score2, winnerId } = await req.json();

    // Fetch the match to get context
    const match = await prisma.match.findUnique({
      where: { id: Number(matchId) },
    });
    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Update the match as finished
    await prisma.match.update({
      where: { id: Number(matchId) },
      data: {
        score1,
        score2,
        winner_id: winnerId,
        status: "finished",
      },
    });

    // Check for any match with competitor2_id empty (null) in the same tournament and round, except the current match
    const existingRows = await prisma.match.findMany({
      where: {
        tournament_id: match.tournament_id,
        round: match.round,
        competitor2_id: null,
        NOT: { id: Number(matchId) },
      },
    });

    if (winnerId) {
      if (existingRows.length > 0) {
        // If found, set competitor2_id to winnerId in the first found row
        await prisma.match.update({
          where: { id: existingRows[0].id },
          data: { competitor2_id: winnerId },
        });
      } else {
        // If no such row exists, create a new match row with competitor1_id = winnerId and round + 1
        await prisma.match.create({
          data: {
            tournament_id: match.tournament_id,
            category_id: match.category_id,
            round: match.round + 1,
            competitor1_id: winnerId,
            // other fields can be set as needed, e.g. status: 'pending'
          },
        });
      }
    }

    // Find two rows in the same tournament and round with competitor2_id null (i.e., only competitor1_id filled)
    const candidates = await prisma.match.findMany({
      where: {
        tournament_id: match.tournament_id,
        round: match.round + 1, // Next round
        competitor2_id: null,
      },
      orderBy: { id: 'asc' },
      take: 2,
    });

    if (candidates.length === 2) {
      // Create a new match row with both competitor1_id and competitor2_id from the two candidates
      await prisma.match.create({
        data: {
          tournament_id: match.tournament_id,
          category_id: match.category_id,
          round: match.round + 1, // Use next round, not next-next round
          competitor1_id: candidates[0].competitor1_id,
          competitor2_id: candidates[1].competitor1_id,
          // other fields as needed
        },
      });
      // Delete the two original rows with empty competitor2_id
      await prisma.match.delete({ where: { id: candidates[0].id } });
      await prisma.match.delete({ where: { id: candidates[1].id } });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
