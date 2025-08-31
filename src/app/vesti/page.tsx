import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SmartImage } from "@/components/SmartImage";
import { signedUrl } from "@/lib/supabaseImage";

export default async function PublicVestiList() {
  const rows = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, excerpt: true, coverUrl: true, coverPath: true, createdAt: true },
  });

  const posts = await Promise.all(
    rows.map(async (p) => {
      let src: string | null = null;
      if (p.coverPath) {
        try { src = await signedUrl(p.coverPath); } catch {}
      } else if (p.coverUrl?.startsWith("http")) {
        src = p.coverUrl;
      }
      return { ...p, coverSrc: src ?? "/images/o-projektu/hero1.png" };
    })
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Vesti</h1>

      {posts.length === 0 && <p className="opacity-70">Još uvek nema objavljenih vesti.</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <article key={p.id} className="flex flex-col overflow-hidden rounded-xl border border-border bg-gradient-to-b from-white/5 to-transparent">
            <div className="relative h-40 w-full overflow-hidden border-b border-border/50 bg-black/10">
              <SmartImage
                src={p.coverSrc}
                alt={p.title}
                fill
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className="object-contain object-center"
              />
            </div>

            <div className="flex flex-1 flex-col p-4">
              <h2 className="mb-1 line-clamp-2 text-lg font-semibold">{p.title}</h2>
              <time className="mb-2 text-xs opacity-70">{new Date(p.createdAt).toLocaleDateString()}</time>
              {p.excerpt && <p className="flex-1 text-sm opacity-80 line-clamp-3">{p.excerpt}</p>}
              <Link href={`/vesti/${p.slug}`} className="mt-4 inline-flex items-center justify-center rounded-md border border-border px-3 py-1.5 text-sm transition hover:border-primary/60">
                Saznaj više →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
