import Navigation from "../../components/Navigation";
import { supabase } from "../../lib/supabase";

export default async function RankingPage() {
  const { data } = await supabase
    .from("movies")
    .select("*")
    .order("average_rating", {
      ascending: false,
    });

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <Navigation />

      <h1 className="text-5xl font-bold mb-6">
        🏆 Ranking
      </h1>

      <div className="space-y-4">
        {data?.map((movie, index) => (
          <div
            key={movie.id}
            className="bg-zinc-900 p-4 rounded-xl flex gap-4"
          >
            <div className="w-24 flex-shrink-0">
              {movie.poster_url ? (
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="rounded-lg w-full"
                />
              ) : (
                <div className="bg-zinc-800 rounded-lg h-36 flex items-center justify-center">
                  🎬
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="text-xl font-bold">
                #{index + 1} {movie.title}
              </div>

              {movie.original_title &&
                movie.original_title !==
                  movie.title && (
                  <div className="text-zinc-400">
                    Original:
                    {" "}
                    {movie.original_title}
                  </div>
                )}

              {movie.release_year && (
                <div className="text-zinc-500">
                  {movie.release_year}
                </div>
              )}

              <div className="mt-2 text-yellow-400 font-bold text-lg">
                ⭐ {movie.average_rating}
              </div>

              {movie.overview && (
                <p className="mt-3 text-zinc-300 line-clamp-3">
                  {movie.overview}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}