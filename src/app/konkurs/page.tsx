export const metadata = {
  title: "Konkurs — FM3D",
  description:
    "Zvanični konkurs za učešće u FM3D projektu. Detalji i uputstva biće objavljeni na ovoj stranici.",
};

export default function KonkursPage() {
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
          Konkurs
        </h1>
        <p className="mt-2 max-w-2xl text-white/70">
          Zvanični konkurs za učešće u projektu biće <b>otvoren od 1. oktobra 2025. </b>
          Na ovoj stranici objavićemo sve informacije: uslove, kriterijume selekcije,
          potreban materijal i rokove.
        </p>
      </header>

      {/* Prazno stanje – bez dugmadi i bez okvira */}
      <section className="py-2">
        <p className="text-white/70 max-w-3xl leading-relaxed">
          Pripremite osnovne podatke (biografija, kontakt), motivaciono pismo i linkove ka
          svojim radovima (ako ih imate). Detaljna uputstva, obrasci i tačni datumi biće
          objavljeni ovde kako se konkurs približava. Hvala na interesovanju za FM3D —
          Future Makers: 3D skills for tomorrow.
        </p>
      </section>
    </main>
  );
}
