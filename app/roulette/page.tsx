"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type WatchlistMovie = {
  id: string;
  title: string;
};

export default function RoulettePage() {
  const [movies, setMovies] = useState<WatchlistMovie[]>([]);
  const [selectedMovie, setSelectedMovie] =
    useState<WatchlistMovie | null>(null);

  useEffect(() => {
    loadMovies();
  }, []);

  async function loadMovies() {
    const { data, error } = await supabase
      .from("watchlist")
      .select("*");

    if (!error && data) {
      setMovies(data);
    }
  }

  function spinRoulette() {
    if (movies.length === 0) return;

    const randomMovie =
      movies[Math.floor(Math.random() * movies.length)];

    setSelectedMovie(randomMovie);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-5xl font-bold mb-6">
        🎲 Filmroulette
      </h1>

      <p className="text-zinc-400 mb-8">
        Zufälliger Film aus eurer Watchlist
      </p>

      <button
        onClick={spinRoulette}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold"
      >
        Überrasch mich
      </button>

      <div className="mt-6 text-zinc-400">
        Filme in Watchlist: {movies.length}
      </div>

      {selectedMovie && (
        <div className="mt-8 bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-2">
            Heute schaut ihr:
          </h2>

          <p className="text-xl">
            🎥 {selectedMovie.title}
          </p>
        </div>
      )}
    </main>
  );
}