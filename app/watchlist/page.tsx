"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Movie = {
  id: string;
  title: string;
};

export default function WatchlistPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newMovie, setNewMovie] = useState("");

  useEffect(() => {
    loadMovies();
  }, []);

  async function loadMovies() {
    const { data } = await supabase
      .from("watchlist")
      .select("*")
      .order("created_at", { ascending: true });

    if (data) {
      setMovies(data);
    }
  }

  async function addMovie() {
    if (!newMovie.trim()) return;

    await supabase.from("watchlist").insert({
      title: newMovie,
    });

    setNewMovie("");

    await loadMovies();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-5xl font-bold mb-6">
        📚 Watchlist
      </h1>

      <div className="flex gap-2 mb-8">
        <input
          value={newMovie}
          onChange={(e) => setNewMovie(e.target.value)}
          placeholder="Film eingeben..."
          className="bg-zinc-900 p-3 rounded-xl text-white flex-1"
        />

        <button
          onClick={addMovie}
          className="bg-green-600 hover:bg-green-700 px-4 rounded-xl"
        >
          Hinzufügen
        </button>
      </div>

      <div className="space-y-3">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-zinc-900 p-4 rounded-xl"
          >
            🎥 {movie.title}
          </div>
        ))}
      </div>
    </main>
  );
}