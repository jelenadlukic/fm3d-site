"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function assertAdmin() {
  const s = await getServerSession(authOptions);
  if (!s?.user?.email) throw new Error("Unauthorized");
  const me = await prisma.user.findUnique({
    where: { email: s.user.email },
    select: { role: true },
  });
  if (!me || me.role !== "SUPERADMIN") throw new Error("Forbidden");
}

export async function toggleWorkPublishAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  const publish = String(formData.get("publish") || "") === "1";
  if (!id) redirect("/admin/radovi?error=Bad%20request");
  await prisma.work.update({ where: { id }, data: { published: publish } });
  revalidatePath("/admin/radovi");
  revalidatePath("/radovi");
  redirect(
    "/admin/radovi?notice=" +
      encodeURIComponent(publish ? "Rad objavljen." : "Rad skinut sa objave.")
  );
}

export async function deleteWorkAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") || "");
  if (!id) redirect("/admin/radovi?error=Bad%20request");
  await prisma.work.delete({ where: { id } });
  revalidatePath("/admin/radovi");
  revalidatePath("/radovi");
  redirect("/admin/radovi?notice=" + encodeURIComponent("Rad obrisan."));
}
