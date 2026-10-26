"use client";

import Navigation from "../../components/Navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Movie = {
  id: string;
  title: string;
  created_at?: string;
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

  async function deleteMovie(id: string) {
    await supabase
      .from("watchlist")
      .delete()
      .eq("id", id);

    await loadMovies();
  }

  async function markAsWatched(movie: Movie) {
    await supabase.from("movies").insert({
      title: movie.title,
    });

    await supabase
      .from("watchlist")
      .delete()
      .eq("id", movie.id);

    await loadMovies();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <Navigation />

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
            className="bg-zinc-900 p-4 rounded-xl flex justify-between items-center"
          >
            <span>🎥 {movie.title}</span>

            <div className="flex gap-2">
              <button
                onClick={() => markAsWatched(movie)}
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg"
                title="Als gesehen markieren"
              >
                ✅
              </button>

              <button
                onClick={() => deleteMovie(movie.id)}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg"
                title="Film löschen"
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}