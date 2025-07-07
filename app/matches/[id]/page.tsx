"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Match {
  id: number;
  round: number;
  competitor1_id: string;
  competitor2_id: string;
  winner_id?: string;
}

interface Competitor {
  id: string;
  firstname: string;
  lastname: string;
}

export default function MatchesBracket() {
  const { id: tournamentId } = useParams() as { id: string };
  const [matches, setMatches] = useState<Match[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const matchesRes = await fetch(`/api/match?tournamentId=${tournamentId}`);
      const matchesData = matchesRes.ok ? await matchesRes.json() : [];
      setMatches(matchesData);

      const competitorsRes = await fetch(`/api/competiteur?userId=1`);
      const competitorsData = competitorsRes.ok ? await competitorsRes.json() : [];
      setCompetitors(competitorsData);
    }
    fetchData();
  }, [tournamentId]);

  function getName(id?: string) {
    if (!id) return "";
    const found = competitors.find((c) => c.id === id);
    return found ? `${found.firstname} ${found.lastname}` : "";
  }

  const roundCount = Math.max(...matches.map((m) => m.round), 1);

  const matchesByRound: { [key: number]: Match[] } = {};
  matches.forEach((m) => {
    if (!matchesByRound[m.round]) matchesByRound[m.round] = [];
    matchesByRound[m.round].push(m);
  });

  return (
    <div
      className="bracket-container"
      style={{
        display: "flex",
        padding: "40px",
        background: "#f4f5f6",
        borderRadius: 32,
        justifyContent: "center",
        gap: "56px",
        overflowX: "auto",
      }}
    >
      {Array.from({ length: roundCount }, (_, r) => {
        const round = r + 1;
        const matchesInRound = matchesByRound[round] || [];
        const seenNames = new Set<string>();

        const cells = matchesInRound.flatMap((match, i) => {
          const name1 = getName(match.competitor1_id);
          const name2 = getName(match.competitor2_id);
          const cellArr = [];

          if (name1 && !seenNames.has(name1)) {
            seenNames.add(name1);
            cellArr.push(
              <div
                key={`r${round}-m${i}-c1`}
                className="bracket-cell"
                onClick={() => match.competitor1_id && router.push(`/remote/${tournamentId}/${match.id}`)}
              >
                {name1}
              </div>
            );
          }

          if (name2 && !seenNames.has(name2)) {
            seenNames.add(name2);
            cellArr.push(
              <div
                key={`r${round}-m${i}-c2`}
                className="bracket-cell"
                onClick={() => match.competitor2_id && router.push(`/remote/${tournamentId}/${match.id}`)}
              >
                {name2}
              </div>
            );
          }

          return cellArr;
        });

        return (
          <div
            key={`round-${round}`}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px", // spacing between names
              minWidth: 240,
            }}
          >
            {cells}
          </div>
        );
      })}

      <style jsx>{`
        .bracket-cell {
          width: 220px;
          height: 50px;
          border-radius: 16px;
          font-weight: 600;
          font-size: 1.1rem;
          background: #232328;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px #0001;
          transition: background 0.18s;
          cursor: pointer;
        }
        .bracket-cell:hover {
          background: #32323a;
        }
      `}</style>
    </div>
  );
}
