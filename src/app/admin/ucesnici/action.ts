"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { BUCKET } from "@/lib/bucket";
import { hash } from "bcryptjs";

async function assertSuper() {
  const s = await getServerSession(authOptions);
  if (!s?.user?.email) throw new Error("Unauthorized");
  const me = await prisma.user.findUnique({
    where: { email: s.user.email },
    select: { role: true },
  });
  if (!me || me.role !== "SUPERADMIN") throw new Error("Forbidden");
}

export async function createParticipantAction(formData: FormData) {
  await assertSuper();

  const name = ((formData.get("name") as string) || "").trim();
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();
  const role = formData.get("role") as string as "STUDENT" | "PARENT";
  const password = ((formData.get("password") as string) || "").trim();
  const bio = ((formData.get("bio") as string) || "").trim() || null;
  const file = formData.get("avatar") as File | null;

  if (!name || !email || !role || !password) {
    redirect(
      "/admin/ucesnici?error=" +
        encodeURIComponent("Ime, email, uloga i lozinka su obavezni.")
    );
  }
  if (!["STUDENT", "PARENT"].includes(role)) {
    redirect(
      "/admin/ucesnici?error=" +
        encodeURIComponent("Uloga mora biti UČENIK ili RODITELJ.")
    );
  }
  if (password.length < 8) {
    redirect(
      "/admin/ucesnici?error=" +
        encodeURIComponent("Lozinka mora imati najmanje 8 karaktera.")
    );
  }

  let avatarPath: string | null = null;
  if (file && file.size > 0) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const objectPath = `users/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;
    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(objectPath, file, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });
    if (error)
      redirect(
        "/admin/ucesnici?error=" +
          encodeURIComponent("Upload avatara nije uspeo: " + error.message)
      );
    avatarPath = objectPath;
  }

  const passwordHash = await hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        role,
        passwordHash,
        bio,
        avatarPath,
      },
    });
  } catch (e: any) {
    if (e?.code === "P2002") {
      redirect(
        "/admin/ucesnici?error=" + encodeURIComponent("Email je već zauzet.")
      );
    }
    redirect(
      "/admin/ucesnici?error=" +
        encodeURIComponent("Neuspešno kreiranje učesnika.")
    );
  }

  revalidatePath("/admin/ucesnici");
  redirect(
    "/admin/ucesnici?notice=" + encodeURIComponent("Učesnik je kreiran.")
  );
}

export async function deleteParticipantAction(formData: FormData) {
  await assertSuper();
  const id = String(formData.get("id") || "");
  if (!id)
    redirect("/admin/ucesnici?error=" + encodeURIComponent("Nedostaje ID."));

  try {
    const u = await prisma.user.findUnique({
      where: { id },
      select: { avatarPath: true },
    });
    if (u?.avatarPath)
      await supabaseAdmin.storage
        .from(BUCKET)
        .remove([u.avatarPath])
        .catch(() => {});
  } catch {}

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/ucesnici");
  redirect(
    "/admin/ucesnici?notice=" + encodeURIComponent("Učesnik je obrisan.")
  );
}

export async function updateParticipantRoleAction(formData: FormData) {
  await assertSuper();
  const id = String(formData.get("id") || "");
  const role = formData.get("role") as string as
    | "STUDENT"
    | "PARENT"
    | "SUPERADMIN";
  if (!id || !role) redirect("/admin/ucesnici?error=Bad%20request");

  await prisma.user.update({ where: { id }, data: { role } });
  revalidatePath(`/admin/ucesnici/${id}`);
  revalidatePath(`/admin/ucesnici`);
  redirect(
    `/admin/ucesnici/${id}?notice=` + encodeURIComponent("Uloga je izmenjena.")
  );
}

export async function resetParticipantPasswordAction(formData: FormData) {
  await assertSuper();
  const id = String(formData.get("id") || "");
  const password = ((formData.get("password") as string) || "").trim();
  if (!id || password.length < 8) {
    redirect(
      `/admin/ucesnici/${id}?error=` +
        encodeURIComponent("Lozinka mora imati najmanje 8 karaktera.")
    );
  }

  const passwordHash = await hash(password, 10);
  await prisma.user.update({ where: { id }, data: { passwordHash } });

  revalidatePath(`/admin/ucesnici/${id}`);
  redirect(
    `/admin/ucesnici/${id}?notice=` +
      encodeURIComponent("Lozinka je resetovana.")
  );
}
