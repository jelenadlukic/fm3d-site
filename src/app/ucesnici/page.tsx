import { Users } from "lucide-react";

export const metadata = {
  title: "Učesnici — FM3D",
  description:
    "Na ovoj stranici biće istaknuti svi učesnici projekta FM3D nakon završetka konkursa i selekcije.",
};

export default function UcesniciPage() {
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
          Učesnici projekta
        </h1>
        <p className="mt-2 max-w-2xl text-white/70">
         Na ovoj stranici biće istaknuti svi učesnici projekta nakon završetka konkursa i
         transparentne selekcije. Biografije i uloge (učenik, profesor..) biće
         povezane sa portfolijom radova i aktivnostima.
        </p>
      </header>

      
    </main>
  );
}
