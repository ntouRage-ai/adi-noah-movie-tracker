"use client";

import Navigation from "../../components/Navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type RatingMap = {
  [key: string]: number;
};

type MovieWithAverage = {
  id: string;
  title: string;
  original_title?: string;
  poster_url?: string;
  overview?: string;
  release_year?: number;
  tmdb_rating?: number;
  category?: string;
  subcategory?: string;
  noahRating?: number;
  adiRating?: number;
  average?: number;
};

export default function RatingsPage() {
  const [movies, setMovies] = useState<MovieWithAverage[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState("Alle");
  const [search, setSearch] = useState("");

  const [noahRatings, setNoahRatings] =
    useState<RatingMap>({});

  const [adiRatings, setAdiRatings] =
    useState<RatingMap>({});

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

    const movieList = movieData.map((movie) => {
      const noah = noahMap[movie.id];
      const adi = adiMap[movie.id];

      let average;

      if (noah && adi) {
        average = Number(
          ((noah + adi) / 2).toFixed(1)
        );
      }

      return {
        ...movie,
        noahRating: noah,
        adiRating: adi,
        average,
      };
    });

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

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        movies
          .map((movie) => movie.category)
          .filter(Boolean)
      )
    );

    return ["Alle", ...uniqueCategories];
  }, [movies]);

  const filteredMovies = useMemo(() => {
    let result = movies;

    if (selectedCategory !== "Alle") {
      result = result.filter(
        (movie) =>
          movie.category === selectedCategory
      );
    }

    if (search.trim()) {
      result = result.filter(
        (movie) =>
          movie.title
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          movie.original_title
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    return result;
  }, [movies, selectedCategory, search]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <Navigation />

      <div className="flex flex-wrap gap-4 items-center mb-6">
        <h1 className="text-5xl font-bold">
          ⭐ Bewertungen
        </h1>

        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="🔍 Film suchen..."
          className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 min-w-[250px]"
        />

        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
          className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2"
        >
          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="text-zinc-400 mb-6">
        Kategorie: {selectedCategory} •{" "}
        {filteredMovies.length} Treffer
      </div>

      <div className="grid gap-6">
        {filteredMovies.map((movie, index) => (
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
                  <div className="h-80 bg-zinc-800 flex items-center justify-center text-4xl">
                    🎬
                  </div>
                )}
              </div>

              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-2xl font-bold">
                    {movie.title}
                  </h2>

                  {index === 0 && (
                    <span className="text-yellow-400 font-bold">
                      🏆 Platz 1
                    </span>
                  )}
                </div>

                {movie.original_title &&
                  movie.original_title !== movie.title && (
                    <div className="text-zinc-400">
                      Originaltitel:{" "}
                      {movie.original_title}
                    </div>
                  )}

                <div className="flex gap-2 flex-wrap mt-3">
                  {movie.category && (
                    <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                      {movie.category}
                    </span>
                  )}

                  {movie.subcategory && (
                    <span className="bg-purple-600 px-3 py-1 rounded-full text-sm">
                      {movie.subcategory}
                    </span>
                  )}
                </div>

                <div className="flex gap-6 mt-3 text-sm text-zinc-300 flex-wrap">
                  {movie.release_year && (
                    <span>
                      📅 {movie.release_year}
                    </span>
                  )}

                  {movie.tmdb_rating && (
                    <span>
                      ⭐ TMDB{" "}
                      {movie.tmdb_rating.toFixed(1)}
                    </span>
                  )}

                  {movie.average && (
                    <span className="text-yellow-400 font-bold">
                      🏆 Durchschnitt{" "}
                      {movie.average.toFixed(1)}
                    </span>
                  )}
                </div>

                {movie.overview && (
                  <p className="mt-4 text-zinc-300">
                    {movie.overview}
                  </p>
                )}

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <label className="block mb-2">
                      Noah
                    </label>

                    <select
                      value={
                        noahRatings[movie.id] ?? ""
                      }
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
                      value={
                        adiRatings[movie.id] ?? ""
                      }
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

                <div className="mt-4 text-zinc-300">
                  Noah: {movie.noahRating ?? "-"}
                </div>

                <div className="text-zinc-300">
                  Adi: {movie.adiRating ?? "-"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}