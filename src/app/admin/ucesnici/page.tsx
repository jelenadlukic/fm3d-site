import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Flash from "@/components/Flash";
import { createParticipantAction, deleteParticipantAction } from "./action";
import Link from "next/link";
import { ConfirmButton } from "@/components/ConfirmButton";

const input =
  "w-full rounded-md border border-border/70 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30";

export default async function AdminUcesniciPage() {
  const session = await getServerSession(authOptions);
  const me = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user.email } })
    : null;

  if (!me || me.role !== "SUPERADMIN") redirect("/login");

  const users = await prisma.user.findMany({
    orderBy: { name: "desc" },
    select: { id: true, name: true, email: true, role: true },
  });

  async function createAction(formData: FormData) {
    "use server";
    await createParticipantAction(formData);
  }

  return (
    <main className="relative mx-auto max-w-6xl px-4 py-10">
      <Flash />

      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Učesnici — Admin</h1>
        <Link href="/dashboard" className="text-sm underline opacity-80 hover:opacity-100">
          ← Nazad na dashboard
        </Link>
      </header>

      {/* NOVI UČESNIK */}
      <section className="mb-8 rounded-2xl border border-border/70 p-5">
        <h2 className="font-semibold mb-4">Novi učesnik</h2>
        <form action={createAction} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 grid gap-1">
            <label className="text-sm opacity-80">Ime i prezime</label>
            <input name="name" className={input} required />
          </div>

          <div className="grid gap-1">
            <label className="text-sm opacity-80">Email</label>
            <input name="email" type="email" className={input} required />
          </div>

          <div className="grid gap-1">
            <label className="text-sm opacity-80">Uloga</label>
            <select name="role" className={input} defaultValue="STUDENT">
              <option value="STUDENT">Učenik</option>
              <option value="PARENT">Roditelj</option>
            </select>
          </div>

          <div className="grid gap-1">
            <label className="text-sm opacity-80">Lozinka</label>
            <input name="password" type="password" className={input} placeholder="min 8 karaktera" required />
          </div>

          <div className="sm:col-span-2 grid gap-1">
            <label className="text-sm opacity-80">Biografija (opciono)</label>
            <textarea name="bio" rows={3} className={input} />
          </div>

          <div className="sm:col-span-2 grid gap-1">
            <label className="text-sm opacity-80">Avatar (opciono)</label>
            <input type="file" name="avatar" accept="image/*" className="block text-sm" />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button className="rounded-md border border-border px-4 py-2 hover:border-primary/60">
              Kreiraj učesnika
            </button>
          </div>
        </form>
      </section>

      {/* LISTA */}
      <section className="rounded-2xl border border-border/70 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Svi učesnici</h2>
          <div className="text-xs opacity-70">Ukupno: {users.length}</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left opacity-70">
              <tr>
                <th className="py-2">Ime</th>
                <th>Email</th>
                <th>Uloga</th>
                <th className="text-right pr-2">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-border/60">
                  <td className="py-2">{u.name || "—"}</td>
                  <td className="opacity-80">{u.email}</td>
                  <td className="opacity-80">{u.role}</td>
                  <td className="text-right space-x-2">
                    <Link
                      href={`/admin/ucesnici/${u.id}`}
                      className="rounded-md border border-border px-2 py-1 hover:border-primary/60"
                    >
                      Uredi
                    </Link>

                    <form action={deleteParticipantAction} className="inline">
                      <input type="hidden" name="id" value={u.id} />
                      <ConfirmButton
                        type="submit"
                        message="Obrisati učesnika?"
                        className="rounded-md border border-red-500/50 px-2 py-1 text-red-300 hover:border-red-400"
                      >
                        Obriši
                      </ConfirmButton>
                    </form>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="py-4 opacity-70" colSpan={4}>Nema učesnika.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
