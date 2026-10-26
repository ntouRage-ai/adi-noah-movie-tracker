const watchlist = [
  "Transformers One",
  "Bullet Train",
  "Rango",
  "Game Night",
  "Wonder",
  "Catch Me If You Can",
  "The Tomorrow War",
  "Pacific Rim",
];

export default function WatchlistPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-5xl font-bold mb-6">
        📚 Watchlist
      </h1>

      <p className="text-zinc-400 mb-8">
        Alle offenen Filme von Adi & Noah
      </p>

      <div className="space-y-3">
        {watchlist.map((movie) => (
          <div
            key={movie}
            className="bg-zinc-900 p-4 rounded-xl"
          >
            🎥 {movie}
          </div>
        ))}
      </div>
    </main>
  );
}
