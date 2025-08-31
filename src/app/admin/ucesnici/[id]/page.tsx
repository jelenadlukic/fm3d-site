import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminServer } from "@/lib/isAdmin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { signedUrl } from "@/lib/supabaseImage";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "public";
const inputClass =
  "w-full rounded border border-border/80 bg-white text-black dark:bg-neutral-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50";

type Props = { params: Promise<{ id: string }> };

export default async function EditParticipantPage({ params }: Props) {
  const isAdmin = await isAdminServer();
  if (!isAdmin) redirect("/login");

  const { id } = await params;
  const p = await prisma.participant.findUnique({ where: { id } });
  if (!p) redirect("/admin/ucesnici");

  let avatarSrc: string | null = null;
  if (p.avatarPath) {
    try { avatarSrc = await signedUrl(p.avatarPath); } catch {}
  } else if (p.avatarUrl?.startsWith("http")) {
    avatarSrc = p.avatarUrl;
  }

  async function save(formData: FormData) {
    "use server";
    const ok = await isAdminServer();
    if (!ok) throw new Error("Unauthorized");

    const name = String(formData.get("name") || "");
    const role = String(formData.get("role") || p?.role || "") as any;
    const email = (formData.get("email") as string) || null;
    const phone = (formData.get("phone") as string) || null;
    const bio = (formData.get("bio") as string) || null;
    const schoolClass = (formData.get("schoolClass") as string) || null;
    const isActive = formData.get("isActive") === "on";

    const toRemove = formData.get("removeAvatar") === "on";
    const file = formData.get("avatar") as File | null;

    let avatarPath = p ? p.avatarPath : null;
    let avatarUrl = p ? p.avatarUrl : null;

    if (toRemove) { avatarPath = null; avatarUrl = null; }

    // ako ima nov fajl – upload
    if (file && file.size > 0) {
      const safeExt = (file.name.split(".").pop() || "").toLowerCase();
      const ext = ["jpg","jpeg","png","webp","gif","avif"].includes(safeExt) ? safeExt : "jpg";
      const objectPath = `participants/${id}-${Date.now()}.${ext}`;

      const contentType =
        file.type && file.type.length > 0
          ? file.type
          : ext === "png" ? "image/png"
          : ext === "webp" ? "image/webp"
          : ext === "gif" ? "image/gif"
          : "image/jpeg";

      const { error } = await supabaseAdmin.storage.from(BUCKET).upload(objectPath, file, {
        contentType, upsert: true,
      });
      if (error) throw new Error(error.message);

      // opciono: obriši stari fajl iz Storage-a
      if (p && p.avatarPath && p.avatarPath !== objectPath) {
        await supabaseAdmin.storage.from(BUCKET).remove([p.avatarPath]).catch(() => {});
      }

      avatarPath = objectPath;
      avatarUrl = null;
    }

    await prisma.participant.update({
      where: { id },
      data: { name, role, email, phone, bio, schoolClass, isActive, avatarPath, avatarUrl },
    });

    revalidatePath("/admin/ucesnici");
    revalidatePath(`/admin/ucesnici/${id}`);
  }

  async function destroy() {
    "use server";
    const ok = await isAdminServer();
    if (!ok) throw new Error("Unauthorized");

    // opciono: obriši avatar iz Storage-a
    if (p && p.avatarPath) {
      await supabaseAdmin.storage.from(BUCKET).remove([p.avatarPath]).catch(() => {});
    }

    await prisma.participant.delete({ where: { id } });
    revalidatePath("/admin/ucesnici");
    redirect("/admin/ucesnici");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Izmena učesnika</h1>
        <form action={destroy}>
          <button
            type="submit"
            className="rounded-md border border-red-500/60 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/10"
          >
            Obriši
          </button>
        </form>
      </div>

      {avatarSrc && (
        <div className="mb-4 relative h-40 w-40 overflow-hidden rounded-xl border">
          <Image src={avatarSrc} alt={p.name} fill className="object-cover" />
        </div>
      )}

      <form action={save} className="space-y-4">
        <input name="name" defaultValue={p.name} className={inputClass} />

        <select name="role" defaultValue={p.role} className={inputClass}>
          <option value="STUDENT">Učenik</option>
          <option value="PARENT">Roditelj</option>
        </select>

        <input name="email" defaultValue={p.email ?? ""} className={inputClass} />
        <input name="phone" defaultValue={p.phone ?? ""} className={inputClass} />
        <input name="schoolClass" defaultValue={p.schoolClass ?? ""} className={inputClass} />
        <textarea name="bio" defaultValue={p.bio ?? ""} className={inputClass} rows={4} />

        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={p.isActive} /> Aktivan
        </label>

        <div className="space-y-1">
          <label className="block text-sm">Avatar (upload)</label>
          <input type="file" name="avatar" accept="image/*" className="block w-full text-sm" />
          <p className="text-xs opacity-70">Kvadratni kadar izgleda najbolje (npr. 800×800), “object-cover”.</p>
        </div>

        {(p.avatarPath || p.avatarUrl) && (
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="removeAvatar" /> Ukloni avatar
          </label>
        )}

        <button className="rounded-md border px-4 py-2 hover:bg-accent">Sačuvaj</button>
      </form>
    </main>
  );
}
