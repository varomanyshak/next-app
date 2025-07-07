'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditTournoi() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [form, setForm] = useState({
    name: '',
    city: '',
    club: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/tournoi/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement des données');
        return res.json();
      })
      .then(data => {
        setForm({
          name: data.name,
          city: data.city,
          club: data.club,
          start_date: data.start_date.slice(0, 10),
          end_date: data.end_date.slice(0, 10),
        });
      })
      .catch(err => alert(err.message));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/tournoi/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/tournoi');
    } else {
      alert('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Modifier le tournoi</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Nom"
        />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Ville"
        />
        <input
          name="club"
          value={form.club}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Club"
        />
        <input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
