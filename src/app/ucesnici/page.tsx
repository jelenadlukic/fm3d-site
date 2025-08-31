import { prisma } from "@/lib/prisma";
import { signedUrl } from "@/lib/supabaseImage";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Učesnici — FM3D",
  description:
    "Na ovoj stranici biće istaknuti svi učesnici projekta FM3D nakon završetka konkursa i selekcije.",
};


export default async function PublicParticipants() {

  const rows = await prisma.participant.findMany({
    where: { isActive: true },
    orderBy: [{ role: "asc" }, { name: "asc" }],
    select: { id: true, name: true, role: true, bio: true, avatarPath: true, avatarUrl: true },
  });

  const items = await Promise.all(rows.map(async (p) => {
    let src: string | null = null;
    if (p.avatarPath) { try { src = await signedUrl(p.avatarPath);} catch{} }
    else if (p.avatarUrl?.startsWith("http")) src = p.avatarUrl;
    return { ...p, avatarSrc: src ?? "/images/avatar-placeholder.png" };
  }));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">

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
         transparentne selekcije. Biografije i uloge (učenik, mentor..) biće
         povezane sa portfolijom radova i aktivnostima.
        </p>
      </header>

      <h1 className="mb-6 text-3xl font-bold">Učesnici</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(p => (
          <article key={p.id} className="rounded-xl border p-4">
            <div className="relative h-36 w-full overflow-hidden rounded-lg border mb-3">
              <Image src={p.avatarSrc} alt={p.name} fill className="object-cover" />
            </div>
            <div className="text-sm uppercase opacity-70">{p.role}</div>
            <h2 className="font-semibold text-lg">{p.name}</h2>
            {p.bio && <p className="opacity-80 text-sm line-clamp-3 mt-1">{p.bio}</p>}
          </article>
        ))}
      </div>
    </main>
  );
}
