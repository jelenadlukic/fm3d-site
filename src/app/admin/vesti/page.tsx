import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { CoverUploader } from "@/components/CoverUploader";
import { RichTextLite } from "@/components/RichTextLite";
import { ConfirmButton } from "@/components/ConfirmButton";

import {
  createPost,
  deletePostAction,
  togglePublishAction,
} from "@/app/admin/vesti/actions";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export default async function AdminVestiPage() {
  const session = await getServerSession(authOptions);
  const me = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user.email } })
    : null;

  if (!me || !["ADMIN", "SUPERADMIN"].includes(me.role)) {
    redirect("/login");
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, published: true, createdAt: true },
  });

  async function actionCreate(formData: FormData) {
    "use server";
    let givenSlug = (formData.get("slug")?.toString() || "").trim();
    if (!givenSlug) {
      const title = String(formData.get("title") || "");
      givenSlug = slugify(title) || `vest-${Date.now()}`;
      formData.set("slug", givenSlug);
    }
    await createPost(formData);
  }

  return (
    <main className="relative mx-auto max-w-6xl px-4 py-10">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-48 w-[100vw] -translate-x-1/2 blur-3xl bg-gradient-to-r from-purple-500/15 via-cyan-400/15 to-lime-400/15" />

      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Vesti — Admin</h1>
        <Link className="text-sm underline opacity-80 hover:opacity-100" href="/dashboard">
          ← Nazad na dashboard
        </Link>
      </header>

      {/* Nova vest */}
      <section className="mb-8 rounded-2xl border border-border/70 bg-white/0 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
        <h2 className="font-semibold mb-4">Nova vest</h2>
        <form action={actionCreate} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm opacity-80">Naslov</label>
            <input
              name="title"
              required
              className="rounded-lg border border-border bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm opacity-80">Slug (opciono — auto iz naslova)</label>
            <input
              name="slug"
              className="rounded-lg border border-border bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <CoverUploader />

          <div className="grid gap-2">
            <label className="text-sm opacity-80">Kratak opis (excerpt)</label>
            <textarea
              name="excerpt"
              rows={2}
              className="rounded-lg border border-border bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm opacity-80">Sadržaj</label>
            <RichTextLite name="content" />
          </div>

          <div className="flex justify-end">
            <button className="rounded-lg border border-border px-4 py-2 text-sm hover:border-primary/60 transition">
              Sačuvaj (draft)
            </button>
          </div>
        </form>
      </section>

      {/* Lista vesti */}
      <section className="rounded-2xl border border-border/70 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Sve vesti</h2>
          <div className="text-xs opacity-70">Ukupno: {posts.length}</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left opacity-70">
              <tr>
                <th className="py-2">Naslov</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Datum</th>
                <th className="text-right pr-2">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-border/60">
                  <td className="py-2">{p.title}</td>
                  <td className="opacity-80">{p.slug}</td>
                  <td>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border ${
                        p.published
                          ? "border-emerald-500/40 text-emerald-300"
                          : "border-yellow-500/40 text-yellow-300"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {p.published ? "Objavljeno" : "Draft"}
                    </span>
                  </td>
                  <td className="opacity-80">{new Date(p.createdAt).toLocaleString()}</td>
                  <td className="text-right space-x-2">
                    {/* Publish toggle */}
                    <form action={togglePublishAction} className="inline">
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="publish" value={p.published ? "0" : "1"} />
                      <button className="rounded-md border border-border px-2 py-1 hover:border-primary/60">
                        {p.published ? "Skini s objave" : "Objavi"}
                      </button>
                    </form>

                    {/* Uredi */}
                    <Link
                      className="rounded-md border border-border px-2 py-1 hover:border-primary/60"
                      href={`/admin/vesti/${p.id}`}
                    >
                      Uredi
                    </Link>

                    {/* Obriši */}
                    <form action={deletePostAction} className="inline">
                      <input type="hidden" name="id" value={p.id} />
                      <ConfirmButton
                        message="Obrisati vest?"
                        className="rounded-md border border-red-500/50 px-2 py-1 text-red-300 hover:border-red-400"
                        type="submit"
                      >
                        Obriši
                      </ConfirmButton>
                    </form>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 opacity-70">
                    Nema vesti još.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
