import { Mail, Phone, MapPin, Building2, User, Clock, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "Kontakt — ETŠ „Nikola Tesla“ Niš | FM3D",
  description:
    "Zvanični kontakt ETŠ „Nikola Tesla“ u Nišu: adresa, telefoni, mejlovi, direktor i finansije.",
};

export default function KontaktPage() {
  return (
    <main className="relative mx-auto max-w-4xl px-16 py-10 pb-128 md:pb-66">
      {/* 3D/tech background (samo CSS, lagano) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 480px at 18% 12%, rgba(167,139,250,0.12), transparent 60%), radial-gradient(1000px 520px at 82% 18%, rgba(103,232,249,0.10), transparent 65%), radial-gradient(1100px 520px at 50% 95%, rgba(163,230,53,0.10), transparent 70%)",
            filter: "blur(28px) saturate(1.04)",
            mixBlendMode: "screen",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 animate-[spin_120s_linear_infinite]"
          style={{
            background:
              "conic-gradient(from 210deg at 70% 20%, rgba(103,232,249,0.07), rgba(167,139,250,0.08), rgba(163,230,53,0.07), rgba(103,232,249,0.07))",
            maskImage:
              "radial-gradient(60% 50% at 50% 28%, black 55%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(60% 50% at 50% 28%, black 55%, transparent 100%)",
            filter: "blur(30px)",
          }}
        />
      </div>

      {/* FULL-WIDTH glow traka gore */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-48 w-[100vw] -translate-x-1/2 blur-3xl bg-gradient-to-r from-purple-500/15 via-cyan-400/15 to-lime-400/15" />

      {/* Škola */}
      <article className="mb-6 w-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white/10 p-3">
            <Building2 className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h3 className="text-lg font-semibold">ETŠ „Nikola Tesla“ — Niš</h3>
            <ul className="mt-3 space-y-2 text-white/80">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5" />
                <span>Aleksandra Medvedeva 18, 18104 Niš, Srbija</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 mt-0.5" />
                <a className="underline hover:text-white" href="mailto:etstesla@etstesla.ni.ac.rs">
                  etstesla@etstesla.ni.ac.rs
                </a>
              </li>

              {/* jedan red za oba telefona, bez duplog ikona */}
              <li className="flex items-start gap-2">
                <Phone className="h-5 w-5 mt-0.5" />
                <span className="space-x-3">
                  <a className="underline hover:text-white" href="tel:+38118588583">018 588 583</a>
                  <span className="opacity-60">•</span>
                  <a className="underline hover:text-white" href="tel:+38118588051">018 588 051</a>
                </span>
              </li>

              <li className="flex items-start gap-2">
                <Clock className="h-5 w-5 mt-0.5" />
                <span>Radno vreme škole: radnim danima</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <iframe
            title="Mapa — ETŠ Nikola Tesla Niš"
            src="https://www.google.com/maps?q=Aleksandra%20Medvedeva%2018%2C%20Ni%C5%A1&output=embed"
            className="h-56 w-full"
            loading="lazy"
          />
        </div>

        <div className="mt-2 text-right">
          <a
            href="https://www.google.com/maps?q=Aleksandra+Medvedeva+18,+Ni%C5%A1"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs underline text-white/80 hover:text-white"
          >
            Otvori u Google Mapama <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </article>

      {/* Direktor */}
      <article className="mb-6 w-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white/10 p-3">
            <User className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Direktor</h3>
            <p className="text-white/90">Nebojša Sokolović</p>
            <ul className="mt-3 space-y-2 text-white/80">
              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 mt-0.5" />
                <a className="underline hover:text-white" href="mailto:direktor@etstesla.ni.ac.rs">
                  direktor@etstesla.ni.ac.rs
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-5 w-5 mt-0.5" />
                <a className="underline hover:text-white" href="tel:+38118588583">
                  018 588 583
                </a>
              </li>
            </ul>
          </div>
        </div>
      </article>

      {/* napomena */}
      <p className="mt-6 text-xs text-white/50">
        Kontakt podaci su preuzeti sa zvanične stranice škole (provereno{" "}
        {new Date().toLocaleDateString("sr-RS")}). 
      </p>
    </main>
  );
}
