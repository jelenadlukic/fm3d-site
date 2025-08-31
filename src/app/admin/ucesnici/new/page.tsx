import { isAdminServer } from "@/lib/isAdmin";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";
import { ParticipantRole } from "@prisma/client";

export default async function NewParticipantPage() {
  const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "public";

  const inputClass =
  "w-full rounded border border-border/80 bg-white text-black dark:bg-neutral-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none";

  const isAdmin = await isAdminServer();
  if (!isAdmin) redirect("/login");

  async function createParticipant(formData: FormData) {
  "use server";
  const ok = await isAdminServer();
  if (!ok) throw new Error("Unauthorized");

  const name = String(formData.get("name") || "");
  const allowed = new Set(["STUDENT","PARENT","SUPERADMIN"]);
  const rawRole = String(formData.get("role") || "STUDENT").toUpperCase() as keyof typeof ParticipantRole;
  const role = ParticipantRole[rawRole] ?? ParticipantRole.STUDENT;
  const email = (formData.get("email") as string) || null;
  const phone = (formData.get("phone") as string) || null;
  const bio = (formData.get("bio") as string) || null;
  const schoolClass = (formData.get("schoolClass") as string) || null;
  const file = formData.get("avatar") as File | null;

  // 1) osiguraj da bucket postoji (service role sme da kreira)
  const { data: bucketInfo, error: bucketErr } = await supabaseAdmin.storage.getBucket(BUCKET);
  if (!bucketInfo) {
    const { error: createErr } = await supabaseAdmin.storage.createBucket(BUCKET, {
      public: false, // privatan bucket (preporuka)
      fileSizeLimit: 20 * 1024 * 1024, // 20MB primer
    });
    if (createErr) {
      console.error("createBucket error:", createErr);
      throw new Error(`Storage bucket "${BUCKET}" ne postoji i ne može da se kreira: ${createErr.message}`);
    }
  } else if (bucketErr) {
    console.warn("getBucket warning:", bucketErr);
  }

  let avatarPath: string | null = null;

  // 2) upload (ako je dat fajl)
  if (file && file.size > 0) {
    const safeExt = (file.name.split(".").pop() || "").toLowerCase();
    const ext = ["jpg","jpeg","png","webp","gif","avif"].includes(safeExt) ? safeExt : "jpg";
    const objectPath = `participants/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // napuni contentType ako fali
    const contentType = file.type && file.type.length > 0 ? file.type : (
      ext === "png" ? "image/png" :
      ext === "webp" ? "image/webp" :
      ext === "gif" ? "image/gif" :
      "image/jpeg"
    );

    const { data, error } = await supabaseAdmin
      .storage
      .from(BUCKET)
      .upload(objectPath, file, { contentType, upsert: true });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(`Upload nije uspeo: ${error.message}`);
    }
    if (!data?.path) {
      throw new Error("Upload nije vratio path (nepoznat razlog).");
    }

    avatarPath = data.path;
  }

  await prisma.participant.create({
  data: { name, role, email, phone, bio, schoolClass, avatarPath },
  });

  revalidatePath("/admin/ucesnici");
  redirect("/admin/ucesnici");
}

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Novi učesnik</h1>
      <form action={createParticipant} className="space-y-4">
        <input name="name" placeholder="Ime i prezime" className="w-full rounded border px-3 py-2" required />
        
         <div className="relative">
          <select name="role" className={`${inputClass} pr-9`}>
            <option value="STUDENT">Učenik</option>
            <option value="PARENT">Roditelj</option>
            <option value="SUPERADMIN">Superadmin</option>
          </select>
          {/* mali chevron */}
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-70">▾</span>
        </div>

        <input name="email" placeholder="Email (opciono)" className="w-full rounded border px-3 py-2" />
        <input name="phone" placeholder="Telefon (opciono)" className="w-full rounded border px-3 py-2" />
        <input name="schoolClass" placeholder="Odeljenje npr. IV-1 (opciono)" className="w-full rounded border px-3 py-2" />
        <textarea name="bio" placeholder="Kratka biografija" className="w-full rounded border px-3 py-2" rows={4} />
        <div>
          <label className="block text-sm mb-1">Avatar (slika)</label>
          <input type="file" name="avatar" accept="image/*" />
        </div>
        <button className="rounded-md border px-4 py-2 hover:bg-accent">Sačuvaj</button>
      </form>
    </main>
  );
}
