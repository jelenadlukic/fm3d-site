import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SmartImage } from "@/components/SmartImage"; 
import { CoverPicker } from "@/components/CoverPicker";

export default async function PublicVestiList() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, excerpt: true, coverUrl: true, createdAt: true },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Vesti</h1>

      {posts.length === 0 && <p className="opacity-70">Još uvek nema objavljenih vesti.</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => {
          const src =
            p.coverUrl && p.coverUrl.startsWith("http")
              ? p.coverUrl
              : "/images/o-projektu/hero1.png"; // tvoja fallback putanja
          return (
            <article
              key={p.id}
              className="rounded-xl border border-border overflow-hidden flex flex-col bg-gradient-to-b from-white/5 to-transparent"
            >
              <div className="relative h-40 w-full overflow-hidden border-b border-border/50 bg-black/10">
                {/* A) Ako si ubacio hostove u next.config.js, možeš koristiti <Image> */}
                {/* <Image src={src} alt={p.title} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-contain object-center" /> */}
                {/* B) Inače koristi SmartImage: */}
                <SmartImage
                  src={src}
                  alt={p.title}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-contain object-center"
                />
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h2 className="text-lg font-semibold mb-1 line-clamp-2">{p.title}</h2>
                <time className="text-xs opacity-70 mb-2">
                  {new Date(p.createdAt).toLocaleDateString()}
                </time>
                {p.excerpt && <p className="text-sm opacity-80 flex-1 line-clamp-3">{p.excerpt}</p>}
                <Link
                  href={`/vesti/${p.slug}`}
                  className="mt-4 inline-flex items-center justify-center rounded-md border border-border px-3 py-1.5 text-sm hover:border-primary/60 transition"
                >
                  Saznaj više →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
