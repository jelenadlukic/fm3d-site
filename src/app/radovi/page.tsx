import { prisma } from "@/lib/prisma";
import { signedUrl } from "@/lib/supabaseImage";
import Image from "next/image";
import Link from "next/link";

export default async function PublicWorks() {
  const rows = await prisma.work.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, excerpt: true, coverPath: true, coverUrl: true, mediaType: true },
  });

  const items = await Promise.all(rows.map(async (w) => {
    let src: string | null = null;
    if (w.coverPath) { try { src = await signedUrl(w.coverPath);} catch{} }
    else if (w.coverUrl?.startsWith("http")) src = w.coverUrl;
    return { ...w, coverSrc: src ?? "/images/o-projektu/hero1.png" };
  }));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Radovi</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(w => (
          <Link key={w.id} href={`/radovi/${w.slug}`} className="rounded-xl border p-4 hover:border-primary/60">
            <div className="relative h-40 w-full overflow-hidden rounded-lg border mb-3">
              <Image src={w.coverSrc} alt={w.title} fill className="object-cover" />
            </div>
            <div className="text-xs uppercase opacity-70">{w.mediaType}</div>
            <h2 className="font-semibold">{w.title}</h2>
            {w.excerpt && <p className="text-sm opacity-80 line-clamp-3 mt-1">{w.excerpt}</p>}
          </Link>
        ))}
      </div>
    </main>
  );
}
