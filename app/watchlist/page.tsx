"use client";

import Navigation from "../../components/Navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Movie = {
  id: string;
  title: string;
  original_title?: string;
  poster_url?: string;
  overview?: string;
  release_year?: number;
  tmdb_rating?: number;
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
      .order("title");

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

  async function refreshTmdb() {
    try {
      await fetch("/api/tmdb");

      await loadMovies();

      alert("✅ TMDB-Daten wurden aktualisiert");
    } catch (error) {
      console.error(error);

      alert("❌ Fehler beim Aktualisieren");
    }
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
      original_title: movie.original_title,
      poster_url: movie.poster_url,
      overview: movie.overview,
      release_year: movie.release_year,
      tmdb_rating: movie.tmdb_rating,
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

      <div className="flex gap-2 mb-8 flex-wrap">
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

        <button
          onClick={refreshTmdb}
          className="bg-blue-600 hover:bg-blue-700 px-4 rounded-xl"
        >
          🔄 TMDB aktualisieren
        </button>
      </div>

      <div className="grid gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-zinc-900 rounded-xl overflow-hidden"
          >
            <div className="md:flex">
              <div className="md:w-56 flex-shrink-0">
                {movie.poster_url ? (
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-80 flex items-center justify-center bg-zinc-800 text-4xl">
                    🎬
                  </div>
                )}
              </div>

              <div className="p-6 flex-1">
                <h2 className="text-2xl font-bold">
                  {movie.title}
                </h2>

                {movie.original_title &&
                  movie.original_title !== movie.title && (
                    <div className="text-zinc-400 mt-1">
                      Originaltitel: {movie.original_title}
                    </div>
                  )}

                <div className="flex gap-6 mt-3 text-sm text-zinc-300 flex-wrap">
                  {movie.release_year && (
                    <span>
                      📅 {movie.release_year}
                    </span>
                  )}

                  {movie.tmdb_rating && (
                    <span>
                      ⭐ TMDB {movie.tmdb_rating.toFixed(1)}
                    </span>
                  )}
                </div>

                {movie.overview && (
                  <p className="mt-4 text-zinc-300">
                    {movie.overview}
                  </p>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => markAsWatched(movie)}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                  >
                    ✅ Gesehen
                  </button>

                  <button
                    onClick={() => deleteMovie(movie.id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                  >
                    ❌ Löschen
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}