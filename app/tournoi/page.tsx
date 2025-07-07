// app/tournoi/page.tsx
'use client';

import { useEffect, useState } from 'react';

type Tournoi = {
  id: string;
  name: string;
  city: string;
  club: string;
  start_date: string;
  end_date: string;
};

export default function PageTournoi() {
  const [tournois, setTournois] = useState<Tournoi[]>([]);
  const [error, setError] = useState('');
  const [editingTournoi, setEditingTournoi] = useState<Tournoi | null>(null);
  const [newTournoi, setNewTournoi] = useState<Omit<Tournoi, 'id'>>({
    name: '',
    city: '',
    club: '',
    start_date: '',
    end_date: '',
  });
  const [creating, setCreating] = useState(false);
  const [matchesByTournament, setMatchesByTournament] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('Utilisateur non connecté.');
      return;
    }

    const fetchTournois = async () => {
      try {
        const res = await fetch(`/api/tournoi?userId=${userId}`);
        if (!res.ok) throw new Error('Erreur de chargement');
        const data = await res.json();
        const filtered = data.filter((t: Tournoi & { hidden: boolean }) => !t.hidden);
        setTournois(filtered);
        // Fetch matches for each tournament
        const matchesObj: { [key: string]: number } = {};
        await Promise.all(filtered.map(async (t: Tournoi) => {
          const resMatch = await fetch(`/api/match?tournamentId=${t.id}`);
          if (resMatch.ok) {
            const matches = await resMatch.json();
            matchesObj[t.id] = matches.length;
          } else {
            matchesObj[t.id] = 0;
          }
        }));
        setMatchesByTournament(matchesObj);
      } catch {
        setError('Erreur lors du chargement des tournois.');
      }
    };
    fetchTournois();
  }, []);

  const supprimerTournoi = async (id: string) => {
    if (!confirm('Confirmer la suppression de ce tournoi ?')) return;
    const res = await fetch(`/api/tournoi/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hidden: true }),
    });
    if (res.ok) {
      setTournois((prev) => prev.filter((t) => t.id !== id));
    } else {
      alert('Erreur lors de la suppression');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTournoi) return;

    const res = await fetch(`/api/tournoi/${editingTournoi.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingTournoi),
    });

    if (res.ok) {
      const updated = await res.json();
      setTournois((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setEditingTournoi(null);
    } else {
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Utilisateur non connecté');
      return;
    }

    const res = await fetch('/api/tournoi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newTournoi, userId }),
    });

    if (res.ok) {
      const created = await res.json();
      setTournois((prev) => [...prev, created]);
      setCreating(false);
      setNewTournoi({ name: '', city: '', club: '', start_date: '', end_date: '' });
    } else {
      alert('Erreur lors de la création');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Liste des tournois</h1>

      {error && <p className="text-red-600">{error}</p>}

      <div className="mb-4">
        {tournois.every(t => (matchesByTournament[t.id] ?? 0) === 0) && (
          <button
            onClick={() => setCreating(true)}
            className="bg-[#393c4d] text-white px-4 py-2 rounded border border-black hover:bg-[#2c2e3a]"
          >
            Créer un Tournoi
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-black text-sm text-left text-default">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Nom</th>
              <th className="p-2 border">Ville</th>
              <th className="p-2 border">Club</th>
              <th className="p-2 border">Début</th>
              <th className="p-2 border">Fin</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tournois.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="p-2 border">{t.name}</td>
                <td className="p-2 border">{t.city}</td>
                <td className="p-2 border">{t.club}</td>
                <td className="p-2 border">{new Date(t.start_date).toLocaleDateString('fr-FR')}</td>
                <td className="p-2 border">{new Date(t.end_date).toLocaleDateString('fr-FR')}</td>
                <td className="p-2 border space-x-1">
                  <button
                    onClick={() => setEditingTournoi(t)}
                    className="px-2 py-1 bg-[#393c4d] text-white rounded hover:bg-[#2c2e3a] border border-black"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => supprimerTournoi(t.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                  <button
                    onClick={() => window.location.href = `/tournoi/${t.id}`}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingTournoi && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Modifier Tournoi</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input className="w-full p-2 border rounded" value={editingTournoi.name} onChange={(e) => setEditingTournoi({ ...editingTournoi, name: e.target.value })} placeholder="Nom" />
              <input className="w-full p-2 border rounded" value={editingTournoi.city} onChange={(e) => setEditingTournoi({ ...editingTournoi, city: e.target.value })} placeholder="Ville" />
              <input className="w-full p-2 border rounded" value={editingTournoi.club} onChange={(e) => setEditingTournoi({ ...editingTournoi, club: e.target.value })} placeholder="Club" />
              <input type="date" className="w-full p-2 border rounded" value={editingTournoi.start_date.slice(0, 10)} onChange={(e) => setEditingTournoi({ ...editingTournoi, start_date: e.target.value })} />
              <input type="date" className="w-full p-2 border rounded" value={editingTournoi.end_date.slice(0, 10)} onChange={(e) => setEditingTournoi({ ...editingTournoi, end_date: e.target.value })} />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingTournoi(null)} className="bg-gray-400 text-white px-4 py-2 rounded">Annuler</button>
                <button type="submit" className="bg-[#393c4d] text-white px-4 py-2 rounded border border-black hover:bg-[#2c2e3a]">Modifier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {creating && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Créer un Tournoi</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <input className="w-full p-2 border rounded" value={newTournoi.name} onChange={(e) => setNewTournoi({ ...newTournoi, name: e.target.value })} placeholder="Nom" />
              <input className="w-full p-2 border rounded" value={newTournoi.city} onChange={(e) => setNewTournoi({ ...newTournoi, city: e.target.value })} placeholder="Ville" />
              <input className="w-full p-2 border rounded" value={newTournoi.club} onChange={(e) => setNewTournoi({ ...newTournoi, club: e.target.value })} placeholder="Club" />
              <input type="date" className="w-full p-2 border rounded" value={newTournoi.start_date} onChange={(e) => setNewTournoi({ ...newTournoi, start_date: e.target.value })} />
              <input type="date" className="w-full p-2 border rounded" value={newTournoi.end_date} onChange={(e) => setNewTournoi({ ...newTournoi, end_date: e.target.value })} />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCreating(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Annuler</button>
                <button type="submit" className="bg-[#393c4d] text-white px-4 py-2 rounded border border-black hover:bg-[#2c2e3a]">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}