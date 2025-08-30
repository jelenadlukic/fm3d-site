// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { id: true, name: true, email: true, image: true, role: true, emailVerified: true },
  });

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";

  return (
    <main className="relative mx-auto max-w-6xl px-4 py-10">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-48 w-[100vw] -translate-x-1/2 blur-3xl bg-gradient-to-r from-purple-500/15 via-cyan-400/15 to-lime-400/15" />
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-white/70">Dobrodošla, {user?.name || user?.email}.</p>
      </header>

      <section className="rounded-2xl border border-border p-5 flex items-center gap-5">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border">
          <Image src={user?.image || "/images/avatar-placeholder.png"} alt="Avatar" fill className="object-cover" />
        </div>
        <div className="flex-1">
          <div className="text-lg font-semibold">{user?.name || "Bez imena"}</div>
          <div className="text-sm opacity-80">{user?.email}</div>
          <div className="mt-1 inline-flex rounded-md border border-border px-2 py-0.5 text-xs uppercase opacity-80">
            {user?.role}
          </div>
        </div>
        <Link href="/profil" className="rounded-md border border-border px-3 py-1.5 text-sm hover:border-primary/60">
          Podesi profil
        </Link>
      </section>

      {isAdmin && (
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/korisnici" className="rounded-xl border border-border p-4 hover:border-primary/60">
            <h2 className="font-semibold">Korisnici</h2>
            <p className="text-sm opacity-70">Upravljanje učesnicima (učenici, profesori, roditelji).</p>
          </Link>
          <Link href="/admin/vesti" className="rounded-xl border border-border p-4 hover:border-primary/60">
            <h2 className="font-semibold">Vesti</h2>
            <p className="text-sm opacity-70">Kreiraj, izmeni, objavi (CRUD).</p>
          </Link>
          <Link href="/admin/radovi" className="rounded-xl border border-border p-4 hover:border-primary/60">
            <h2 className="font-semibold">Radovi</h2>
            <p className="text-sm opacity-70">Objava portfolija (draft → review → published).</p>
          </Link>
        </section>
      )}
    </main>
  );
}
