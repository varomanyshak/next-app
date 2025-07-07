"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

interface Match {
  id: number;
  competitor1_id: string;
  competitor2_id: string;
  round?: number;
}

interface Competitor {
  id: string;
  firstname: string;
  lastname: string;
}

export default function RemoteControlPage() {
  const { matchId } = useParams() as { tournamentId: string; matchId: string };
  // const router = useRouter();

  const [match, setMatch] = useState<Match | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  const [time, setTime] = useState(180);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch match and competitors
  useEffect(() => {
    async function fetchData() {
      const matchRes = await fetch(`/api/match?matchId=${matchId}`);
      if (matchRes.ok) {
        const data = await matchRes.json();
        setMatch(data);
      }
      const compRes = await fetch(`/api/competiteur?userId=1`);
      if (compRes.ok) {
        const data = await compRes.json();
        setCompetitors(data);
      }
    }
    fetchData();
  }, [matchId]);

  const getCompetitorName = (id: string) => {
    const comp = competitors.find(c => c.id === id);
    return comp ? `${comp.firstname} ${comp.lastname}` : "Unknown";
  };

  // Timer logic
  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, time]);

  const formatTime = (t: number) =>
    `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;

  // BroadcastChannel for real-time sync
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    channelRef.current = new BroadcastChannel(`match-${matchId}`);
    return () => {
      channelRef.current?.close();
    };
  }, [matchId]);

  // Broadcast timer, running state, and scores whenever they change
  useEffect(() => {
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: "timer-update",
        time,
        isRunning,
        score1,
        score2,
      });
    }
  }, [time, isRunning, score1, score2]);

  if (!match || competitors.length === 0) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#222225]">
      {/* Player 1 */}
      <div className="flex items-center bg-[#2e2e31] rounded-lg p-5 mb-4 w-[600px] shadow-md">
        <div className="flex-1">
          <div className="font-bold text-white text-lg">{getCompetitorName(match.competitor1_id)}</div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white font-bold text-lg w-8 h-8 rounded" onClick={() => setScore1(s => s + 1)}>+</button>
          <span className="text-2xl text-white">{score1}</span>
          <button className="bg-blue-600 text-white font-bold text-lg w-8 h-8 rounded" onClick={() => setScore1(s => (s > 0 ? s - 1 : 0))}>-</button>
        </div>
      </div>

      {/* Player 2 */}
      <div className="flex items-center bg-[#2e2e31] rounded-lg p-5 mb-6 w-[600px] shadow-md">
        <div className="flex-1">
          <div className="font-bold text-white text-lg">{getCompetitorName(match.competitor2_id)}</div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white font-bold text-lg w-8 h-8 rounded" onClick={() => setScore2(s => s + 1)}>+</button>
          <span className="text-2xl text-white">{score2}</span>
          <button className="bg-blue-600 text-white font-bold text-lg w-8 h-8 rounded" onClick={() => setScore2(s => (s > 0 ? s - 1 : 0))}>-</button>
        </div>
      </div>

      {/* Timer & Controls */}
      <div className="bg-[#2e2e31] rounded-lg px-10 py-7 w-[600px] flex flex-col items-center shadow-md">
        <div className="text-5xl font-mono text-white tracking-widest mb-5">{formatTime(time)}</div>
        <div className="flex space-x-3">
          <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded font-bold">SELECT</button>
          <button className="bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded font-bold" onClick={() => {
            setIsRunning(true);
            window.open(`/scoreboard/${matchId}`, '_blank', 'noopener,noreferrer');
          }} disabled={isRunning}>START</button>
          <button className="bg-yellow-500 hover:bg-yellow-400 text-white px-6 py-2 rounded font-bold" onClick={() => setIsRunning(false)} disabled={!isRunning}>PAUSE</button>
          <button className="bg-gray-400 hover:bg-gray-300 text-white px-6 py-2 rounded font-bold" onClick={() => { setTime(180); setIsRunning(false); }}>RESET</button>

          {/* END button with winnerId + console */}
          <button
  className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded font-bold"
  onClick={async () => {
    setTime(0);
    setIsRunning(false);

    let winnerId: string | null = null;
    if (score1 > score2) winnerId = match.competitor1_id;
    else if (score2 > score1) winnerId = match.competitor2_id;

    console.log("Match ID:", matchId);
    console.log("Winner ID:", winnerId ?? "Égalité");
    console.log("Round:", match.round); // ✅ ICI

    try {
      const res = await fetch(`/api/match/${matchId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score1,
          score2,
          winnerId,
        }),
      });

      if (!res.ok) throw new Error("Failed to update match");
    } catch (e) {
      console.error("Erreur lors de la mise à jour :", e);
    }
  }}
>
  END
</button>

        </div>
      </div>
    </div>
  );
}
