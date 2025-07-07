// Fichier : app/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Sidebar() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (user) setUsername(user);
  }, []);

  return (
    <div className="w-64 min-h-screen p-6 flex flex-col justify-between bg-gradient-to-b from-[#181818] via-[#232526] to-[#181818] shadow-2xl border-r-4 border-black">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <Image src="/kempo-logo.png" alt="Kempo Logo" width={48} height={48} className="w-12 h-12 rounded-full shadow-lg border-2 border-yellow-400 bg-white" />
          <h2 className="text-3xl font-extrabold tracking-wide text-yellow-300 drop-shadow">Kempo</h2>
        </div>
        <ul className="space-y-3">
          <li>
            <Link href="/" className="block px-4 py-2 rounded-lg transition-all duration-200 text-yellow-100 hover:bg-yellow-600/20 hover:text-yellow-300 font-semibold">
              Accueil
            </Link>
          </li>
          <li>
            <Link href="/register" className="block px-4 py-2 rounded-lg transition-all duration-200 text-yellow-100 hover:bg-yellow-600/20 hover:text-yellow-300 font-semibold">
              Inscription
            </Link>
          </li>
          <li>
            <Link href="/login" className="block px-4 py-2 rounded-lg transition-all duration-200 text-yellow-100 hover:bg-yellow-600/20 hover:text-yellow-300 font-semibold">
              Connexion
            </Link>
          </li>
          <li>
            <Link href="/tournoi" className="block px-4 py-2 rounded-lg transition-all duration-200 text-yellow-100 hover:bg-yellow-600/20 hover:text-yellow-300 font-semibold">
              Tournoi
            </Link>
          </li>
          <li>
            <Link href="/competiteur" className="block px-4 py-2 rounded-lg transition-all duration-200 text-yellow-100 hover:bg-yellow-600/20 hover:text-yellow-300 font-semibold">
              Compétiteur
            </Link>
          </li>
        </ul>
      </div>
      <div className="mt-10">
        <div className="bg-[#232526]/80 rounded-xl px-4 py-3 shadow-inner border border-black flex items-center gap-2">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-yellow-300">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs text-yellow-100">
            {username ? (
              <>Connecté en tant que <span className="font-semibold text-yellow-300">{username}</span></>
            ) : (
              'Non connecté'
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
