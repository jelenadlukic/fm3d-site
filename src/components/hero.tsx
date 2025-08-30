// components/Hero.tsx
"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Ako se komponenta zove drugačije (npr. BeeScene.tsx), promeni putanju ispod
const TScene = dynamic(() => import("@/components/threeScene"), { ssr: false });

type Theme = {
  // boje aurora gradijenta (sa alpha)
  from: string; // npr. "rgba(167,139,250,0.25)"
  via: string;  // npr. "rgba(103,232,249,0.18)"
  to: string;   // npr. "rgba(163,230,53,0.24)"
  // anim parametri (po sekciji menjamo wow-efekat)
  speedSec?: number; // trajanje drift animacije
  beamSpeedSec?: number; // brzina tankih "svetlosnih" traka
  ampX?: string;   // amplitude kretanja, npr. "4%"
  ampY?: string;   // npr. "2%"
  rotDeg?: string; // npr. "2deg"
  scaleMin?: number; // 1.01–1.03
  scaleMax?: number; // 1.04–1.07
  blurPx?: number;   // 48–96
  heightVh?: number; // 60–90 (kolorni blok visine)
};

type SectionItem = {
  id: string;
  title: string;
  desc: string[];
  href: string;
  cta: string;
  align: "left" | "right"; // gde je TEKST (pčela ide na suprotnu stranu)
  theme: Theme;
};

const SECTIONS: SectionItem[] = [
  {
    id: "banner",
    title: "Future Makers 3D — Skills for Tomorrow",
    desc: [
      "FM3D spaja školu, industriju i kreativnu zajednicu kroz 3D tehnologije i savremene nastavne prakse.",
      "Na jednom mestu: studentski radovi, materijali za učenje, priče sa mobilnosti i resursi za mentore i partnere.",
      "Cilj nam je jasan put od ideje do realizacije: tehničko znanje, vizuelno pripovedanje i timski rad.",
    ],
    href: "/portfolio",
    cta: "Pogledaj radove",
    align: "left", // pčela start desno
    theme: {
      from: "rgba(167,139,250,0.28)",
      via:  "rgba(103,232,249,0.22)",
      to:   "rgba(163,230,53,0.26)",
      speedSec: 22, beamSpeedSec: 18,
      ampX: "4%", ampY: "2%", rotDeg: "2deg",
      scaleMin: 1.02, scaleMax: 1.05,
      blurPx: 76, heightVh: 82,
    },
  },
  {
    id: "o-projektu",
    title: "O projektu",
    desc: [
      "Uvodimo 3D modelovanje, animaciju i web u nastavu sistematski i primenjivo.",
      "Program je modularan: osnove 3D-a, priprema asseta, interaktivne web scene i optimizacija.",
      "Ishod su konkretni projekti, vidljiv portfolio i spremnost za dalje školovanje ili angažmane.",
    ],
    href: "/o-projektu",
    cta: "Saznaj više",
    align: "right",
    theme: {
      from: "rgba(244,114,182,0.26)", // pink
      via:  "rgba(59,130,246,0.20)",  // blue
      to:   "rgba(16,185,129,0.24)",  // teal
      speedSec: 28, beamSpeedSec: 22,
      ampX: "5%", ampY: "2.5%", rotDeg: "2.5deg",
      scaleMin: 1.015, scaleMax: 1.06,
      blurPx: 84, heightVh: 78,
    },
  },
  {
    id: "konkurs",
    title: "Konkurs & prijave",
    desc: [
      "Zvaničan konkurs kreće 1. oktobra. Otvoren je za učenike završnih razreda i interdisciplinarne timove.",
      "Evaluiramo cilj, plan rada i inicijalni vizuelni identitet projekta.",
      "Prijava sadrži opis, motivaciju, podelu uloga i referentne primere ili skice.",
    ],
    href: "/konkurs",
    cta: "Prijavi se",
    align: "left",
    theme: {
      from: "rgba(250,204,21,0.26)", // amber
      via:  "rgba(244,114,182,0.18)", // pink
      to:   "rgba(99,102,241,0.22)",  // indigo
      speedSec: 24, beamSpeedSec: 16,
      ampX: "4.5%", ampY: "2%", rotDeg: "2deg",
      scaleMin: 1.02, scaleMax: 1.055,
      blurPx: 72, heightVh: 75,
    },
  },
  {
    id: "ucesnici",
    title: "Učesnici",
    desc: [
      "Autori i mentori, sa procesom: od skice i blokiranja do finala i dokumentacije.",
      "Refleksija: šta je funkcionisalo, šta menjamo i koje veštine su savladane.",
      "Radovi su citabilni i služe kao profesionalne reference.",
    ],
    href: "/ucesnici",
    cta: "Pogledaj učesnike",
    align: "right",
    theme: {
      from: "rgba(52,211,153,0.26)",  // emerald
      via:  "rgba(250,204,21,0.18)",  // amber
      to:   "rgba(59,130,246,0.22)",  // blue
      speedSec: 26, beamSpeedSec: 20,
      ampX: "5.2%", ampY: "2.2%", rotDeg: "2.2deg",
      scaleMin: 1.018, scaleMax: 1.058,
      blurPx: 80, heightVh: 80,
    },
  },
  {
    id: "portfolio",
    title: "Portfolio radova",
    desc: [
      "Selektovani 3D modeli, animacije i web scene — sa tehničkim specifikacijama i jasno definisanim ciljevima.",
      "Radovi su grupisani po tehnologijama, sa kratkim osvrtom na izazove i rešenja.",
      "Svaki unos ima vizuelni pregled, opis i mini dnevnik rada.",
    ],
    href: "/portfolio",
    cta: "Otvori portfolio",
    align: "left",
    theme: {
      from: "rgba(147,51,234,0.28)", // purple
      via:  "rgba(34,197,94,0.20)", // green
      to:   "rgba(244,63,94,0.22)", // rose
      speedSec: 21, beamSpeedSec: 18,
      ampX: "4%", ampY: "1.8%", rotDeg: "1.8deg",
      scaleMin: 1.02, scaleMax: 1.05,
      blurPx: 88, heightVh: 82,
    },
  },
  {
    id: "mobilnosti",
    title: "Mobilnosti (Erasmus+)",
    desc: [
      "Učenje u međunarodnim centrima i realnim produkcionim uslovima.",
      "Po povratku: prenos znanja kroz radionice, tutorijale i interne prezentacije.",
      "Most između škole i industrije: standardi, komunikacija i odgovornost.",
    ],
    href: "/mobilnosti",
    cta: "Vidi detalje",
    align: "right",
    theme: {
      from: "rgba(59,130,246,0.26)", // blue
      via:  "rgba(236,72,153,0.20)", // fuchsia
      to:   "rgba(16,185,129,0.22)", // teal
      speedSec: 29, beamSpeedSec: 19,
      ampX: "5.8%", ampY: "2.6%", rotDeg: "2.6deg",
      scaleMin: 1.016, scaleMax: 1.06,
      blurPx: 78, heightVh: 78,
    },
  },
  {
    id: "resursi",
    title: "Resursi",
    desc: [
      "Materijali za učenje, šabloni i checkliste za optimizaciju 3D i web performansi.",
      "Start paketi pomažu da brže krenete i izbegnete tipične greške.",
      "Redovno ažuriramo na osnovu prakse i povratnih informacija.",
    ],
    href: "/resursi",
    cta: "Preuzmi resurse",
    align: "left",
    theme: {
      from: "rgba(34,197,94,0.26)",  // green
      via:  "rgba(99,102,241,0.20)", // indigo
      to:   "rgba(250,204,21,0.22)", // amber
      speedSec: 23, beamSpeedSec: 17,
      ampX: "4.6%", ampY: "2%", rotDeg: "2deg",
      scaleMin: 1.02, scaleMax: 1.055,
      blurPx: 72, heightVh: 76,
    },
  },
  {
    id: "vesti",
    title: "Vesti & blog",
    desc: [
      "Novosti, najave radionica i mini studije slučaja iz učionice.",
      "Delimo šta je radilo, šta bismo drugačije i trikove koji ubrzavaju produkciju.",
      "Pratite dešavanja u FM3D zajednici i uključite se.",
    ],
    href: "/vesti",
    cta: "Čitaj vesti",
    align: "right",
    theme: {
      from: "rgba(244,63,94,0.26)",  // rose
      via:  "rgba(56,189,248,0.20)", // sky
      to:   "rgba(163,230,53,0.22)", // lime
      speedSec: 27, beamSpeedSec: 21,
      ampX: "5.4%", ampY: "2.4%", rotDeg: "2.4deg",
      scaleMin: 1.018, scaleMax: 1.06,
      blurPx: 84, heightVh: 80,
    },
  },
  {
    id: "contact",
    title: "Kontakt",
    desc: [
      "Imate pitanje ili predlog za saradnju? Pišite nam — otvoreni smo za partnerstva.",
      "Zajedno možemo podići standarde nastave i omogućiti relevantno, primenjivo znanje.",
      "Radujemo se novim izazovima i projektima.",
    ],
    href: "/kontakt",
    cta: "Kontaktiraj nas",
    align: "left",
    theme: {
      from: "rgba(103,232,249,0.26)", // cyan
      via:  "rgba(167,139,250,0.20)", // violet
      to:   "rgba(34,197,94,0.22)",   // green
      speedSec: 24, beamSpeedSec: 16,
      ampX: "4%", ampY: "2%", rotDeg: "2deg",
      scaleMin: 1.02, scaleMax: 1.05,
      blurPx: 72, heightVh: 70,
    },
  },
];

function Aurora({
  side,
  theme,
}: {
  side: "left" | "right"; // i dalje šaljemo stranu teksta (radi beams maske)
  theme: {
    from: string; via: string; to: string;
    speedSec?: number; beamSpeedSec?: number;
    ampX?: string; ampY?: string; rotDeg?: string;
    scaleMin?: number; scaleMax?: number;
    blurPx?: number;
    widthVw?: number;  // širina oblaka u vw (novo)
    heightVh?: number; // visina oblaka u vh (novo)
    bobSec?: number;   // brzina gore-dole (novo)
    bobAmpVh?: number; // amplituda gore-dole u vh (novo)
  };
}) {
  const isLeft = side === "left";
  const {
    from, via, to,
    speedSec = 14,
    beamSpeedSec = 12,
    ampX = "3%",
    ampY = "1.2%",
    rotDeg = "1.2deg",
    scaleMin = 1.01,
    scaleMax = 1.035,
    blurPx = 48,
    widthVw = 90,     // manja, kompaktnija aurora
    heightVh = 48,    // ~pola ekrana
    bobSec = 9,       // brži bob
    bobAmpVh = 3,     // amplitude gore–dole
  } = theme;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* BOB WRAPPER — centriran u sekciji i pomera se gore–dole */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 auroraBob"
        style={
          {
            width: `${widthVw}vw`,
            height: `${heightVh}vh`,
            // @ts-ignore – CSS var za amplitudu i brzinu
            "--bobAmpVh": `${bobAmpVh}vh`,
            "--bobSec": `${bobSec}s`,
          } as React.CSSProperties
        }
      >
        {/* Glavni aurora „oblak“ — drift, rot, scale (transform na INNER) */}
        <div
          className="w-full h-full"
          style={{
            filter: `blur(${blurPx}px) saturate(1.08)`,
            background: `
              radial-gradient(38% 58% at 22% 18%, ${from}, transparent 60%),
              radial-gradient(32% 50% at 70% 32%, ${via}, transparent 60%),
              radial-gradient(28% 44% at 42% 68%, ${to},  transparent 60%)
            `,
            // anim parametri (drift)
            // @ts-ignore
            "--ax": ampX, "--ay": ampY, "--rot": rotDeg, "--smin": scaleMin, "--smax": scaleMax,
            animation: `auroraQuick ${speedSec}s ease-in-out infinite`,
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 18%, rgba(0,0,0,0.9) 48%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 18%, rgba(0,0,0,0.9) 48%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>

      {/* Svetlosne trake (zadržavamo, brzina po sekciji) */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: `${Math.max(50, heightVh - 2)}vh`,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.0) 60%), radial-gradient(1000px 260px at 50% 0%, rgba(255,255,255,0.04), rgba(0,0,0,0))",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.5) 22%, rgba(0,0,0,0.9) 65%, rgba(0,0,0,0))",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.5) 22%, rgba(0,0,0,0.9) 65%, rgba(0,0,0,0))",
          animation: `beams ${beamSpeedSec}s linear infinite`,
          opacity: 0.9,
          mixBlendMode: "screen",
        }}
      />

      {/* Dug top / bottom feather (bez linija između sekcija) */}
      <div className="absolute inset-x-0 top-0 h-[14vh] bg-gradient-to-b from-black via-black/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[16vh] bg-gradient-to-b from-transparent via-black/70 to-black" />

      {/* Suptilni „grain“ */}
      <div className="absolute inset-0 opacity-[0.06] mix-blend-soft-light grain" />
    </div>
  );
}


export default function Hero() {
  return (
    <section className="relative">
      {/* 3D pčelica preko sadržaja; canvas providan, pointer-events: none */}
      <TScene />

      {SECTIONS.map((s) => {
        const isLeft = s.align === "left"; // TEKST levo? pčela je desno
        return (
          <section
            key={s.id}
            id={s.id}
            className="section relative isolate min-h-screen flex items-center px-4 bg-black overflow-hidden"
            >
            <Aurora side={isLeft ? "left" : "right"} theme={s.theme} />

            <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 md:grid-cols-12 items-center gap-10">
              <div className={isLeft ? "md:col-span-7" : "md:col-start-6 md:col-span-7 md:text-right"}>
                <h2
                  className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(167,139,250,1) 0%, rgba(103,232,249,1) 45%, rgba(163,230,53,1) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {s.title}
                </h2>

                <div className="mt-6 space-y-4 text-white/85 text-base sm:text-lg">
                  {s.desc.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                <div className={isLeft ? "mt-8" : "mt-8 flex justify-end"}>
                  <Button
                    asChild
                    className="rounded-2xl px-8 py-7 text-lg bg-cyan-500 text-black hover:bg-cyan-400 hover:shadow-[0_0_28px_rgba(34,211,238,0.35)]"
                  >
                    <Link href={s.href}>{s.cta}</Link>
                  </Button>
                </div>
              </div>

              {/* prazan stub da „diše“ i ostavi prostor pčeli */}
              <div className={isLeft ? "md:col-start-9 md:col-span-4" : "md:col-span-4"} />
            </div>
          </section>
        );
      })}

      {/* Globalne animacije (jednom u fajlu) */}
      <style jsx global>{`
        @keyframes auroraDrift {
          0%   { transform: translate3d(calc(var(--ax, 4%) * -1), calc(var(--ay, 2%) * -1), 0) rotate(calc(var(--rot, 2deg) * -1)) scale(var(--smin, 1.02)); }
          50%  { transform: translate3d(var(--ax, 4%), var(--ay, 2%), 0) rotate(var(--rot, 2deg)) scale(var(--smax, 1.05)); }
          100% { transform: translate3d(calc(var(--ax, 4%) * -1), calc(var(--ay, 2%) * -1), 0) rotate(calc(var(--rot, 2deg) * -1)) scale(var(--smin, 1.02)); }
        }
        @keyframes auroraQuick {
          0%   { transform: translate3d(calc(var(--ax, 3%) * -1), calc(var(--ay, 1.2%) * -1), 0) rotate(calc(var(--rot, 1.2deg) * -1)) scale(var(--smin, 1.01)); }
          50%  { transform: translate3d(var(--ax, 3%), var(--ay, 1.2%), 0) rotate(var(--rot, 1.2deg)) scale(var(--smax, 1.035)); }
          100% { transform: translate3d(calc(var(--ax, 3%) * -1), calc(var(--ay, 1.2%) * -1), 0) rotate(calc(var(--rot, 1.2deg) * -1)) scale(var(--smin, 1.01)); }
        }
      .auroraBob {
          animation: auroraBob var(--bobSec, 9s) ease-in-out infinite;
          will-change: transform;
        }
        @keyframes auroraBob {
          0%   { transform: translate(-50%, -50%) translateY(calc(var(--bobAmpVh, 3vh) * -1)); }
          50%  { transform: translate(-50%, -50%) translateY(calc(var(--bobAmpVh, 3vh))); }
          100% { transform: translate(-50%, -50%) translateY(calc(var(--bobAmpVh, 3vh) * -1)); }
        }

        /* (Već imaš) */
        @keyframes beams {
          0%   { background-position: 0 0, 50% 0%; }
          100% { background-position: 100% 0, 50% 0%; }
        }

        .grain {
          background-image: url("data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.9'/%3E%3C/svg%3E");
          background-size: 160px 160px;
          animation: grainShift 8s steps(10) infinite;
        }
        @keyframes grainShift {
          0%   { transform: translate3d(0,0,0); }
          100% { transform: translate3d(-10px, 6px, 0); }
        }
      `}</style>
    </section>
  );
}
