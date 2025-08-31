import { Users } from "lucide-react";

export const metadata = {
  title: "Radovi — FM3D",
  description:
    "Na ovoj stranici biće istaknuti radovi učenika.",
};

export default function PortfolioPage() {
  return (
    <main className="relative mx-auto max-w-6xl px-4 py-10">
      {/* FULL-WIDTH glow kao na početnoj */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-48 w-[100vw]
                   -translate-x-1/2 blur-3xl
                   bg-gradient-to-r from-purple-500/15 via-cyan-400/15 to-lime-400/15"
      />

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Radovi
        </h1>
        <p className="mt-2 max-w-2xl text-white/70">
         Na ovoj stranici biće istaknuti radovi učenika.
        </p>
      </header>

      
    </main>
  );
}
