'use client';

import { useEffect, useState } from 'react';

export default function PageCompetiteur() {
  const [competiteurs, setCompetiteurs] = useState<Array<{ [key: string]: unknown }>>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    birthday: '',
    club: '',
    country: '',
    weight: '',
    rank: '',
    gender: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('Utilisateur non connecté.');
      return;
    }

    const fetchCompetiteurs = async () => {
      try {
        const res = await fetch(`/api/competiteur?userId=${userId}`);
        if (!res.ok) throw new Error('Erreur de chargement');
        const data = await res.json();
        setCompetiteurs(data);
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des compétiteurs.');
      }
    };

    fetchCompetiteurs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Utilisateur non connecté.');
      return;
    }

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/competiteur/${editId}` : '/api/competiteur';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, userId }), // 👈 Ajout du userId
    });

    if (res.ok) {
      setShowModal(false);
      const updatedCompetiteur = await res.json();
      if (isEditing) {
        setCompetiteurs((prev) =>
          prev.map((c) => (c.id === editId ? updatedCompetiteur : c))
        );
      } else {
        setCompetiteurs((prev) => [...prev, updatedCompetiteur]);
      }
    } else {
      alert('Erreur lors de la sauvegarde du compétiteur');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setIsEditing(false);
    setForm({
      firstname: '',
      lastname: '',
      birthday: '',
      club: '',
      country: '',
      weight: '',
      rank: '',
      gender: '',
    });
    setShowModal(true);
  };

  const openEditModal = (competiteur: { [key: string]: unknown }) => {
    setIsEditing(true);
    setEditId(typeof competiteur.id === 'string' ? competiteur.id : null);
    setForm({
      firstname: typeof competiteur.firstname === 'string' ? competiteur.firstname : '',
      lastname: typeof competiteur.lastname === 'string' ? competiteur.lastname : '',
      birthday: typeof competiteur.birthday === 'string' ? competiteur.birthday.split('T')[0] : '',
      club: typeof competiteur.club === 'string' ? competiteur.club : '',
      country: typeof competiteur.country === 'string' ? competiteur.country : '',
      weight: typeof competiteur.weight === 'string' ? competiteur.weight : '',
      rank: typeof competiteur.rank === 'string' ? competiteur.rank : '',
      gender: typeof competiteur.gender === 'string' ? competiteur.gender : '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: unknown) => {
    if (typeof id !== 'string') return;
    if (!confirm('Confirmer la suppression de ce compétiteur ?')) return;
    const res = await fetch(`/api/competiteur/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hidden: true }),
    });
    if (res.ok) {
      setCompetiteurs((prev) => prev.filter((c) => (typeof c.id === 'string' ? c.id : undefined) !== id));
    } else {
      alert('Erreur lors de la suppression');
    }
  };

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/competiteur/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      alert('Importation réussie !');
      window.location.reload();
    } else {
      alert("Erreur lors de l'import !");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Liste des compétiteurs</h1>

      {error && <p className="text-red-600">{error}</p>}

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#393c4d] text-white rounded hover:bg-[#2c2e3a] border border-black"
        >
          Ajouter un compétiteur
        </button>

        <div>
          <label
            htmlFor="csvUpload"
            className="px-4 py-2 bg-[#393c4d] text-white rounded cursor-pointer hover:bg-[#2c2e3a] border border-black"
          >
            Importer CSV
          </label>
          <input
            type="file"
            id="csvUpload"
            accept=".csv"
            className="hidden"
            onChange={handleCSVImport}
          />
        </div>
      </div>

      <table className="w-full border text-sm border-black text-default">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Nom</th>
            <th className="border px-2 py-1">Prénom</th>
            <th className="border px-2 py-1">Naissance</th>
            <th className="border px-2 py-1">Club</th>
            <th className="border px-2 py-1">Pays</th>
            <th className="border px-2 py-1">Poids</th>
            <th className="border px-2 py-1">Grade</th>
            <th className="border px-2 py-1">Genre</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {competiteurs.map((c) => (
            <tr key={typeof c.id === 'string' ? c.id : undefined}>
              <td className="border px-2 py-1">{typeof c.lastname === 'string' ? c.lastname : ''}</td>
              <td className="border px-2 py-1">{typeof c.firstname === 'string' ? c.firstname : ''}</td>
              <td className="border px-2 py-1">{typeof c.birthday === 'string' ? new Date(c.birthday).toLocaleDateString('fr-FR') : ''}</td>
              <td className="border px-2 py-1">{typeof c.club === 'string' ? c.club : ''}</td>
              <td className="border px-2 py-1">{typeof c.country === 'string' ? c.country : ''}</td>
              <td className="border px-2 py-1">{typeof c.weight === 'string' ? c.weight : ''}</td>
              <td className="border px-2 py-1">{typeof c.rank === 'string' ? c.rank : ''}</td>
              <td className="border px-2 py-1">{typeof c.gender === 'string' ? c.gender : ''}</td>
              <td className="border px-2 py-1 flex space-x-1">
                <button
                  onClick={() => openEditModal(c)}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96 text-default">
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? 'Modifier' : 'Ajouter'} un Compétiteur
            </h2>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input name="lastname" placeholder="Nom" onChange={handleChange} value={form.lastname} className="w-full border p-2" />
              <input name="firstname" placeholder="Prénom" onChange={handleChange} value={form.firstname} className="w-full border p-2" />
              <input type="date" name="birthday" onChange={handleChange} value={form.birthday} className="w-full border p-2" />
              <input name="club" placeholder="Club" onChange={handleChange} value={form.club} className="w-full border p-2" />
              <input name="country" placeholder="Pays" onChange={handleChange} value={form.country} className="w-full border p-2" />
              <input name="weight" placeholder="Poids" onChange={handleChange} value={form.weight} className="w-full border p-2" />

              <select name="rank" onChange={handleChange} value={form.rank} className="w-full border p-2">
                <option value="">Sélectionner un grade</option>
                <option value="Ceinture Blanche">Ceinture Blanche</option>
                <option value="Ceinture Jaune">Ceinture Jaune</option>
                <option value="Ceinture Orange">Ceinture Orange</option>
                <option value="Ceinture Verte">Ceinture Verte</option>
                <option value="Ceinture Bleue">Ceinture Bleue</option>
                <option value="Ceinture Marron">Ceinture Marron</option>
                <option value="Ceinture Noire">Ceinture Noire</option>
              </select>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-1">
                  <input type="radio" name="gender" value="H" checked={form.gender === 'H'} onChange={handleChange} />
                  <span>H</span>
                </label>
                <label className="flex items-center space-x-1">
                  <input type="radio" name="gender" value="F" checked={form.gender === 'F'} onChange={handleChange} />
                  <span>F</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-1 bg-gray-400 rounded">Annuler</button>
                <button type="submit" className="px-4 py-1 bg-[#393c4d] text-white rounded border border-black hover:bg-[#2c2e3a]">
                  {isEditing ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
