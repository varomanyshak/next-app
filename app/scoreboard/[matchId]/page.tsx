"use client";

import Image from 'next/image';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Match {
  id: number;
  competitor1_id: string;
  competitor2_id: string;
}

interface Competitor {
  id: string;
  firstname: string;
  lastname: string;
  club?: string;
}

export default function ScoreboardPage() {
  const { matchId } = useParams() as { matchId: string };
  const [match, setMatch] = useState<Match | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);

  // Real-time state
  const [timer, setTimer] = useState(180); // default 3:00
  const [running, setRunning] = useState(false);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const matchRes = await fetch(`/api/match?matchId=${matchId}`);
      if (matchRes.ok) {
        const data = await matchRes.json();
        setMatch(data);
      }
      const compRes = await fetch(`/api/competiteur?userId=1`); // Adjust userId as needed
      if (compRes.ok) {
        const data = await compRes.json();
        setCompetitors(data);
      }
    }
    fetchData();
  }, [matchId]);

  // Listen for BroadcastChannel messages
  useEffect(() => {
    const channel = new BroadcastChannel(`kempo-remote-${matchId}`);
    const handler = (event: MessageEvent) => {
      const { timer, running, score1, score2 } = event.data || {};
      if (typeof timer === 'number') setTimer(timer);
      if (typeof running === 'boolean') setRunning(running);
      if (typeof score1 === 'number') setScore1(score1);
      if (typeof score2 === 'number') setScore2(score2);
    };
    channel.addEventListener('message', handler);
    return () => channel.close();
  }, [matchId]);

  const getCompetitor = (id: string | undefined) => competitors.find(c => c.id === id);

  const comp1 = getCompetitor(match?.competitor1_id);
  const comp2 = getCompetitor(match?.competitor2_id);

  // Format timer as MM:SS
  const formatTime = (t: number) => {
    const m = Math.floor(t / 60).toString().padStart(2, '0');
    const s = (t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">
      {/* Competitor 1 - Red Section */}
      <div className="flex items-center justify-between px-8 bg-gradient-to-r from-red-700 to-red-900 flex-1">
        <div className="flex items-center gap-4">
          <Image src="/fr-flag.png" alt="FR Flag" width={32} height={20} />
          <div>
            <h2 className="text-xl font-bold">{comp1 ? `${comp1.firstname} ${comp1.lastname}` : "-"}</h2>
            <p className="text-md">{comp1?.club ?? ""}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-5xl font-bold">{score1}</p>
          <p className="text-md font-light">{running ? '▶' : '⏸'}</p>
        </div>
      </div>

      {/* Competitor 2 - White Section */}
      <div className="flex items-center justify-between px-8 text-black bg-gradient-to-r from-white to-gray-400 flex-1">
        <div className="flex items-center gap-4">
          <Image src="/fr-flag.png" alt="FR Flag" width={32} height={20} />
          <div>
            <h2 className="text-xl font-bold">{comp2 ? `${comp2.firstname} ${comp2.lastname}` : "-"}</h2>
            <p className="text-md">{comp2?.club ?? ""}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-5xl font-bold">{score2}</p>
          <p className="text-md font-light">{running ? '▶' : '⏸'}</p>
        </div>
      </div>

      {/* Bottom Section - Timer & Logo */}
      <div className="flex items-center justify-between px-10 flex-1">
        <div className="flex items-center gap-4">
          <Image src="/kempo-logo.png" alt="Kempo Logo" width={80} height={80} />
          <div>
            <p className="font-bold text-md leading-4">NIPPON KEMPO</p>
            <p className="text-lg leading-5">日本拳法</p>
          </div>
        </div>

        <div className="text-white text-6xl font-mono">{formatTime(timer)}</div>
      </div>
    </div>
  );
}
