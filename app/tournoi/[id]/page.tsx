'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Category = {
  id: number;
  name: string;
  rank: string;
  gender: string;
  weight_category_id: number;
  age_group_id: number;
};

type AgeGroup = { id: number; name: string; };
type WeightCategory = { id: number; name: string; };
type Competitor = {
  id: string;
  firstname: string;
  lastname: string;
  birthday: string;
  club: string;
  country: string;
  weight: number;
  rank: string;
  gender: string;
  user_id: number;
  hidden: boolean;
};

export default function TournamentDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const userId = 1; // Replace with real userId from auth/session

  const [categories, setCategories] = useState<Category[]>([]);
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
  const [weightCategories, setWeightCategories] = useState<WeightCategory[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const [previewedCompetitors, setPreviewedCompetitors] = useState<Competitor[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const [matchCreateStatus, setMatchCreateStatus] = useState<string | null>(null);

  const [newCategory, setNewCategory] = useState({
    name: '',
    rank: '',
    gender: '',
    weight_category_id: '',
    age_group_id: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/category?tournoiId=${id}`);
        if (!res.ok) throw new Error('Erreur');
        const data = await res.json();
        setCategories(data);
      } catch {
        setError("Erreur lors du chargement des catégories");
      }
    };

    const fetchAgeGroups = async () => {
      const res = await fetch('/api/age-group');
      if (res.ok) {
        const data = await res.json();
        setAgeGroups(data);
      }
    };

    const fetchWeightCategories = async () => {
      const res = await fetch('/api/weight-category');
      if (res.ok) {
        const data = await res.json();
        setWeightCategories(data);
      }
    };

    // Fetch competitors WITH userId!
    const fetchCompetitors = async () => {
      const res = await fetch(`/api/competiteur?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setCompetitors(data);
      }
    };

    fetchCategories();
    fetchAgeGroups();
    fetchWeightCategories();
    fetchCompetitors();
  }, [id, userId]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newCategory,
        tournament_id: id,
        weight_category_id: parseInt(newCategory.weight_category_id),
        age_group_id: parseInt(newCategory.age_group_id),
      }),
    });

    if (res.ok) {
      const created = await res.json();
      setCategories((prev) => [...prev, created]);
      setCreating(false);
      setNewCategory({
        name: '',
        rank: '',
        gender: '',
        weight_category_id: '',
        age_group_id: '',
      });
    } else {
      alert('Erreur lors de la création de la catégorie');
    }
  };

  const supprimerCategorie = async (id: number) => {
    if (!confirm("Confirmer la suppression de cette catégorie ?")) return;

    const res = await fetch(`/api/category/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hidden: true }),
    });

    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert("Erreur lors de la suppression");
    }
  };

  // Utility: Calculate age from birthday (ISO string)
  function getAge(birthday: string): number {
    const birthDate = new Date(birthday);
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const m = now.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Handler: Preview ALL competitors matching any category of this tournament
  const handlePreviewAllCompetitors = () => {
    // For each category, filter matching competitors (by rank, gender, <=5 years old)
    let matches: Competitor[] = [];
    categories.forEach(category => {
      matches.push(
        ...competitors.filter(comp =>
          comp.rank.toLowerCase().trim() === category.rank.toLowerCase().trim() &&
          comp.gender === category.gender &&
          getAge(comp.birthday) <= 5
        )
      );
    });
    // Remove duplicates by id (in case a competitor matches multiple categories)
    const uniqueMatches = Array.from(new Map(matches.map(c => [c.id, c])).values());

    setPreviewedCompetitors(uniqueMatches);
    setShowPreview(true);
  };

// Handler: Start tournament & generate matches
const handleStartTournament = async () => {
  setMatchCreateStatus("Création des matchs...");
  const res = await fetch('/api/match/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      competitors: previewedCompetitors,
      categories: categories,
      tournamentId: id, // <--- AJOUT ici !
    }),
  });
  if (res.ok) {
    const data = await res.json();
    setMatchCreateStatus(`Matchs créés: ${data.matchesCreated}`);
    // Optional: redirect or update UI
  } else {
    setMatchCreateStatus("Erreur lors de la création des matchs.");
  }
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Détails du Tournoi</h1>

      {error && <p className="text-red-600">{error}</p>}

      <div className="mb-4">
        <button
          onClick={() => setCreating(true)}
          className="bg-[#393c4d] text-white px-4 py-2 rounded border border-black hover:bg-[#2c2e3a]"
        >
          Créer une Catégorie
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Catégories associées</h2>
      <table className="w-full border text-sm border-black text-default">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Nom</th>
            <th className="border px-2 py-1">Rang</th>
            <th className="border px-2 py-1">Genre</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td className="border px-2 py-1">{c.name}</td>
              <td className="border px-2 py-1">{c.rank}</td>
              <td className="border px-2 py-1">{c.gender}</td>
              <td className="border px-2 py-1 space-x-2">
                <button
                  onClick={() => alert("À implémenter : édition")}
                  className="px-2 py-1 bg-[#393c4d] text-white rounded hover:bg-[#2c2e3a] border border-black"
                >
                  Modifier
                </button>
                <button
                  onClick={() => supprimerCategorie(c.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* BTN: Prévisualiser all matching competitors */}
      <div className="mt-6 flex justify-center">
        <button
          className="bg-[#393c4d] text-white px-4 py-2 rounded border border-black hover:bg-[#2c2e3a]"
          onClick={handlePreviewAllCompetitors}
        >
          Prévisualiser les compétiteurs
        </button>
      </div>

      {/* Preview Table */}
      {showPreview && (
        <div className="mt-8 bg-gray-50 p-4 rounded border shadow">
          <h3 className="text-lg font-bold mb-2">
            Compétiteurs
          </h3>
          {previewedCompetitors.length === 0 ? (
            <div className="text-gray-600">Aucun compétiteur trouvé.</div>
          ) : (
            <table className="w-full border text-sm bg-white border-black">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Nom</th>
                  <th className="border px-2 py-1">Prénom</th>
                  <th className="border px-2 py-1">Anniversaire</th>
                  <th className="border px-2 py-1">Age</th>
                  <th className="border px-2 py-1">Rang</th>
                  <th className="border px-2 py-1">Genre</th>
                </tr>
              </thead>
              <tbody>
                {previewedCompetitors.map((c) => (
                  <tr key={c.id}>
                    <td className="border px-2 py-1">{c.lastname}</td>
                    <td className="border px-2 py-1">{c.firstname}</td>
                    <td className="border px-2 py-1">{c.birthday.substring(0, 10)}</td>
                    <td className="border px-2 py-1">{getAge(c.birthday)}</td>
                    <td className="border px-2 py-1">{c.rank}</td>
                    <td className="border px-2 py-1">{c.gender}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* BTN: Commencer le tournoi */}
      <div className="mt-6 flex justify-center">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleStartTournament}
        >
          Commencer le tournoi
        </button>
      </div>
      {/* BTN: Matches */}
      <div className="mt-4 flex justify-center">
        <Link href={`/matches/${id}`}>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            type="button"
          >
            Matches
          </button>
        </Link>



      </div>


      {matchCreateStatus && (
        <div className="mt-2 text-center font-bold">{matchCreateStatus}</div>
      )}

      {creating && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Créer une Catégorie</h2>
            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="block mb-1 font-semibold">Nom</label>
                <input
                  className="border px-2 py-1 rounded w-full"
                  type="text"
                  value={newCategory.name}
                  onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Rang</label>
                <select
                  className="border px-2 py-1 rounded w-full"
                  value={newCategory.rank}
                  onChange={e => setNewCategory({ ...newCategory, rank: e.target.value })}
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Ceinture Blanche">Ceinture Blanche</option>
                  <option value="Ceinture Jaune">Ceinture Jaune</option>
                  <option value="Ceinture Orange">Ceinture Orange</option>
                  <option value="Ceinture Verte">Ceinture Verte</option>
                  <option value="Ceinture Bleue">Ceinture Bleue</option>
                  <option value="Ceinture Marron">Ceinture Marron</option>
                  <option value="Ceinture Noire">Ceinture Noire</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold">Genre</label>
                <select
                  className="border px-2 py-1 rounded w-full"
                  value={newCategory.gender}
                  onChange={e => setNewCategory({ ...newCategory, gender: e.target.value })}
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="H">Homme</option>
                  <option value="F">Femme</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Catégorie de poids</label>
                <select
                  className="border px-2 py-1 rounded w-full"
                  value={newCategory.weight_category_id}
                  onChange={e => setNewCategory({ ...newCategory, weight_category_id: e.target.value })}
                  required
                >
                  <option value="">Sélectionner</option>
                  {weightCategories.map(wc => (
                    <option key={wc.id} value={wc.id}>{wc.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Groupe d'âge</label>
                <select
                  className="border px-2 py-1 rounded w-full"
                  value={newCategory.age_group_id}
                  onChange={e => setNewCategory({ ...newCategory, age_group_id: e.target.value })}
                  required
                >
                  <option value="">Sélectionner</option>
                  {ageGroups.map(ag => (
                    <option key={ag.id} value={ag.id}>{ag.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
