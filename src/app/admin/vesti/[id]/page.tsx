import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updatePost } from "@/app/admin/vesti/actions";
import Link from "next/link";

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
      <h1 className="text-2xl font-bold mb-6">Uredi vest</h1>
      <form action={actionUpdate} className="grid gap-4 rounded-2xl border border-border/70 p-5">
        <input
          name="title"
          defaultValue={post.title ?? ""}
          placeholder="Naslov"
          className="rounded-lg border border-border px-3 py-2"
        />
        <input
          name="slug"
          defaultValue={post.slug ?? ""}
          placeholder="Slug"
          className="rounded-lg border border-border px-3 py-2"
        />
        <input
          name="coverUrl"
          defaultValue={post.coverUrl ?? ""}
          placeholder="Link slike (URL)"
          className="rounded-lg border border-border px-3 py-2"
        />
        <textarea
          name="excerpt"
          defaultValue={post.excerpt ?? ""}
          rows={2}
          placeholder="Kratak opis"
          className="rounded-lg border border-border px-3 py-2"
        />
        <textarea
          name="content"
          defaultValue={post.content ?? ""}
          rows={8}
          placeholder="Sadržaj"
          className="rounded-lg border border-border px-3 py-2"
        />
        <div className="flex justify-end gap-3">
          <Link href="/admin/vesti" className="border border-border px-4 py-2 rounded-md">
            Odustani
          </Link>
          <button type="submit" className="border border-border px-4 py-2 rounded-md hover:border-primary/60">
            Sačuvaj
          </button>
        </div>
      </form>
    </main>
  );
}
