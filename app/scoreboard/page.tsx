'use client';

import Image from 'next/image';

export default function ScoreboardPage() {
  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">
      {/* Competitor 1 - Red Section */}
      <div className="flex items-center justify-between px-8 bg-gradient-to-r from-red-700 to-red-900 flex-1">
        <div className="flex items-center gap-4">
          <Image src="/fr-flag.png" alt="FR Flag" width={32} height={20} />
          <div>
            <h2 className="text-xl font-bold">Julien WECKERLE</h2>
            <p className="text-md">Chatenois</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-5xl font-bold">1</p>
          <p className="text-md font-light">0</p>
        </div>
      </div>

      {/* Competitor 2 - White Section */}
      <div className="flex items-center justify-between px-8 text-black bg-gradient-to-r from-white to-gray-400 flex-1">
        <div className="flex items-center gap-4">
          <Image src="/fr-flag.png" alt="FR Flag" width={32} height={20} />
          <div>
            <h2 className="text-xl font-bold">Mesut AYSEL</h2>
            <p className="text-md">Nancy</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-5xl font-bold">2</p>
          <p className="text-md font-light">0</p>
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

        <div className="text-white text-6xl font-mono">03:00</div>
      </div>
    </div>
  );
}
