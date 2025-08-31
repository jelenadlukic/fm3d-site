export const dynamic = "force-dynamic";
// (opciono, dodatno sprečava keširanje):
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { signedUrl } from "@/lib/supabaseImage";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getAvatar(srcPath: string | null, url: string | null) {
  if (srcPath) {
    try { return await signedUrl(srcPath); } catch {}
  }
  if (url?.startsWith("http")) return url;
  return "/images/avatar-placeholder.png";
}

export default async function UcesnikDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Učesnik
  const u = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      role: true,
      bio: true,
      avatarPath: true,
      avatarUrl: true,
    },
  });
  if (!u) return notFound();

  const avatarSrc = await getAvatar(u.avatarPath, u.avatarUrl);

  // Njegovi OBJAVLJENI radovi
  const works = await prisma.work.findMany({
    where: { authorUserId: id, published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverPath: true,
      coverUrl: true,
      mediaType: true,
    },
  });

  // Prebaci coverSrc
  const worksWithCovers = await Promise.all(
    works.map(async (w) => {
      let coverSrc: string | null = null;
      if (w.coverPath) {
        try { coverSrc = await signedUrl(w.coverPath); } catch {}
      } else if (w.coverUrl?.startsWith("http")) {
        coverSrc = w.coverUrl;
      }
      return {
        ...w,
        coverSrc: coverSrc ?? "/images/o-projektu/hero1.png",
      };
    })
  );

  // Broj bedževa po tipu za SVE njegove radove
  // SELECT badge, COUNT(*) FROM BadgeReview WHERE work.authorUserId = id GROUP BY badge
  const badgeRows = await prisma.badgeReview.groupBy({
    by: ["badge"],
    _count: { badge: true },
    where: {
      work: { authorUserId: id },
    },
  });

  const badgeLabel: Record<string, string> = {
    INNOVATIVE: "Inovativno",
    AESTHETIC: "Estetski lepo",
    CRAFT: "Izvedba/preciznost",
    TEAMWORK: "Timski rad",
    PROGRESS: "Napredak",
    HELPFUL: "Pomoć drugima",
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        {/* Levo: avatar + meta */}
        <aside>
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border/60 bg-black/10">
            <Image
              src={avatarSrc}
              alt={u.name ?? "Učesnik"}
              fill
              sizes="220px"
              className="object-cover object-center"
            />
          </div>

          <div className="mt-4 text-sm uppercase tracking-wide opacity-70">
            {u.role === "STUDENT" ? "Učenik" : u.role === "PARENT" ? "Roditelj" : "Superadmin"}
          </div>
          <h1 className="text-2xl font-bold mt-1">{u.name || "Bez imena"}</h1>
        </aside>

        {/* Desno: bio + bedževi + radovi */}
        <section className="space-y-8">
          {/* Bio */}
          {u.bio && (
            <div className="rounded-xl border border-border/70 p-4">
              <h2 className="text-lg font-semibold mb-2">Biografija</h2>
              <p className="opacity-80 whitespace-pre-line">{u.bio}</p>
            </div>
          )}

          {/* Bedževi (agregat) */}
          <div className="rounded-xl border border-border/70 p-4">
            <h2 className="text-lg font-semibold mb-3">Bedževi</h2>

            {badgeRows.length === 0 ? (
              <p className="opacity-70 text-sm">Još uvek nema dodeljenih bedževa na radovima ovog učesnika.</p>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {badgeRows.map((b) => (
                  <li key={b.badge} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                    <span className="text-sm">{badgeLabel[b.badge] ?? b.badge}</span>
                    <span className="text-xs opacity-80">× {b._count.badge}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Radovi */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Radovi</h2>

            {worksWithCovers.length === 0 ? (
              <p className="opacity-70 text-sm">Još uvek nema objavljenih radova.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {worksWithCovers.map((w) => (
                  <article key={w.id} className="flex flex-col overflow-hidden rounded-xl border border-border/70">
                    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border/60 bg-black/10">
                      <Image
                        src={w.coverSrc}
                        alt={w.title}
                        fill
                        sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="text-xs opacity-70 mb-1">{w.mediaType}</div>
                      <h3 className="text-base font-semibold line-clamp-2">{w.title}</h3>
                      {w.excerpt && <p className="text-sm opacity-80 line-clamp-3 mt-1">{w.excerpt}</p>}
                      <Link
                        href={`/radovi/${w.slug}`}
                        className="mt-3 inline-flex items-center justify-center rounded-md border border-border px-3 py-1.5 text-sm hover:border-primary/60"
                      >
                        Vidi rad →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
