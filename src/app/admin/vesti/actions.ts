"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { BUCKET } from "@/lib/bucket";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function assertSuperAdmin() {
  const s = await getServerSession(authOptions);
  if (!s?.user?.email) throw new Error("Unauthorized");
  const me = await prisma.user.findUnique({
    where: { email: s.user.email },
    select: { role: true },
  });
  if (!me || me.role !== "SUPERADMIN") throw new Error("Forbidden");
}

export async function createPost(formData: FormData) {
  await assertSuperAdmin();

  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Naslov je obavezan");

  let slug = (formData.get("slug")?.toString() || "").trim();
  if (!slug) slug = slugify(title) || `vest-${Date.now()}`;

  const excerpt = (formData.get("excerpt") as string) || null;
  const content = (formData.get("content") as string) || null;

  // ⬇⬇ PRE-UPLOAD iz CoverUploader-a
  const preUploaded = (formData.get("coverPath") as string) || "";

  // opcioni alternativni inputi (ako ih imaš negde)
  const file = formData.get("cover") as File | null;
  const link = (formData.get("coverUrl") as string) || "";

  let coverPath: string | null = null;
  let coverUrl: string | null = null;

  if (preUploaded) {
    coverPath = preUploaded;
  } else if (file && file.size > 0) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const objectPath = `posts/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;
    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(objectPath, file, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });
    if (error) throw new Error("Upload nije uspeo: " + error.message);
    coverPath = objectPath;
  } else if (link.startsWith("http")) {
    coverUrl = link;
  }

  await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverPath,
      coverUrl,
      published: false,
    },
  });

  revalidatePath("/admin/vesti");
  revalidatePath("/vesti");
}

export async function updatePost(formData: FormData) {
  await assertSuperAdmin();

  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Nedostaje ID");

  const existing = await prisma.post.findUnique({
    where: { id },
    select: { slug: true, coverPath: true, coverUrl: true },
  });
  if (!existing) throw new Error("Vest ne postoji");

  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Naslov je obavezan");

  const slug =
    (formData.get("slug")?.toString() || existing.slug).trim() || existing.slug;
  const excerpt = (formData.get("excerpt") as string) || null;
  const content = (formData.get("content") as string) || null;

  const removeCover = formData.get("removeCover") === "on";
  const preUploaded = (formData.get("coverPath") as string) || ""; // ⬅ dodato
  const file = formData.get("cover") as File | null;
  const link = (formData.get("coverUrl") as string) || "";

  let coverPath: string | null = existing.coverPath;
  let coverUrl: string | null = existing.coverUrl;

  if (removeCover) {
    if (existing.coverPath) {
      await supabaseAdmin.storage
        .from(BUCKET)
        .remove([existing.coverPath])
        .catch(() => {});
    }
    coverPath = null;
    coverUrl = null;
  } else if (preUploaded) {
    if (existing.coverPath && existing.coverPath !== preUploaded) {
      await supabaseAdmin.storage
        .from(BUCKET)
        .remove([existing.coverPath])
        .catch(() => {});
    }
    coverPath = preUploaded;
    coverUrl = null;
  } else if (file && file.size > 0) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const objectPath = `posts/${id}-${Date.now()}.${ext}`;
    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(objectPath, file, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });
    if (error) throw new Error("Upload nije uspeo: " + error.message);
    if (existing.coverPath && existing.coverPath !== objectPath) {
      await supabaseAdmin.storage
        .from(BUCKET)
        .remove([existing.coverPath])
        .catch(() => {});
    }
    coverPath = objectPath;
    coverUrl = null;
  } else if (link.startsWith("http")) {
    coverUrl = link;
    coverPath = null;
  }

  await prisma.post.update({
    where: { id },
    data: { title, slug, excerpt, content, coverPath, coverUrl },
  });

  revalidatePath(`/admin/vesti/${id}`);
  revalidatePath("/admin/vesti");
  revalidatePath("/vesti");
}

export async function togglePublishAction(formData: FormData) {
  await assertSuperAdmin();
  const id = String(formData.get("id") || "");
  const publish = String(formData.get("publish") || "") === "1";
  if (!id) throw new Error("Nedostaje ID");

  await prisma.post.update({ where: { id }, data: { published: publish } });
  revalidatePath("/admin/vesti");
  revalidatePath("/vesti");
}

export async function deletePostAction(formData: FormData) {
  await assertSuperAdmin();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Nedostaje ID");

  try {
    const existing = await prisma.post.findUnique({
      where: { id },
      select: { coverPath: true },
    });
    if (existing?.coverPath) {
      await supabaseAdmin.storage
        .from(BUCKET)
        .remove([existing.coverPath])
        .catch(() => {});
    }
  } catch {}
  await prisma.post.delete({ where: { id } });

  revalidatePath("/admin/vesti");
  revalidatePath("/vesti");
}
