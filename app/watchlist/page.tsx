import { supabase } from "../../lib/supabase";

export default async function WatchlistPage() {
  const { data, error } = await supabase
    .from("watchlist")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-5xl font-bold mb-6">
        📚 Watchlist
      </h1>

      <p className="text-zinc-400 mb-8">
        Alle offenen Filme von Adi & Noah
      </p>

      {error && (
        <div className="bg-red-900 p-4 rounded-xl mb-4">
          Fehler: {error.message}
        </div>
      )}

      <div className="space-y-3">
        {data?.map((movie) => (
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