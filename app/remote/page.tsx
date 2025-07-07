"use client";

import React, { useState, useRef } from "react";

export default function RemoteControlPage() {
  // Score states
  const [score1, setScore1] = useState(1);
  const [score2, setScore2] = useState(2);

  // Timer states
  const [time, setTime] = useState(180); // 3 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer controls
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    setTime(180);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const endTimer = () => {
    setTime(0);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Format time as mm:ss
  const formatTime = (t: number) =>
    `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;

  // Clean up interval on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#222225]">
      {/* Player 1 */}
      <div className="flex items-center bg-[#2e2e31] rounded-lg p-5 mb-4 w-[600px] shadow-md">
        <div className="flex-1">
          <div className="font-bold text-white text-lg">Julien WECKERLE</div>
          <div className="text-sm text-gray-300">Chatenois</div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className="bg-blue-600 text-white font-bold text-lg w-8 h-8 rounded"
            onClick={() => setScore1((s) => s + 1)}
          >
            +
          </button>
          <span className="text-2xl text-white">{score1}</span>
          <button
            className="bg-blue-600 text-white font-bold text-lg w-8 h-8 rounded"
            onClick={() => setScore1((s) => (s > 0 ? s - 1 : 0))}
          >
            -
          </button>
        </div>
      </div>

      {/* Player 2 */}
      <div className="flex items-center bg-[#2e2e31] rounded-lg p-5 mb-6 w-[600px] shadow-md">
        <div className="flex-1">
          <div className="font-bold text-white text-lg">Mesut AYSEL</div>
          <div className="text-sm text-gray-300">Nancy</div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className="bg-blue-600 text-white font-bold text-lg w-8 h-8 rounded"
            onClick={() => setScore2((s) => s + 1)}
          >
            +
          </button>
          <span className="text-2xl text-white">{score2}</span>
          <button
            className="bg-blue-600 text-white font-bold text-lg w-8 h-8 rounded"
            onClick={() => setScore2((s) => (s > 0 ? s - 1 : 0))}
          >
            -
          </button>
        </div>
      </div>

      {/* Timer & Controls */}
      <div className="bg-[#2e2e31] rounded-lg px-10 py-7 w-[600px] flex flex-col items-center shadow-md">
        <div className="text-5xl font-mono text-white tracking-widest mb-5">{formatTime(time)}</div>
        <div className="flex space-x-3">
          <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded font-bold">SELECT</button>
          <button
            className="bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded font-bold"
            onClick={startTimer}
            disabled={isRunning}
          >
            START
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-400 text-white px-6 py-2 rounded font-bold"
            onClick={pauseTimer}
            disabled={!isRunning}
          >
            PAUSE
          </button>
          <button
            className="bg-gray-400 hover:bg-gray-300 text-white px-6 py-2 rounded font-bold"
            onClick={resetTimer}
          >
            RESET
          </button>
          <button
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded font-bold"
            onClick={endTimer}
          >
            END
          </button>
        </div>
      </div>
    </div>
  );
}
