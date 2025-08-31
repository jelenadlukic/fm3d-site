import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { updatePost } from "@/app/admin/vesti/actions";
import { CoverUploader } from "@/components/CoverUploader";
import Flash from "@/components/Flash";

type Props = { params: Promise<{ id: string }> };

export default async function AdminVestEdit({ params }: Props) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  const me = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user.email } })
    : null;
  if (!me || !["ADMIN", "SUPERADMIN"].includes(me.role)) redirect("/login");

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true, title: true, slug: true, excerpt: true, content: true,
      coverPath: true, coverUrl: true, published: true, createdAt: true
    },
  });
  if (!post) return notFound();

  async function actionUpdate(formData: FormData) {
    "use server";
    await updatePost(formData);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Flash />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Uredi vest</h1>
        <Link href="/admin/vesti" className="text-sm underline opacity-80 hover:opacity-100">
          ← Nazad na sve vesti
        </Link>
      </div>

      <form action={actionUpdate} className="grid gap-4">
        <input type="hidden" name="id" value={post.id} />

        <div className="grid gap-1">
          <label className="text-sm opacity-80">Naslov</label>
          <input name="title" defaultValue={post.title} required className="rounded-lg border border-border bg-transparent px-3 py-2" />
        </div>

        <div className="grid gap-1">
          <label className="text-sm opacity-80">Slug</label>
          <input name="slug" defaultValue={post.slug} className="rounded-lg border border-border bg-transparent px-3 py-2" />
        </div>

        {/* Slika — prikaz trenutne i opcioni replace */}
        <div className="grid gap-2">
          <label className="text-sm opacity-80">Trenutna naslovna</label>
          <div className="relative h-40 w-full overflow-hidden rounded-lg border bg-black/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverUrl || (post.coverPath ? "/api/cover-preview?path="+encodeURIComponent(post.coverPath) : "/images/o-projektu/hero1.png")}
              alt={post.title}
              className="h-full w-full object-contain"
            />
          </div>

          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="removeCover" /> Ukloni postojeću sliku
          </label>

          {/* Opcioni pre-upload (ako želiš da zameniš sliku) */}
          <CoverUploader />
          <p className="text-xs opacity-70">
            Ako ne otpremiš novu sliku i ne čekiraš “Ukloni”, postojeća ostaje neizmenjena.
          </p>
        </div>

        <div className="grid gap-1">
          <label className="text-sm opacity-80">Kratak opis (excerpt)</label>
          <textarea name="excerpt" defaultValue={post.excerpt ?? ""} rows={2} className="rounded-lg border border-border bg-transparent px-3 py-2" />
        </div>

        <div className="grid gap-1">
          <label className="text-sm opacity-80">Sadržaj</label>
          <textarea name="content" defaultValue={post.content ?? ""} rows={8} className="rounded-lg border border-border bg-transparent px-3 py-2" />
        </div>

        <div className="flex justify-end">
          <button className="rounded-lg border border-border px-4 py-2 text-sm hover:border-primary/60">
            Sačuvaj promene
          </button>
        </div>
      </form>
    </main>
  );
}
