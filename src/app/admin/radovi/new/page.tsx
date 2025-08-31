import { isAdminServer } from "@/lib/isAdmin";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export default async function NewWorkPage() {
  const isAdmin = await isAdminServer();
  if (!isAdmin) redirect("/login");

  const participants = await prisma.participant.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, role: true },
  });

  async function createWork(formData: FormData) {
    "use server";
    const ok = await isAdminServer();
    if (!ok) throw new Error("Unauthorized");

    const title = String(formData.get("title") || "");
    const slug  = String(formData.get("slug") || "").trim();
    const excerpt = (formData.get("excerpt") as string) || null;
    const description = (formData.get("description") as string) || null;
    const mediaType = (formData.get("mediaType") as string) || "IMAGE";
    const authorId = (formData.get("authorId") as string) || null;
    const publish = formData.get("publish") === "on";

    const cover = formData.get("cover") as File | null;
    const file  = formData.get("file") as File | null;

    let coverPath: string | null = null;
    let filePath: string | null = null;

    if (cover && cover.size > 0) {
      const ext = cover.name.split(".").pop() || "jpg";
      const path = `works/${Date.now()}-cover.${ext}`;
      const { error } = await supabaseAdmin.storage.from("public").upload(path, cover, {
        contentType: cover.type || "image/jpeg", upsert: true,
      });
      if (error) throw new Error(error.message);
      coverPath = path;
    }

    if (file && file.size > 0) {
      const ext = file.name.split(".").pop() || "bin";
      const path = `works/${Date.now()}-file.${ext}`;
      const { error } = await supabaseAdmin.storage.from("public").upload(path, file, {
        contentType: file.type || "application/octet-stream", upsert: true,
      });
      if (error) throw new Error(error.message);
      filePath = path;
    }

    await prisma.work.create({
      data: {
        title, slug, excerpt, description, mediaType,
        authorId,
        published: publish,
        coverPath, filePath,
      },
    });

    revalidatePath("/radovi");
    revalidatePath("/admin/radovi");
    redirect("/admin/radovi");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Novi rad</h1>
      <form action={createWork} className="space-y-4">
        <input name="title" placeholder="Naslov" className="w-full rounded border px-3 py-2" required />
        <input name="slug" placeholder="slug-za-url" className="w-full rounded border px-3 py-2" required />
        <textarea name="excerpt" placeholder="Kratak opis" className="w-full rounded border px-3 py-2" rows={3} />
        <textarea name="description" placeholder="Detaljan opis" className="w-full rounded border px-3 py-2" rows={5} />

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Tip medija</label>
            <select name="mediaType" className="w-full rounded border px-3 py-2">
              <option value="IMAGE">Slika</option>
              <option value="VIDEO">Video</option>
              <option value="GLTF">GLTF/3D</option>
              <option value="OTHER">Ostalo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Autor (učesnik)</label>
            <select name="authorId" className="w-full rounded border px-3 py-2">
              <option value="">— bez autora —</option>
              {participants.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Cover slika</label>
          <input type="file" name="cover" accept="image/*" />
        </div>
        <div>
          <label className="block text-sm mb-1">Fajl (video / glb / pdf / sl.)</label>
          <input type="file" name="file" />
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="publish" /> Objavi odmah
        </label>

        <button className="rounded-md border px-4 py-2 hover:bg-accent">Sačuvaj</button>
      </form>
    </main>
  );
}
