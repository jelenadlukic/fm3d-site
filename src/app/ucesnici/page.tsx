export const dynamic = "force-dynamic";
// (opciono, dodatno sprečava keširanje):
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { signedUrl } from "@/lib/supabaseImage";

type CardUser = {
  id: string;
  name: string | null;
  role: "STUDENT" | "PARENT" | "SUPERADMIN";
  bio: string | null;
  avatarPath: string | null;
  avatarUrl: string | null;
};

async function getUsers(): Promise<(CardUser & { avatarSrc: string })[]> {
  const rows = await prisma.user.findMany({
    where: { NOT: { role: "SUPERADMIN" } }, // prikaži samo učenike/roditelje
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      role: true,
      bio: true,
      avatarPath: true,
      avatarUrl: true,
    },
  });

  // izračunaj src za avatar (signed URL iz Storage ili direktni URL, ili fallback)
  const withSrc = await Promise.all(
    rows.map(async (u) => {
      let src: string | null = null;
      if (u.avatarPath) {
        try { src = await signedUrl(u.avatarPath); } catch {}
      } else if (u.avatarUrl?.startsWith("http")) {
        src = u.avatarUrl;
      }
      return {
        ...u,
        avatarSrc: src ?? "/images/avatar-placeholder.png",
      };
    })
  );

  return withSrc;
}

export default async function PublicUcesniciList() {
  const users = await getUsers();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Učesnici</h1>

      {users.length === 0 && (
        <p className="opacity-70">Trenutno nema učesnika.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((u) => (
          <article
            key={u.id}
            className="flex flex-col overflow-hidden rounded-xl border border-border/70 bg-white/5"
          >
            {/* Avatar — savršen fit */}
            <div className="relative aspect-square w-full overflow-hidden border-b border-border/60 bg-black/10">
              <Image
                src={u.avatarSrc}
                alt={u.name ?? "Učesnik"}
                fill
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className="object-cover object-center"
                priority={false}
              />
            </div>

            <div className="flex flex-1 flex-col p-4">
              <div className="mb-1 text-sm uppercase tracking-wide opacity-70">
                {u.role === "STUDENT" ? "Učenik" : u.role === "PARENT" ? "Roditelj" : "Superadmin"}
              </div>
              <h2 className="mb-2 text-lg font-semibold line-clamp-2">{u.name || "Bez imena"}</h2>
              {u.bio && (
                <p className="flex-1 text-sm opacity-80 line-clamp-3">{u.bio}</p>
              )}

              <Link
                href={`/ucesnici/${u.id}`}
                className="mt-4 inline-flex items-center justify-center rounded-md border border-border px-3 py-1.5 text-sm transition hover:border-primary/60"
              >
                Pogledaj više →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
