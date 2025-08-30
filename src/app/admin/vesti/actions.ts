"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

function assertAdmin(role?: string | null) {
  if (!(role === "ADMIN" || role === "SUPERADMIN")) {
    throw new Error("Unauthorized");
  }
}

const PostSchema = z.object({
  title: z.string().min(3, "Naslov je prekratak").max(180),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Dozvoljeni su mala slova, brojevi i -"),
  excerpt: z.string().max(400).optional().nullable(),
  content: z.string().optional().nullable(),
  coverUrl: z.string().url().optional().nullable(),
});

export async function createPost(form: FormData) {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email ?? "" },
  });
  assertAdmin(user?.role);

  const parsed = PostSchema.parse({
    title: form.get("title")?.toString(),
    slug: form.get("slug")?.toString(),
    excerpt: form.get("excerpt")?.toString() || null,
    content: form.get("content")?.toString() || null,
    coverUrl: form.get("coverUrl")?.toString() || null,
  });

  await prisma.post.create({
    data: { ...parsed, authorId: user!.id, published: false },
  });

  revalidatePath("/admin/vesti");
}

export async function updatePost(id: string, form: FormData) {
  const session = await getServerSession(authOptions);
  const me = await prisma.user.findUnique({
    where: { email: session?.user?.email ?? "" },
  });
  assertAdmin(me?.role);

  const parsed = PostSchema.partial().parse({
    title: form.get("title")?.toString(),
    slug: form.get("slug")?.toString(),
    excerpt: form.get("excerpt")?.toString() || null,
    content: form.get("content")?.toString() || null,
    coverUrl: form.get("coverUrl")?.toString() || null,
  });

  await prisma.post.update({ where: { id }, data: parsed });
  revalidatePath("/admin/vesti");
  revalidatePath(`/admin/vesti/${id}`);
}

export async function deletePost(id: string) {
  const session = await getServerSession(authOptions);
  const me = await prisma.user.findUnique({
    where: { email: session?.user?.email ?? "" },
  });
  assertAdmin(me?.role);

  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/vesti");
}

export async function togglePublish(id: string, next: boolean) {
  const session = await getServerSession(authOptions);
  const me = await prisma.user.findUnique({
    where: { email: session?.user?.email ?? "" },
  });
  assertAdmin(me?.role);

  await prisma.post.update({ where: { id }, data: { published: next } });
  revalidatePath("/admin/vesti");
}
