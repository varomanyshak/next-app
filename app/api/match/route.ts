// app/api/match/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const matchId = url.searchParams.get("matchId");
  const tournamentId = url.searchParams.get("tournamentId");

  if (matchId) {
    // Get a specific match
    const match = await prisma.match.findUnique({
      where: { id: Number(matchId) }
    });
    if (!match) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(match);
  }

  if (tournamentId) {
    // Return all matches for the tournament
    const matches = await prisma.match.findMany({
      where: { tournament_id: tournamentId }
    });
    return NextResponse.json(matches);
  }

  return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
}
