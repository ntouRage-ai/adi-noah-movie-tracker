import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-5xl font-bold mb-4">
        🎬 Adi & Noah Movie Tracker
      </h1>

      <p className="text-zinc-400 mb-8">
        Das eigene Filmportal von Adi & Noah
      </p>

      <div className="grid gap-4 max-w-md">
        <div className="bg-zinc-900 p-4 rounded-xl">
          <h2 className="font-bold">🎥 Gesehene Filme</h2>
          <p>Noch nicht importiert</p>
        </div>

        <Link
          href="/watchlist"
          className="bg-zinc-900 p-4 rounded-xl block hover:bg-zinc-800"
        >
          <h2 className="font-bold">📚 Watchlist</h2>
          <p>Offene Filme anzeigen</p>
        </Link>

        <Link
          href="/roulette"
          className="bg-zinc-900 p-4 rounded-xl block hover:bg-zinc-800"
        >
          <h2 className="font-bold">🎲 Filmroulette</h2>
          <p>Film zufällig auswählen</p>
        </Link>
      </div>
    </main>
  );
}