// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ShieldCheck, Users, UserPlus, ClipboardList, FolderKanban, Plane,
  Calendar, FileText, GraduationCap, Globe, Newspaper, Image as ImageIcon,
  BookOpen, FileSpreadsheet, Settings, HelpCircle, ArrowRight
} from "lucide-react";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border/80 bg-white/[0.03] p-5 ${className}`}>{children}</div>;
}
function Quick({ href, title, desc, Icon }:{href:string;title:string;desc:string;Icon:any}) {
  return (
    <Link href={href} className="group rounded-xl border border-border/80 bg-white/[0.03] p-4 hover:border-primary/60 transition">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-white/10 p-2"><Icon className="h-5 w-5" /></div>
        <div>
          <div className="font-semibold flex items-center gap-2">
            {title}
            <ArrowRight className="h-4 w-4 opacity-60 group-hover:translate-x-0.5 transition" />
          </div>
          <p className="text-sm opacity-70 mt-0.5">{desc}</p>
        </div>
      </div>
    </Link>
  );
}

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { name: true, email: true, image: true, role: true },
  });
  const role = user?.role ?? "USER";
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";
  const isSuper = role === "SUPERADMIN";

  return (
    <main className="relative mx-auto max-w-7xl px-4 py-10">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-48 w-[100vw] -translate-x-1/2 blur-3xl bg-gradient-to-r from-purple-500/15 via-cyan-400/15 to-lime-400/15" />

      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-white/70">Dobrodošla, {user?.name || user?.email}.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border">
            <Image src={user?.image || "/images/avatar-placeholder.png"} alt="Avatar" fill className="object-cover" />
          </div>
          <div className="text-sm opacity-80">
            <div className="uppercase rounded-md border border-border/80 px-2 py-0.5 inline-flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" /> {role}
            </div>
          </div>
        </div>
      </header>

      {/* Brze akcije */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Quick href="/admin/vesti" title="Vesti" desc="Diseminacija: objave & najave" Icon={Newspaper} />
        <Quick href="/admin/radovi/new" title="Novi rad" desc="Portfolio: rad učenika (GLTF/Video)" Icon={ImageIcon} />
        <Quick href="/admin/konkurs" title="Konkurs & prijave" desc="Forma, kriterijumi, bodovanje" Icon={FolderKanban} />
        <Quick href="/admin/mobilnosti" title="Mobilnosti" desc="Cohorti, LA, plan puta, sertifikati" Icon={Plane} />
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* LEVA 2 STUBA */}
        <div className="space-y-6 lg:col-span-2">
          {/* Projekat / Operativa */}
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Projekat — FM3D (operativa)</h2>
                <p className="text-sm opacity-70 mt-1">Učenje, evaluacija, priznavanje, resursi.</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Link href="/admin/plan-obuke" className="rounded-xl border border-border/80 p-4 hover:border-primary/60 transition">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/10 p-2"><BookOpen className="h-5 w-5" /></div>
                  <div>
                    <div className="font-semibold">Moduli učenja</div>
                    <p className="text-sm opacity-70">Blender · 3D štampa · Three.js/WebGL · engleski</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/evaluacija" className="rounded-xl border border-border/80 p-4 hover:border-primary/60 transition">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/10 p-2"><ClipboardList className="h-5 w-5" /></div>
                  <div>
                    <div className="font-semibold">Evaluacija</div>
                    <p className="text-sm opacity-70">Rubrike, nedeljni izazovi, mentorski izveštaji</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/priznavanje" className="rounded-xl border border-border/80 p-4 hover:border-primary/60 transition">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/10 p-2"><GraduationCap className="h-5 w-5" /></div>
                  <div>
                    <div className="font-semibold">Priznavanje</div>
                    <p className="text-sm opacity-70">Europass Mobility, sertifikati partnera & škole</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/resursi" className="rounded-xl border border-border/80 p-4 hover:border-primary/60 transition">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/10 p-2"><FileText className="h-5 w-5" /></div>
                  <div>
                    <div className="font-semibold">Resursi / “3D za sve”</div>
                    <p className="text-sm opacity-70">Tutorijali, vodiči, priručnici, download</p>
                  </div>
                </div>
              </Link>
            </div>
          </Card>

          {/* Sadržaj sajta */}
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">Sadržaj sajta</h2>
                <p className="text-sm opacity-70 mt-1">Vesti, portfolio radovi, stranice i FAQ.</p>
              </div>
              <Settings className="h-5 w-5 opacity-80" />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Quick href="/admin/vesti" title="Vesti" desc="Kreiraj · izmeni · objavi" Icon={Newspaper} />
              <Quick href="/admin/radovi" title="Radovi / Portfolio" desc="Draft → review → publish" Icon={ImageIcon} />
              <Quick href="/admin/stranice" title="Static Pages" desc="O projektu, Kontakt, Konkurs…" Icon={FileText} />
              <Quick href="/admin/faq" title="FAQ" desc="Pitanja i odgovori" Icon={HelpCircle} />
            </div>
          </Card>

          {/* Mobilnosti */}
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">Mobilnosti</h2>
                <p className="text-sm opacity-70 mt-1">Cohorti, putni plan, Learning Agreement, agenda.</p>
              </div>
              <Plane className="h-5 w-5 opacity-80" />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Quick href="/admin/mobilnosti" title="Cohorti" desc="Lista, polaznici, uloge" Icon={Users} />
              <Quick href="/admin/mobilnosti/plan" title="Plan puta & agenda" desc="Letovi, transferi, raspored" Icon={Calendar} />
              <Quick href="/admin/mobilnosti/dokumenti" title="Dokumenta" desc="LA, saglasnosti, GDPR" Icon={FileSpreadsheet} />
            </div>
          </Card>
        </div>

        {/* DESNI STUB */}
        <div className="space-y-9 lg:space-y-9">
          {isAdmin && (
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Selekcija & prijave</h2>
                  <p className="text-sm opacity-70 mt-1">Konkurs, kriterijumi, bodovanje, odluke.</p>
                </div>
                <UserPlus className="h-5 w-5 opacity-80" />
              </div>

              <div className="mt-4 grid gap-3">
                <Quick href="/admin/konkurs" title="Konkurs" desc="Opis, uslovi, rokovi" Icon={FolderKanban} />
                <Quick href="/admin/prijave" title="Prijave" desc="Inbox prijava · CSV export" Icon={FileSpreadsheet} />
                <Quick href="/admin/selekcija" title="Selekcija" desc="Bodovanje · rang liste · odluke" Icon={ClipboardList} />
              </div>
            </Card>
          )}

          {isSuper && (
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Sistemske postavke</h2>
                  <p className="text-sm opacity-70 mt-1">Korisnici, uloge, domeni i integracije.</p>
                </div>
                <Settings className="h-5 w-5 opacity-80" />
              </div>
              <div className="mt-4 grid gap-3">
                <Quick href="/admin/korisnici" title="Korisnici & uloge" desc="Dodaj/menjaj uloge (USER/ADMIN/SUPERADMIN)" Icon={Users} />
                <Quick href="/admin/integracije" title="Integracije" desc="Supabase/Prisma · Storage · Email" Icon={Globe} />
                <Quick href="/admin/mapa-sajta" title="Mapa sajta" desc="Navigacija, SEO meta, redirecti" Icon={FileText} />
              </div>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
