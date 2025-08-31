// src/app/radovi/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { signedUrl } from "@/lib/supabaseImage";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Badge } from "@prisma/client";

type Props = {
  params: Promise<{ slug: string }>;
};

// server action: dodela bedža
async function giveBadge(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Morate biti prijavljeni.");

  const me = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, bio: true },
  });
  if (!me) throw new Error("Nalog nije pronađen.");
  if (!me.bio || me.bio.trim().length < 10) {
    throw new Error("Popunite biografiju pre dodeljivanja bedževa.");
  }

  const workId = String(formData.get("workId"));
  const badge = String(formData.get("badge")) as keyof typeof Badge;
  const note = (formData.get("note") as string) || null;

  const work = await prisma.work.findUnique({
    where: { id: workId },
    select: { authorUserId: true },
  });
  if (!work) throw new Error("Rad nije pronađen.");
  if (work.authorUserId === me.id) {
    throw new Error("Ne možete dodeliti bedž svom radu.");
  }

  await prisma.badgeReview.create({
    data: {
      workId,
      giverUserId: me.id,
      badge: Badge[badge],
      note,
    },
  });

  revalidatePath(`/radovi/${workId}`);
}

export default async function PublicWorkDetail({ params }: Props) {
  const { slug } = await params;
  const w = await prisma.work.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      excerpt: true,
      description: true,
      mediaType: true,
      coverPath: true,
      coverUrl: true,
      filePath: true,
      authorUser: { select: { name: true, role: true } },
      badges: true,
    },
  });
  if (!w || !w.title) return notFound();

  // slika / fajl
  let coverSrc: string | null = null;
  if (w.coverPath) {
    try {
      coverSrc = await signedUrl(w.coverPath);
    } catch {}
  } else if (w.coverUrl?.startsWith("http")) {
    coverSrc = w.coverUrl;
  }

  let fileSrc: string | null = null;
  if (w.filePath) {
    try {
      fileSrc = await signedUrl(w.filePath);
    } catch {}
  }

  // grupisani bedževi
  const badgeGroups = await prisma.badgeReview.groupBy({
    by: ["badge"],
    where: { workId: w.id },
    _count: { badge: true },
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      <header>
        <h1 className="text-3xl font-bold">{w.title}</h1>
        {w.authorUser && (
          <p className="opacity-70 mt-1 text-sm">
            Autor: {w.authorUser.name} ({w.authorUser.role})
          </p>
        )}
        {w.excerpt && <p className="opacity-80 mt-3">{w.excerpt}</p>}
      </header>

      {coverSrc && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border">
          <Image src={coverSrc} alt={w.title} fill className="object-contain" />
        </div>
      )}

      {w.mediaType === "GLTF" && fileSrc && (
        <p className="text-sm opacity-70">
          GLTF fajl:{" "}
          <a className="underline" href={fileSrc} target="_blank">
            preuzmi / prikaži
          </a>
        </p>
      )}

      {w.mediaType === "VIDEO" && fileSrc && (
        <video
          src={fileSrc}
          className="w-full rounded-xl border my-4"
          controls
        />
      )}

      {w.description && (
        <article className="prose prose-invert max-w-none mt-6">
          <div>{w.description}</div>
        </article>
      )}

      {/* BEDŽEVI — agregacija */}
      <section className="rounded-xl border p-4">
        <h2 className="font-semibold mb-3">Bedževi</h2>
        {badgeGroups.length === 0 && (
          <p className="text-sm opacity-70">Još nema bedževa.</p>
        )}
        <ul className="flex flex-wrap gap-3">
          {badgeGroups.map((b) => (
            <li
              key={b.badge}
              className="rounded-md border px-3 py-1 text-sm bg-white/5"
            >
              {b.badge} ({b._count.badge})
            </li>
          ))}
        </ul>
      </section>

      {/* FORMA — dodela bedža */}
      <section className="rounded-xl border p-4">
        <h2 className="font-semibold mb-3">Dodeli bedž</h2>
        <form action={giveBadge} className="space-y-3">
          <input type="hidden" name="workId" value={w.id} />
          <div className="flex flex-wrap gap-2">
            <button
              name="badge"
              value="INNOVATIVE"
              className="rounded-md border px-3 py-1 text-sm"
            >
              🏅 Inovativno
            </button>
            <button
              name="badge"
              value="AESTHETIC"
              className="rounded-md border px-3 py-1 text-sm"
            >
              🎨 Lepo
            </button>
            <button
              name="badge"
              value="CRAFT"
              className="rounded-md border px-3 py-1 text-sm"
            >
              🛠️ Zanatski
            </button>
            <button
              name="badge"
              value="TEAMWORK"
              className="rounded-md border px-3 py-1 text-sm"
            >
              🤝 Timski rad
            </button>
            <button
              name="badge"
              value="PROGRESS"
              className="rounded-md border px-3 py-1 text-sm"
            >
              📈 Napredak
            </button>
            <button
              name="badge"
              value="HELPFUL"
              className="rounded-md border px-3 py-1 text-sm"
            >
              🤗 Pomoć drugima
            </button>
          </div>
          <input
            name="note"
            placeholder="Kratka poruka (opciono)"
            className="w-full rounded border px-3 py-2 text-sm bg-background"
          />
        </form>
      </section>
    </main>
  );
}
