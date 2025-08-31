// src/app/o-projektu/page.tsx
import Image from "next/image";

export const metadata = {
  title: "O projektu — FM3D",
  description:
    "FM3D — Future Makers: 3D veštine za sutrašnji svet. Kratkoročni Erasmus+ KA122-VET projekat: 3D modelovanje, animacija i 3D web, međunarodna mobilnost i javni rezultati.",
};

export default function OProjektuPage() {
  return (
    <main className="relative">
      {/* suptilna tech pozadina: tanak grid + blagi glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            `linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
             linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(1200px 600px at 50% -20%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[340px] w-[90vw] -translate-x-1/2 -z-10 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(103,232,249,0.18), rgba(167,139,250,0.08) 60%, transparent 70%)",
        }}
      />

      <article className="mx-auto max-w-6xl px-4 pt-28 md:pt-32 pb-16">
        {/* HERO slike: svaka “object-contain”, bez sečenja, sa unutrašnjim odmakom */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { src: "/images/o-projektu/hero1.png", alt: "3D modelovanje — radionica" },
            { src: "/images/o-projektu/hero2.png", alt: "Animacija i interaktivni prikaz" },
            { src: "/images/o-projektu/hero3.png", alt: "Učenici na mobilnosti" },
          ].map((img, i) => (
            <div
              key={i}
              className="relative rounded-2xl border border-white/10 bg-white/[0.03]"
              style={{ aspectRatio: "16/10" }}
            >
              <div className="absolute inset-0 p-3 sm:p-4">
                <div className="relative h-full w-full">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-contain"
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 33vw, 100vw"
                    priority={i === 0}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Naslov + uvod */}
        <header className="mt-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Tvorci budućnosti:{" "}
            <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-lime-300 bg-clip-text text-transparent">
              3D veštine za sutrašnji svet
            </span>
          </h1>
          <p className="mt-3 text-white/80 leading-relaxed">
            FM3D je kratkoročni Erasmus+ KA122-VET projekat koji povezuje školu, industriju i
            zajednicu kroz 3D modelovanje, animaciju i 3D web. Učenici stiču praktične digitalne
            kompetencije, tehnički engleski, iskustvo rada u međunarodnom okruženju i razvijaju
            portfolio radova i javno prenosive rezultate.
          </p>
        </header>

        {/* Transparentno o projektu */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-semibold">Šta radimo</h2>
            <ul className="mt-3 space-y-2 text-white/80 leading-relaxed">
              <li>• 3D modelovanje i priprema modela za 3D štampu (Blender, topologija, optimizacija)</li>
              <li>• Animiranje i programiranje 3D modela za web (Three.js/WebGL, interaktivnost, performanse)</li>
              <li>• Stručni engleski i terminologija za rad u međunarodnom okruženju</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-semibold">Zašto je važno</h2>
            <p className="mt-3 text-white/80 leading-relaxed">
              Učenici vežbaju primenu digitalnih veština u realnim uslovima, upoznaju se sa
              evropskim standardima i jačaju samopouzdanje za dalje školovanje i karijeru
              (posebno u oblastima koje vode ka XR/Web 4.0).
            </p>
          </div>
        </section>

        {/* Ključne činjenice */}
        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-xs uppercase tracking-wide text-white/60">Učesnici</p>
            <p className="mt-1 font-semibold">16 učenika + 2 prateće osobe</p>
          </div>
          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-xs uppercase tracking-wide text-white/60">Trajanje mobilnosti</p>
            <p className="mt-1 font-semibold">12 dana (15. februar 2026. - 28. februar 2026.)</p>
          </div>
          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-xs uppercase tracking-wide text-white/60">Lokacija</p>
            <p className="mt-1 font-semibold">Nemačka — partnerski kampus (IT i mehatronika)</p>
          </div>
        </section>

        {/* Selekcija i inkluzija */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold">Transparentna selekcija</h2>
            <p className="mt-3 text-white/80 leading-relaxed">
              Otvoren konkurs za sve zainteresovane, uz test stručnog znanja, test engleskog i
              motivaciono pismo. Rezultati i kriterijumi su javni i objavljuju se na sajtu škole.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold">Jednake šanse</h2>
            <p className="mt-3 text-white/80 leading-relaxed">
              Posebnu pažnju posvećujemo učenicima iz socio-ekonomski osetljivih grupa, iz
              nerazvijenih/ruralnih sredina i onima koji do sada nisu putovali — cilj nam je da
              pristup bude inkluzivan i fer.
            </p>
          </div>
        </section>

        {/* Faze i aktivnosti */}
        <section className="mt-10 rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold">Faze projekta</h2>
          <ol className="mt-4 space-y-4 text-white/80 leading-relaxed list-decimal pl-5">
            <li>
              <b>Priprema u školi:</b> tehničke radionice (Blender, 3D web), jezička priprema za
              stručnu terminologiju, upoznavanje kulture i industrijskih standarda destinacije.
            </li>
            <li>
              <b>Mobilnost (Nemačka):</b> rad u modernim laboratorijama i studijima uz mentorstvo —
              3D modelovanje, optimizacija za 3D štampu, animacija i interaktivne scene na webu.
            </li>
            <li>
              <b>Po povratku:</b> javne radionice, studije slučaja, portfolio radova, završne
              provere postignuća i evaluacije; rezultati se objavljuju i služe kao reference.
            </li>
          </ol>
        </section>

        {/* Ishodi učenja */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold">Ishodi</h2>
            <ul className="mt-3 space-y-2 text-white/80 leading-relaxed">
              <li>• Tehnička kompetentnost u 3D alatima i optimizaciji</li>
              <li>• Razumevanje pipeline-a od ideje do 3D štampe i web prikaza</li>
              <li>• Jače komunikacione veštine i stručni engleski</li>
              <li>• Vidljiv javni portfolio i evropsko iskustvo</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold">Kako merimo napredak</h2>
            <p className="mt-3 text-white/80 leading-relaxed">
              Dnevnici rada, mini-projekti, stručni testovi i evaluacije nakon povratka, uz
              povratne informacije mentora i profesora engleskog (usmeno/tehnička dokumentacija).
            </p>
          </div>
        </section>

        {/* Partner i bezbednost */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold">Partner</h2>
            <p className="mt-3 text-white/80 leading-relaxed">
              Saradnja sa iskusnim nemačkim centrom za stručno usavršavanje (IT i mehatronika),
              sa opremom i mentorima prilagođenim učenju kroz rad.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold">Kvalitet i bezbednost</h2>
            <p className="mt-3 text-white/80 leading-relaxed">
              Jasna podela uloga, plan nadzora i brige o učesnicima, kontakt tačke i protokoli.
              Poseban akcenat na pedagoškoj podršci i dokumentovanju ishoda.
            </p>
          </div>
        </section>

        {/* Diseminacija i održivost */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold">Diseminacija</h2>
            <p className="mt-3 text-white/80 leading-relaxed">
              Portfolio radova i studije slučaja na sajtu, radionice i ogledni časovi, objave na
              društvenim mrežama, saradnja sa lokalnom zajednicom i školama.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold">Održivost</h2>
            <p className="mt-3 text-white/80 leading-relaxed">
              Materijali i rubrike ulaze u redovnu nastavu i vannastavne aktivnosti; učesnici kao
              mentori prenose znanja narednim generacijama.
            </p>
          </div>
        </section>

        {/* Finansijski okvir — bez pominjanja dnevnica */}
        <section className="mt-10 rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold">Finansijski okvir (kategorije)</h2>
          <ul className="mt-3 space-y-2 text-white/80 leading-relaxed">
            <li>• Organizacijska podrška (priprema, mentorstvo, praćenje, vidljivost)</li>
            <li>• Putni troškovi (standardna putovanja)</li>
            <li>• Inkluziona podrška (učesnici/organizacije, po potrebi)</li>
            <li>• Jezička podrška i pripremne posete (ukoliko su planirane)</li>
          </ul>
          <p className="mt-3 text-sm text-white/60">
            Napomena: raspodela sredstava prati pravila programa i obaveze partnera.
          </p>
        </section>

        {/* FAQ — jednostavan, bez biblioteka */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Česta pitanja</h2>
          <div className="mt-4 space-y-3">
            <details className="group rounded-xl border border-white/10 p-4">
              <summary className="cursor-pointer font-medium list-none">
                Ko može da se prijavi?
              </summary>
              <p className="mt-2 text-white/80">
                Učenici odgovarajućih smerova koji žele praktično 3D iskustvo i timski rad.
                Selekcija se sprovodi kroz jasan i fer postupak objavljen na sajtu škole.
              </p>
            </details>
            <details className="group rounded-xl border border-white/10 p-4">
              <summary className="cursor-pointer font-medium list-none">
                Kako izgleda selekcija?
              </summary>
              <p className="mt-2 text-white/80">
                Test stručnog znanja i engleskog + motivaciono pismo; uz inkluzivne kriterijume i
                javnu objavu rezultata.
              </p>
            </details>
            <details className="group rounded-xl border border-white/10 p-4">
              <summary className="cursor-pointer font-medium list-none">
                Šta dobijam kao učesnik?
              </summary>
              <p className="mt-2 text-white/80">
                Intenzivnu praksu, međunarodno iskustvo, vidljiv portfolio i preporuke/
                sertifikate koje možeš koristiti u daljem obrazovanju i karijeri.
              </p>
            </details>
          </div>
        </section>

        {/* Završna napomena */}
        <section className="mt-10 rounded-2xl border border-white/10 p-5">
          <p className="text-white/80">
            Vesti, konkursi i portfolio biće objavljivani na sajtu škole. Ovo je centralno mesto
            za dokumentovanje i praćenje FM3D rezultata.
          </p>
        </section>
      </article>
    </main>
  );
}
