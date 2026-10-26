"use client";

import { useState } from "react";

const movies = [
  "Bullet Train",
  "Catch Me If You Can",
  "Wonder",
  "Game Night",
  "Transformers One",
  "Rango",
  "Pacific Rim",
  "The Tomorrow War",
];

export default function RoulettePage() {
  const [selectedMovie, setSelectedMovie] = useState("");

  const spinRoulette = () => {
    const randomMovie =
      movies[Math.floor(Math.random() * movies.length)];

    setSelectedMovie(randomMovie);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-5xl font-bold mb-6">
        🎲 Filmroulette
      </h1>

      <button
        onClick={spinRoulette}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold"
      >
        Überrasch mich
      </button>

      {selectedMovie && (
        <div className="mt-8 bg-zinc-900 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-2">
            Heute schaut ihr:
          </h2>

          <p className="text-xl">
            🎥 {selectedMovie}
          </p>
        </div>
      )}
    </main>
  );
}