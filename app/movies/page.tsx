import Navigation from "../../components/Navigation";
import { supabase } from "../../lib/supabase";

export default async function MoviesPage() {
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <Navigation />

      <h1 className="text-5xl font-bold mb-6">
        🎥 Gesehene Filme
      </h1>

      <div className="bg-zinc-900 p-4 rounded-xl mb-6">
        Insgesamt geschaut: {data?.length ?? 0}
      </div>

      {error && (
        <div className="bg-red-900 p-4 rounded-xl mb-6">
          Fehler: {error.message}
        </div>
      )}

      <div className="space-y-3">
        {data?.map((movie) => (
          <div
            key={movie.id}
            className="bg-zinc-900 p-4 rounded-xl"
          >
            🎬 {movie.title}
          </div>
        ))}
      </div>
    </main>
  );
}