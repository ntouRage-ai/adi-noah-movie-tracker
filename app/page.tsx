import Navigation from "../components/Navigation";
import { supabase } from "../lib/supabase";

export default async function Home() {
  const { count: watchlistCount } = await supabase
    .from("watchlist")
    .select("*", {
      count: "exact",
      head: true,
    });

  const { count: moviesCount } = await supabase
    .from("movies")
    .select("*", {
      count: "exact",
      head: true,
    });

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <Navigation />

      <h1 className="text-5xl font-bold mb-4">
        🎬 Adi & Noah Movie Tracker
      </h1>

      <p className="text-zinc-400 mb-8">
        Das eigene Filmportal von Adi & Noah
      </p>

      <div className="grid gap-4 max-w-md">
        <div className="bg-zinc-900 p-4 rounded-xl">
          <h2 className="font-bold">📚 Watchlist</h2>
          <p>{watchlistCount ?? 0} Filme</p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <h2 className="font-bold">🎲 Filmroulette</h2>
          <p>{watchlistCount ?? 0} Filme verfügbar</p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <h2 className="font-bold">🎥 Gesehene Filme</h2>
          <p>{moviesCount ?? 0} Filme</p>
        </div>
      </div>
    </main>
  );
}