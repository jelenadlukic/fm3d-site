// src/app/profil/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Image from "next/image";
import { signedUrl } from "@/lib/supabaseImage";
import { hash, compare } from "bcryptjs";
import AutoHideBanner from "@/components/AutoHideBanner";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// ✅ Lokalna detekcija Next redirect error-a (bez uvoza iz next/dist)
function isNextRedirect(e: unknown): boolean {
  try {
    // u Next 13+ redirect baca error sa digest-om koji počinje na "NEXT_REDIRECT"
    const d = (e as any)?.digest;
    return typeof d === "string" && d.startsWith("NEXT_REDIRECT");
  } catch {
    return false;
  }
}

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "public";
const input =
  "w-full rounded border border-border/80 bg-white text-black dark:bg-neutral-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProfilePage({ searchParams }: PageProps) {
  // Next 15: searchParams je Promise
  const sp = (await searchParams) ?? {};
  const savedRaw =
    typeof sp.saved === "string"
      ? sp.saved
      : Array.isArray(sp.saved)
      ? sp.saved[0]
      : undefined;
  const msg = savedRaw === "1" ? "Profil je sačuvan." : undefined;
  const errMsg =
    typeof sp.err === "string"
      ? decodeURIComponent(sp.err)
      : Array.isArray(sp.err)
      ? decodeURIComponent(sp.err[0]!)
      : undefined;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      avatarPath: true,
      avatarUrl: true,
    },
  });
  if (!user) redirect("/login");

  // avatar prikaz
  let avatarSrc: string | null = null;
  if (user.avatarPath) {
    try {
      avatarSrc = await signedUrl(user.avatarPath);
    } catch {}
  } else if (user.avatarUrl?.startsWith("http")) {
    avatarSrc = user.avatarUrl;
  }

  // --- SERVER ACTIONS ---

  // (1) Sačuvaj profil
  async function saveProfile(formData: FormData) {
    "use server";
    try {
      const s = await getServerSession(authOptions);
      if (!s?.user?.email) throw new Error("Unauthorized");

      const me = await prisma.user.findUnique({
        where: { email: s.user.email },
        select: { id: true, avatarPath: true },
      });
      if (!me) throw new Error("Not found");

      const bio = (formData.get("bio") as string)?.trim() || null;
      const file = formData.get("avatar") as File | null;

      let avatarPath = me.avatarPath;

      if (file && file.size > 0) {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const path = `users/${me.id}-${Date.now()}.${ext}`;
        const { error } = await supabaseAdmin
          .storage
          .from(BUCKET)
          .upload(path, file, {
            contentType: file.type || "image/jpeg",
            upsert: true,
          });
        if (error) throw new Error(error.message);
        // obriši stari avatar (best-effort)
        if (me.avatarPath && me.avatarPath !== path) {
          await supabaseAdmin.storage.from(BUCKET).remove([me.avatarPath]).catch(() => {});
        }
        avatarPath = path;
      }

      await prisma.user.update({
        where: { id: me.id },
        data: { bio, avatarPath },
      });

      revalidatePath("/profil");
      redirect("/profil?saved=1");
    } catch (e: any) {
      if (isNextRedirect(e)) throw e;
      const message = e?.message ?? "Neuspelo čuvanje profila";
      redirect(`/profil?saved=0&err=${encodeURIComponent(message)}`);
    }
  }

  // (2) Promena šifre
  async function changePassword(formData: FormData) {
    "use server";
    try {
      const s = await getServerSession(authOptions);
      if (!s?.user?.email) throw new Error("Unauthorized");

      const me = await prisma.user.findUnique({
        where: { email: s.user.email },
        select: { id: true, passwordHash: true },
      });
      if (!me) throw new Error("Not found");

      const oldPwd = String(formData.get("old") || "");
      const newPwd = String(formData.get("pwd") || "");
      const newPwd2 = String(formData.get("pwd2") || "");

      if (newPwd.length < 8) throw new Error("Nova šifra mora imati min 8 karaktera.");
      if (newPwd !== newPwd2) throw new Error("Nove šifre se ne poklapaju.");

      if (me.passwordHash) {
        const ok = await compare(oldPwd, me.passwordHash);
        if (!ok) throw new Error("Stara šifra nije tačna.");
      }

      const newHash = await hash(newPwd, 10);
      await prisma.user.update({ where: { id: me.id }, data: { passwordHash: newHash } });

      revalidatePath("/profil");
      redirect("/profil?saved=1");
    } catch (e: any) {
      if (isNextRedirect(e)) throw e;
      const message = e?.message ?? "Neuspela promena šifre";
      redirect(`/profil?saved=0&err=${encodeURIComponent(message)}`);
    }
  }

  // (3) Upload rada
  async function uploadWork(formData: FormData) {
    "use server";
    try {
      const s = await getServerSession(authOptions);
      if (!s?.user?.email) throw new Error("Unauthorized");

      const me = await prisma.user.findUnique({
        where: { email: s.user.email },
        select: { id: true, bio: true },
      });
      if (!me) throw new Error("Not found");
      if (!me.bio || me.bio.trim().length < 10) {
        throw new Error("Molimo popunite biografiju pre otpremanja rada.");
      }

      const title = String(formData.get("title") || "");
      const slug = String(formData.get("slug") || "");
      const excerpt = (formData.get("excerpt") as string) || null;
      const description = (formData.get("description") as string) || null;
      const mediaType = (formData.get("mediaType") as string) || "IMAGE";
      const cover = formData.get("cover") as File | null;
      const file = formData.get("file") as File | null;

      let coverPath: string | null = null;
      let filePath: string | null = null;

      if (cover && cover.size > 0) {
        const ext = (cover.name.split(".").pop() || "jpg").toLowerCase();
        const path = `works/${me.id}-${Date.now()}-cover.${ext}`;
        const { error } = await supabaseAdmin
          .storage
          .from(BUCKET)
          .upload(path, cover, {
            contentType: cover.type || "image/jpeg",
            upsert: true,
          });
        if (error) throw new Error(error.message);
        coverPath = path;
      }

      if (file && file.size > 0) {
        const ext = (file.name.split(".").pop() || "bin").toLowerCase();
        const path = `works/${me.id}-${Date.now()}-file.${ext}`;
        const { error } = await supabaseAdmin
          .storage
          .from(BUCKET)
          .upload(path, file, {
            contentType: file.type || "application/octet-stream",
            upsert: true,
          });
        if (error) throw new Error(error.message);
        filePath = path;
      }

      await prisma.work.create({
        data: {
          title,
          slug,
          excerpt,
          description,
          mediaType: mediaType as any,
          authorUserId: me.id,
          published: true,
          coverPath,
          filePath,
        },
      });

      revalidatePath("/radovi");
      revalidatePath("/profil");
      redirect("/profil?saved=1");
    } catch (e: any) {
      if (isNextRedirect(e)) throw e;
      const message = e?.message ?? "Neuspelo otpremanje rada";
      redirect(`/profil?saved=0&err=${encodeURIComponent(message)}`);
    }
  }

  // (4) Dnevnik prakse
  async function saveJournal(formData: FormData) {
    "use server";
    try {
      const s = await getServerSession(authOptions);
      if (!s?.user?.email) throw new Error("Unauthorized");

      const me = await prisma.user.findUnique({
        where: { email: s.user.email },
        select: { id: true },
      });
      if (!me) throw new Error("Not found");

      const dateStr =
        (formData.get("date") as string) || new Date().toISOString().slice(0, 10);
      const text = String(formData.get("text") || "").trim();
      if (text.length < 10) throw new Error("Unos treba da ima bar 10 karaktera.");

      const date = new Date(dateStr + "T00:00:00.000Z");

      await prisma.journalEntry.upsert({
        where: { userId_date: { userId: me.id, date } },
        update: { text },
        create: { userId: me.id, date, text },
      });

      revalidatePath("/profil");
      redirect("/profil?saved=1");
    } catch (e: any) {
      if (isNextRedirect(e)) throw e;
      const message = e?.message ?? "Neuspešno čuvanje dnevnika";
      redirect(`/profil?saved=0&err=${encodeURIComponent(message)}`);
    }
  }

  const isSuper = user.role === "SUPERADMIN";

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* ✅ auto-hide banner: success ili error */}
      <AutoHideBanner
        msg={msg || errMsg}
        variant={msg ? "success" : errMsg ? "error" : "success"}
        ms={3000}
      />

      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Moj profil</h1>
        {isSuper && (
          <a
            href="/dashboard"
            className="rounded-md border px-3 py-1.5 text-sm hover:border-primary/60"
          >
            Idi na Dashboard
          </a>
        )}
      </header>

      <Accordion type="single" collapsible>
        {/* Sekcija: Profil */}
        <AccordionItem value="profile" className="rounded-xl border p-4 mb-2">
          <AccordionTrigger>Profil (avatar + biografija)</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-start gap-6">
              <div className="relative h-24 w-24 overflow-hidden rounded-lg border">
                <Image
                  src={avatarSrc ?? "/images/avatar-placeholder.png"}
                  alt={user.name ?? user.email!}
                  fill
                  className="object-cover"
                />
              </div>
              <form action={saveProfile} className="flex-1 space-y-3">
                <textarea
                  name="bio"
                  defaultValue={user.bio ?? ""}
                  placeholder="Napiši kratku biografiju (obavezno)…"
                  className={input}
                  rows={4}
                  required
                />
                <div>
                  <label className="block text-sm mb-1">Promeni avatar</label>
                  <input type="file" name="avatar" accept="image/*" className="block text-sm" />
                  <p className="text-xs opacity-70">
                    Preporuka: kvadrat 800×800, JPG/WEBP. Prikaz koristi object-cover.
                  </p>
                </div>
                <button className="rounded-md border px-4 py-2 hover:bg-accent">
                  Sačuvaj profil
                </button>
              </form>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Sekcija: Promena šifre */}
        <AccordionItem value="password" className="rounded-xl border p-4 mb-2">
          <AccordionTrigger>Promena šifre</AccordionTrigger>
          <AccordionContent>
            <form action={changePassword} className="grid gap-3 sm:grid-cols-2">
              <input name="old" type="password" placeholder="Stara šifra" className={input} />
              <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
                <input
                  name="pwd"
                  type="password"
                  placeholder="Nova šifra (min 8)"
                  className={input}
                  required
                />
                <input
                  name="pwd2"
                  type="password"
                  placeholder="Ponovi novu šifru"
                  className={input}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <button className="rounded-md border px-4 py-2 hover:bg-accent">
                  Promeni šifru
                </button>
              </div>
            </form>
          </AccordionContent>
        </AccordionItem>

        {/* Sekcija: Moj rad (upload) */}
        <AccordionItem value="work" className="rounded-xl border p-4 mb-2">
          <AccordionTrigger>Moj rad — otpremi</AccordionTrigger>
          <AccordionContent>
            <form action={uploadWork} className="space-y-3">
              <input name="title" placeholder="Naslov rada" className={input} required />
              <input name="slug" placeholder="slug-za-url" className={input} required />
              <textarea name="excerpt" placeholder="Kratak opis" className={input} rows={2} />
              <textarea name="description" placeholder="Detaljan opis" className={input} rows={4} />
              <div className="grid gap-3 sm:grid-cols-2">
                <select name="mediaType" className={input}>
                  <option value="IMAGE">Slika</option>
                  <option value="VIDEO">Video</option>
                  <option value="GLTF">GLTF/3D</option>
                  <option value="OTHER">Ostalo</option>
                </select>
                <div>
                  <label className="block text-sm mb-1">Cover slika</label>
                  <input type="file" name="cover" accept="image/*" className="block text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Fajl (video / glb / pdf / sl.)</label>
                <input type="file" name="file" className="block text-sm" />
              </div>
              <button className="rounded-md border px-4 py-2 hover:bg-accent">Otpremi rad</button>
            </form>
          </AccordionContent>
        </AccordionItem>

        {/* Sekcija: Dnevnik prakse */}
        <AccordionItem value="journal" className="rounded-xl border p-4">
          <AccordionTrigger>Dnevnik prakse</AccordionTrigger>
          <AccordionContent>
            <form action={saveJournal} className="space-y-3">
              <input
                name="date"
                type="date"
                className={input}
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
              <textarea
                name="text"
                className={input}
                rows={4}
                placeholder="Šta sam radio/la danas? Koje veštine sam vežbao/la? Šta mi nije jasno? (min 10 karaktera)"
                required
              />
              <button className="rounded-md border px-4 py-2 hover:bg-accent">
                Sačuvaj dnevnik
              </button>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}
