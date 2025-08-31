import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { isAdminServer } from "@/lib/isAdmin";
import { redirect } from "next/navigation";
import Image from "next/image";
import { signedUrl } from "@/lib/supabaseImage";

export default async function AdminUcesniciList() {
  const isAdmin = await isAdminServer();
  if (!isAdmin) redirect("/login");

  const rows = await prisma.participant.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, role: true, email: true, isActive: true, avatarPath: true, avatarUrl: true },
  });

  const items = await Promise.all(rows.map(async (r) => {
    let src: string | null = null;
    if (r.avatarPath) { try { src = await signedUrl(r.avatarPath); } catch {} }
    else if (r.avatarUrl?.startsWith("http")) src = r.avatarUrl;
    return { ...r, avatarSrc: src ?? "/images/avatar-placeholder.png" };
  }));

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Učesnici</h1>
        <Link href="/admin/ucesnici/new" className="rounded-md border px-3 py-1.5 text-sm hover:border-primary/60">
          + Novi učesnik
        </Link>
      </div>

      <div className="grid gap-2">
        {items.map((r) => (
          <Link key={r.id} href={`/admin/ucesnici/${r.id}`} className="rounded border p-3 hover:border-primary/60 flex items-center gap-3">
            {r.avatarSrc && (
              <div className="mb-4 relative h-40 w-40 overflow-hidden rounded-xl border">
                <Image src={r.avatarSrc} alt={r.name} fill className="object-cover" />
              </div>
            )}
            <div className="min-w-0">
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm opacity-70 truncate">{r.role} · {r.email ?? "bez emaila"} · {r.isActive ? "aktivan" : "neaktivan"}</div>
            </div>
          </Link>
        ))}
        {items.length === 0 && <p className="opacity-70">Nema unetih učesnika.</p>}
      </div>
    </main>
  );
}
