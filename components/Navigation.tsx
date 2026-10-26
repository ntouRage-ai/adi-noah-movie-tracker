import Link from "next/link";

export default function Navigation() {
  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      <Link
        href="/"
        className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl"
      >
        🏠 Dashboard
      </Link>

      <Link
        href="/watchlist"
        className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl"
      >
        📚 Watchlist
      </Link>

      <Link
        href="/roulette"
        className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl"
      >
        🎲 Roulette
      </Link>

      <Link
        href="/movies"
        className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl"
      >
        🎥 Filme
      </Link>

      <Link
  href="/ratings"
  className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl"
>
  ⭐ Bewertungen
</Link>
    </div>
  );
}