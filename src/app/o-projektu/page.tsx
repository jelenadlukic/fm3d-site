import Image from "next/image";

export const metadata = {
  title: "O projektu — FM3D",
  description:
    "FM3D — Future Makers: 3D skills for tomorrow. Kratkoročni Erasmus+ KA122-VET projekat: 3D modelovanje, animacija i programiranje 3D sadržaja, mobilnosti i razvoj ključnih digitalnih veština.",
};

export default function OProjektuPage() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-10">
      {/* HERO: 3 slike, bez croppinga + unutrašnji razmak */}
        <div className="grid gap-3 sm:grid-cols-3">
        {[
            { src: "/images/o-projektu/hero1.png", alt: "3D modelovanje — radionica" },
            { src: "/images/o-projektu/hero2.png", alt: "Animacija i interaktivni prikaz" },
            { src: "/images/o-projektu/hero3.png", alt: "Učenici na mobilnosti" },
        ].map((img, i) => (
            <div
            key={i}
            className="relative overflow-hidden rounded-xl border border-border
                        h-56 sm:h-64 md:h-72 bg-[rgba(255,255,255,0.02)]"
            >
            {/* Unutrašnji pading da slika ne dodiruje ivice */}
            <div className="absolute inset-0 p-3 md:p-4">
                <div className="relative w-full h-full">
                <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-contain object-center"
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 33vw, 100vw"
                    priority={i === 0}
                />
                </div>
            </div>
            </div>
        ))}
        </div>


      {/* Naslov i uvod */}
      <header className="mt-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Tvorci budućnosti:{" "}
          <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-lime-300 bg-clip-text text-transparent">
            3D veštine za sutrašnji svet
          </span>
        </h1>
        <p className="mt-3 text-white/70">
          FM3D je kratkoročni Erasmus+ KA122-VET projekat osmišljen da učenicima
          omogući praktično učenje 3D modelovanja, animacije i programiranja 3D
          sadržaja (web), uz razvoj engleskog jezika, timskog rada i
          preduzetničkog duha. Projekat obuhvata pripremu u školi, međunarodnu
          mobilnost i javnu prezentaciju rezultata (portfolio radova, radionice,
          vesti i resursi na sajtu škole).
        </p>
      </header>

      {/* Stat kartice */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs uppercase tracking-wide text-white/60">
            Fokus
          </p>
          <p className="mt-1 font-semibold">
            3D modelovanje · animacija · web 3D
          </p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs uppercase tracking-wide text-white/60">
            Oblasti učenja
          </p>
          <p className="mt-1 font-semibold">Blender · priprema za 3D štampu · Three.js/WebGL</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs uppercase tracking-wide text-white/60">
            Ishodi
          </p>
          <p className="mt-1 font-semibold">Portfolio radova · Europass · sertifikati</p>
        </div>
      </section>

      {/* Pozadina i svrha */}
      <section className="mt-10 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold">Pozadina i svrha</h2>
        <p>
          Projekat se nadovezuje na razvoj škole u pravcu digitalizacije i
          internacionalizacije. Učenici kroz moderan kurikulum stiču
          kompetencije u 3D tehnologijama i razvijaju veštine komunikacije na
          engleskom jeziku, dok mobilnost jača samopouzdanje, interkulturalnost
          i primenu naučenog u realnom okruženju.
        </p>
      </section>

      {/* Ciljevi */}
      <section className="mt-8 space-y-4 leading-relaxed">
        <h2 className="text-2xl font-bold">Ciljevi</h2>
        <ol className="list-decimal pl-5 space-y-3">
          <li>
            <b>3D modelovanje i priprema za 3D štampu</b> — rad u Blender-u,
            pravilna topologija, optimizacija i eksport (STL/GLTF), priprema za
            FDM/rezinske štampače.
          </li>
          <li>
            <b>Animiranje i programiranje 3D modela</b> — rigging, keyframe
            animacija i integracija u web (Three.js/WebGL), interakcije i
            performanse.
          </li>
          <li>
            <b>Jezik i meke veštine</b> — stručni engleski, timski rad,
            prezentacione veštine i projektna komunikacija.
          </li>
        </ol>
      </section>

      {/* Aktivnosti i učesnici */}
      <section className="mt-8 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold">Aktivnosti i učesnici</h2>
        <p>
          Učesnici su učenici tehničkih smerova (IT/mehatronika) i nastavnici
          mentori. Aktivnosti obuhvataju: pripremne tehničke i jezičke module,
          radioničarski rad, izradu i objavu portfolio radova, mobilnost kod
          partnerske organizacije i javnu prezentaciju rezultata po povratku.
        </p>
        <p className="text-white/70">
          Selekcija učenika je transparentna: otvoren konkurs, test stručnog
          znanja, test engleskog i motivaciono pismo; prednost imaju učenici iz
          osetljivih grupa ili bez prethodnog putovanja u inostranstvo. Svi
          kriterijumi i rezultati objavljuju se na sajtu.
        </p>
      </section>

      {/* Učenje, evaluacija, priznavanje */}
      <section className="mt-8 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold">Učenje, evaluacija i priznavanje</h2>
        <p>
          Napredak se prati kroz individualne radove i izazove na nedeljnom
          nivou, uz mentorstvo i povratne informacije iz prakse. Po završetku,
          ishodi se priznaju kroz <i>Europass Mobility</i>, sertifikate
          partnerske organizacije i interni sertifikat škole.
        </p>
      </section>

      {/* Diseminacija i vidljivost */}
      <section className="mt-8 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold">Diseminacija i vidljivost</h2>
        <p>
          Rezultati projekta biće dostupni javno: vesti i portfolio na sajtu,
          društvene mreže, radionice za učenike i nastavnike, ogledni časovi i
          saradnja sa lokalnom privredom. Cilj je da FM3D postane referentna
          tačka za 3D u obrazovanju u zajednici.
        </p>
      </section>

      {/* Održivost */}
      <section className="mt-8 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold">Održivost i integracija</h2>
        <p>
          Znanja i materijali (lekcije, tutorijali, rubrike) ulaze u redovnu
          nastavu i vannastavne aktivnosti; učenici po povratku drže radionice i
          prenose znanja mlađim generacijama. Sajt ostaje baza resursa i radova
          za dalje učenje i nove generacije.
        </p>
      </section>

      {/* Očekivani uticaj */}
      <section className="mt-8 space-y-3 leading-relaxed">
        <h2 className="text-2xl font-bold">Očekivani uticaj</h2>
        <p>
          FM3D podiže digitalne kompetencije učenika, jača njihovu zapošljivost
          i preduzetničko razmišljanje, a školi donosi veću vidljivost i
          umrežavanje sa evropskim partnerima.
        </p>
      </section>

      {/* CTA / Napomena */}
      <section className="mt-10 rounded-xl border border-border p-5">
        <p className="text-white/80">
          Na sajtu škole će biti objavljeni konkursi, uputstva za prijavu, vesti i
          portfolio radova.
         
        </p>
      </section>
    </article>
  );
}
