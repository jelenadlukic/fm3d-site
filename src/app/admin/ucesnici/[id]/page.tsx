import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Flash from "@/components/Flash";
import Link from "next/link";
import { resetParticipantPasswordAction, updateParticipantRoleAction } from "../action";

const input =
  "w-full rounded-md border border-border/70 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30";

type Props = { params: Promise<{ id: string }> };

export default async function AdminUcesnikEdit({ params }: Props) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  const me = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user.email } })
    : null;
  if (!me || me.role !== "SUPERADMIN") redirect("/login");

  const u = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!u) return notFound();

  async function roleAction(formData: FormData) {
    "use server";
    await updateParticipantRoleAction(formData);
  }

  async function resetPass(formData: FormData) {
    "use server";
    await resetParticipantPasswordAction(formData);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Flash />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Uredi učesnika</h1>
        <Link href="/admin/ucesnici" className="text-sm underline opacity-80 hover:opacity-100">
          ← Nazad na učesnike
        </Link>
      </div>

      <section className="rounded-2xl border border-border/70 p-5 mb-8">
        <h2 className="font-semibold mb-2">Osnovno</h2>
        <div className="text-sm opacity-80">Ime: {u.name || "—"}</div>
        <div className="text-sm opacity-80">Email: {u.email}</div>
      </section>

      <section className="rounded-2xl border border-border/70 p-5 mb-8">
        <h2 className="font-semibold mb-3">Uloga</h2>
        <form action={roleAction} className="grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="id" value={u.id} />
          <select name="role" defaultValue={u.role} className={input}>
            <option value="STUDENT">Učenik</option>
            <option value="PARENT">Roditelj</option>
            <option value="SUPERADMIN">Superadmin</option>
          </select>
          <div className="sm:col-span-2">
            <button className="rounded-md border border-border px-4 py-2 hover:border-primary/60">
              Sačuvaj ulogu
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-border/70 p-5">
        <h2 className="font-semibold mb-3">Reset lozinke</h2>
        <form action={resetPass} className="grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="id" value={u.id} />
          <input name="password" type="password" className={input} placeholder="Nova lozinka (min 8)" required />
          <div className="sm:col-span-2">
            <button className="rounded-md border border-border px-4 py-2 hover:border-primary/60">
              Postavi novu lozinku
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
