// src/app/admin/vesti/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { updatePost } from "@/app/admin/vesti/actions";

export default async function EditVestPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const me = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user.email } })
    : null;
  if (!me || !["ADMIN", "SUPERADMIN"].includes(me.role)) redirect("/login");

  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  async function actionUpdate(formData: FormData) {
    "use server";
    await updatePost(params.id, formData);
    redirect("/admin/vesti");
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Uredi vest</h1>
        <Link href="/admin/vesti" className="text-sm underline opacity-80 hover:opacity-100">← Nazad</Link>
      </header>

      <form action={actionUpdate} className="grid gap-4 rounded-2xl border border-border/70 p-5">
        <div className="grid gap-2">
          <label className="text-sm opacity-80">Naslov</label>
          <input name="title" defaultValue={post.title ?? ""} className="rounded-lg border border-border bg-transparent px-3 py-2" />
        </div>

        <div className="grid gap-2">
          <label className="text-sm opacity-80">Slug (URL deo)</label>
          <input name="slug" defaultValue={post.slug ?? ""} className="rounded-lg border border-border bg-transparent px-3 py-2" />
        </div>

        <div className="grid gap-2">
          <label className="text-sm opacity-80">Naslovna slika URL</label>
          <input name="coverUrl" defaultValue={post.coverUrl ?? ""} className="rounded-lg border border-border bg-transparent px-3 py-2" />
        </div>

        <div className="grid gap-2">
          <label className="text-sm opacity-80">Kratak opis</label>
          <textarea name="excerpt" rows={2} defaultValue={post.excerpt ?? ""} className="rounded-lg border border-border bg-transparent px-3 py-2" />
        </div>

        <div className="grid gap-2">
          <label className="text-sm opacity-80">Sadržaj (Markdown: **bold**, - liste)</label>
          <textarea name="content" rows={10} defaultValue={post.content ?? ""} className="rounded-lg border border-border bg-transparent px-3 py-2" />
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/vesti" className="rounded-lg border border-border px-4 py-2 text-sm hover:border-primary/60">
            Odustani
          </Link>
          <button className="rounded-lg border border-border px-4 py-2 text-sm hover:border-primary/60">
            Sačuvaj izmene
          </button>
        </div>
      </form>
    </main>
  );
}
