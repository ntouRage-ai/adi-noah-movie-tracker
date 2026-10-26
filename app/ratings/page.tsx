"use client";

import Navigation from "../../components/Navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Movie = {
  id: string;
  title: string;
};

type RatingMap = {
  [key: string]: number;
};

type MovieWithAverage = {
  id: string;
  title: string;
  noahRating?: number;
  adiRating?: number;
  average?: number;
};

export default function RatingsPage() {
  const [movies, setMovies] = useState<MovieWithAverage[]>([]);
  const [noahRatings, setNoahRatings] = useState<RatingMap>({});
  const [adiRatings, setAdiRatings] = useState<RatingMap>({});

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: movieData } = await supabase
      .from("movies")
      .select("*");

    const { data: ratingData } = await supabase
      .from("ratings")
      .select("*");

    if (!movieData) return;

    const noahMap: RatingMap = {};
    const adiMap: RatingMap = {};

    if (ratingData) {
      ratingData.forEach((rating) => {
        if (rating.user_name === "Noah") {
          noahMap[rating.movie_id] = rating.rating;
        }

        if (rating.user_name === "Adi") {
          adiMap[rating.movie_id] = rating.rating;
        }
      });
    }

    setNoahRatings(noahMap);
    setAdiRatings(adiMap);

    const movieList: MovieWithAverage[] = movieData.map(
      (movie) => {
        const noah = noahMap[movie.id];
        const adi = adiMap[movie.id];

        let average;

        if (noah && adi) {
          average = Number(
            ((noah + adi) / 2).toFixed(1)
          );
        }

        return {
          id: movie.id,
          title: movie.title,
          noahRating: noah,
          adiRating: adi,
          average,
        };
      }
    );

    movieList.sort((a, b) => {
      const avgA = a.average ?? 0;
      const avgB = b.average ?? 0;

      return avgB - avgA;
    });

    setMovies(movieList);
  }

  async function saveRating(
    movieId: string,
    userName: string,
    rating: number
  ) {
    if (!rating) return;

    const { error } = await supabase
      .from("ratings")
      .upsert(
        {
          movie_id: movieId,
          user_name: userName,
          rating: Number(rating),
        },
        {
          onConflict: "movie_id,user_name",
        }
      );

    if (!error) {
      await loadData();

      alert(
        `${userName}-Bewertung gespeichert ✅`
      );
    }
  }

  const ratingOptions = Array.from(
    { length: 91 },
    (_, i) => ((i + 10) / 10).toFixed(1)
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <Navigation />

      <h1 className="text-5xl font-bold mb-6">
        ⭐ Bewertungen
      </h1>

      <div className="space-y-4">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className="bg-zinc-900 p-4 rounded-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                🎬 {movie.title}
              </h2>

              {index === 0 && movie.average && (
                <span className="text-yellow-400 font-bold">
                  🏆 Platz 1
                </span>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">
                  Noah
                </label>

                <select
                  value={movie.noahRating ?? ""}
                  onChange={(e) =>
                    setNoahRatings({
                      ...noahRatings,
                      [movie.id]: Number(
                        e.target.value
                      ),
                    })
                  }
                  className="bg-zinc-800 p-2 rounded-lg w-full"
                >
                  <option value="">
                    Bewertung wählen
                  </option>

                  {ratingOptions.map((rating) => (
                    <option
                      key={rating}
                      value={rating}
                    >
                      {rating}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() =>
                    saveRating(
                      movie.id,
                      "Noah",
                      noahRatings[movie.id]
                    )
                  }
                  className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  Noah speichern
                </button>
              </div>

              <div>
                <label className="block mb-2">
                  Adi
                </label>

                <select
                  value={movie.adiRating ?? ""}
                  onChange={(e) =>
                    setAdiRatings({
                      ...adiRatings,
                      [movie.id]: Number(
                        e.target.value
                      ),
                    })
                  }
                  className="bg-zinc-800 p-2 rounded-lg w-full"
                >
                  <option value="">
                    Bewertung wählen
                  </option>

                  {ratingOptions.map((rating) => (
                    <option
                      key={rating}
                      value={rating}
                    >
                      {rating}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() =>
                    saveRating(
                      movie.id,
                      "Adi",
                      adiRatings[movie.id]
                    )
                  }
                  className="mt-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
                >
                  Adi speichern
                </button>
              </div>
            </div>

            <div className="mt-4">
              Noah: {movie.noahRating ?? "-"}
            </div>

            <div>
              Adi: {movie.adiRating ?? "-"}
            </div>

            <div className="mt-2 text-yellow-400 font-bold">
              Durchschnitt: {movie.average ?? "-"}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}