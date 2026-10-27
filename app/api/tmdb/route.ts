import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function enrichTable(table: "movies" | "watchlist") {
  const { data } = await supabase
    .from(table)
    .select("*");

  const apiKey = process.env.TMDB_API_KEY;

  if (!data) return;

  for (const item of data) {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          item.title
        )}&language=de-DE&api_key=${apiKey}`
      );

      const result = await response.json();

      if (!result.results?.length) continue;

      const movie = result.results[0];

      await supabase
        .from(table)
        .update({
          tmdb_id: movie.id,
          original_title: movie.original_title,
          poster_url: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,
          overview: movie.overview,
          release_year: movie.release_date
            ? Number(movie.release_date.substring(0, 4))
            : null,
          tmdb_rating: movie.vote_average,
        })
        .eq("id", item.id);
    } catch (error) {
      console.error(error);
    }
  }
}

export async function GET() {
  await enrichTable("movies");
  await enrichTable("watchlist");

  return NextResponse.json({
    success: true,
  });
}