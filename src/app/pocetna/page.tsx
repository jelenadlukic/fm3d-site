// components/Hero.tsx
"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const TScene = dynamic(() => import("@/components/threeScene"), { ssr: false });

type Theme = {
  from: string;
  via: string;
  to: string;
  speedSec?: number;
  beamSpeedSec?: number;
  ampX?: string;
  ampY?: string;
  rotDeg?: string;
  scaleMin?: number;
  scaleMax?: number;
  blurPx?: number;
  heightVh?: number;
};

type SectionItem = {
  id: string;
  title: string;
  desc: string[];
  href: string;
  cta: string;
  align: "left" | "right";
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
    align: "left",
    theme: {
      from: "rgba(167,139,250,0.28)",
      via: "rgba(103,232,249,0.22)",
      to: "rgba(163,230,53,0.26)",
      speedSec: 22,
      beamSpeedSec: 18,
      ampX: "4%",
      ampY: "2%",
      rotDeg: "2deg",
      scaleMin: 1.02,
      scaleMax: 1.05,
      blurPx: 76,
      heightVh: 82,
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
      from: "rgba(244,114,182,0.26)",
      via: "rgba(59,130,246,0.20)",
      to: "rgba(16,185,129,0.24)",
      speedSec: 28,
      beamSpeedSec: 22,
      ampX: "5%",
      ampY: "2.5%",
      rotDeg: "2.5deg",
      scaleMin: 1.015,
      scaleMax: 1.06,
      blurPx: 84,
      heightVh: 78,
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
      from: "rgba(250,204,21,0.26)",
      via: "rgba(244,114,182,0.18)",
      to: "rgba(99,102,241,0.22)",
      speedSec: 24,
      beamSpeedSec: 16,
      ampX: "4.5%",
      ampY: "2%",
      rotDeg: "2deg",
      scaleMin: 1.02,
      scaleMax: 1.055,
      blurPx: 72,
      heightVh: 75,
    },
  },
  {
    id: "ucesnici",
    title: "Učesnici",
    desc: [
      "Autori i mentori: od skice do finala i dokumentacije.",
      "Refleksija: šta je funkcionisalo, šta menjamo, koje veštine su savladane.",
      "Radovi služe kao profesionalne reference.",
    ],
    href: "/ucesnici",
    cta: "Pogledaj učesnike",
    align: "right",
    theme: {
      from: "rgba(52,211,153,0.26)",
      via: "rgba(250,204,21,0.18)",
      to: "rgba(59,130,246,0.22)",
      speedSec: 26,
      beamSpeedSec: 20,
      ampX: "5.2%",
      ampY: "2.2%",
      rotDeg: "2.2deg",
      scaleMin: 1.018,
      scaleMax: 1.058,
      blurPx: 80,
      heightVh: 80,
    },
  },
  {
    id: "portfolio",
    title: "Portfolio radova",
    desc: [
      "Selektovani 3D modeli, animacije i web scene — sa tehničkim specifikacijama i jasno definisanim ciljevima.",
      "Radovi su grupisani po tehnologijama, sa kratkim osvrtom na izazaje i rešenja.",
      "Svaki unos ima vizuelni pregled, opis i mini dnevnik rada.",
    ],
    href: "/portfolio",
    cta: "Otvori portfolio",
    align: "left",
    theme: {
      from: "rgba(147,51,234,0.28)",
      via: "rgba(34,197,94,0.20)",
      to: "rgba(244,63,94,0.22)",
      speedSec: 21,
      beamSpeedSec: 18,
      ampX: "4%",
      ampY: "1.8%",
      rotDeg: "1.8deg",
      scaleMin: 1.02,
      scaleMax: 1.05,
      blurPx: 88,
      heightVh: 82,
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
      from: "rgba(59,130,246,0.26)",
      via: "rgba(236,72,153,0.20)",
      to: "rgba(16,185,129,0.22)",
      speedSec: 29,
      beamSpeedSec: 19,
      ampX: "5.8%",
      ampY: "2.6%",
      rotDeg: "2.6deg",
      scaleMin: 1.016,
      scaleMax: 1.06,
      blurPx: 78,
      heightVh: 78,
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
      from: "rgba(34,197,94,0.26)",
      via: "rgba(99,102,241,0.20)",
      to: "rgba(250,204,21,0.22)",
      speedSec: 23,
      beamSpeedSec: 17,
      ampX: "4.6%",
      ampY: "2%",
      rotDeg: "2deg",
      scaleMin: 1.02,
      scaleMax: 1.055,
      blurPx: 72,
      heightVh: 76,
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
      from: "rgba(244,63,94,0.26)",
      via: "rgba(56,189,248,0.20)",
      to: "rgba(163,230,53,0.22)",
      speedSec: 27,
      beamSpeedSec: 21,
      ampX: "5.4%",
      ampY: "2.4%",
      rotDeg: "2.4deg",
      scaleMin: 1.018,
      scaleMax: 1.06,
      blurPx: 84,
      heightVh: 80,
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
      from: "rgba(103,232,249,0.26)",
      via: "rgba(167,139,250,0.20)",
      to: "rgba(34,197,94,0.22)",
      speedSec: 24,
      beamSpeedSec: 16,
      ampX: "4%",
      ampY: "2%",
      rotDeg: "2deg",
      scaleMin: 1.02,
      scaleMax: 1.05,
      blurPx: 72,
      heightVh: 70,
    },
  },
];

function Aurora({
  side,
  theme,
}: {
  side: "left" | "right";
  theme: {
    from: string; via: string; to: string;
    speedSec?: number; beamSpeedSec?: number;
    ampX?: string; ampY?: string; rotDeg?: string;
    scaleMin?: number; scaleMax?: number;
    blurPx?: number;
    widthVw?: number;
    heightVh?: number;
    bobSec?: number;
    bobAmpVh?: number;
  };
}) {
  const {
    from, via, to,
    speedSec = 14,
    beamSpeedSec = 12,
    blurPx = 48,
    widthVw = 90,
    heightVh = 48,
    bobSec = 9,
    bobAmpVh = 3,
  } = theme;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 auroraBob"
        style={
          {
            width: `${widthVw}vw`,
            height: `${heightVh}vh`,
            // @ts-ignore
            "--bobAmpVh": `${bobAmpVh}vh`,
            // @ts-ignore
            "--bobSec": `${bobSec}s`,
          } as React.CSSProperties
        }
      >
        <div
          className="w-full h-full"
          style={{
            filter: `blur(${blurPx}px) saturate(1.08)`,
            background: `
              radial-gradient(38% 58% at 22% 18%, ${from}, transparent 60%),
              radial-gradient(32% 50% at 70% 32%, ${via}, transparent 60%),
              radial-gradient(28% 44% at 42% 68%, ${to},  transparent 60%)
            `,
            // @ts-ignore
            "--ax": "3%", "--ay": "1.2%", "--rot": "1.2deg", "--smin": 1.01, "--smax": 1.035,
            animation: `auroraQuick ${speedSec}s ease-in-out infinite`,
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 18%, rgba(0,0,0,0.9) 48%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 18%, rgba(0,0,0,0.9) 48%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>

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

      <div className="absolute inset-x-0 top-0 h-[14vh] bg-gradient-to-b from-black via-black/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[16vh] bg-gradient-to-b from-transparent via-black/70 to-black" />
      <div className="absolute inset-0 opacity-[0.06] mix-blend-soft-light grain" />
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative">
      <TScene />

      {SECTIONS.map((s) => {
        const isLeft = s.align === "left";
        const mobileTheme = {
          ...s.theme,
          heightVh: Math.min(s.theme.heightVh ?? 80, 64),
        };

        const titleAlign = isLeft ? "text-left" : "text-right ml-auto";
        const bodyAlign = isLeft ? "text-left" : "text-right ml-auto";
        const ctaAlign = isLeft ? "justify-start" : "justify-end";

        return (
          <section
            key={s.id}
            id={s.id}
            className="
              section relative isolate
              lg:min-h-screen
              py-16 sm:py-20 lg:py-0
              flex items-center
              px-4 sm:px-6 lg:px-8
              bg-black overflow-hidden
            "
          >
            <div className="absolute inset-0">
              <Aurora side={isLeft ? "left" : "right"} theme={mobileTheme} />
            </div>

            <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 md:grid-cols-12 items-center gap-8 sm:gap-10 lg:gap-12">
              <div className={isLeft ? "md:col-span-7" : "md:col-start-6 md:col-span-7"}>
                <h2
                  className={[
                    "text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight",
                    "max-w-4xl",
                    titleAlign,
                  ].join(" ")}
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(167,139,250,1) 0%, rgba(103,232,249,1) 45%, rgba(163,230,53,1) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {s.title}
                </h2>

                <div
                  className={[
                    "mt-6 text-white/85 text-base sm:text-lg space-y-4 sm:space-y-5",
                    "max-w-prose",
                    bodyAlign,
                  ].join(" ")}
                >
                  {s.desc.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                <div className={["mt-8 flex", ctaAlign].join(" ")}>
                  <Button
                    asChild
                    className="
                      rounded-2xl
                      px-6 py-5 lg:px-8 lg:py-7
                      text-base lg:text-lg
                      bg-cyan-500 text-black
                      hover:bg-cyan-400
                      hover:shadow-[0_0_28px_rgba(34,211,238,0.35)]
                    "
                  >
                    <Link href={s.href}>{s.cta}</Link>
                  </Button>
                </div>
              </div>

              <div className={isLeft ? "hidden md:block md:col-start-9 md:col-span-4" : "hidden md:block md:col-span-4"} />
            </div>
          </section>
        );
      })}
    </section>
  );
}
