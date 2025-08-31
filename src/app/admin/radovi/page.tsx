import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { isAdminServer } from "@/lib/isAdmin";
import { redirect } from "next/navigation";

export default async function AdminRadoviList() {
  const isAdmin = await isAdminServer();
  if (!isAdmin) redirect("/login");

  const rows = await prisma.work.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, published: true, mediaType: true },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Radovi</h1>
        <Link href="/admin/radovi/new" className="rounded-md border px-3 py-1.5 text-sm hover:border-primary/60">
          + Novi rad
        </Link>
      </div>

      <div className="grid gap-2">
        {rows.map((r) => (
          <Link key={r.id} href={`/admin/radovi/${r.id}`} className="rounded border p-3 hover:border-primary/60">
            <div className="font-semibold">{r.title}</div>
            <div className="text-sm opacity-70">{r.mediaType} · {r.published ? "objavljen" : "draft"}</div>
          </Link>
        ))}
        {rows.length === 0 && <p className="opacity-70">Nema radova.</p>}
      </div>
    </main>
  );
}
