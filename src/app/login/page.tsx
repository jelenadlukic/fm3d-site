// src/app/login/page.tsx
"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,              // ⬅️ ručno
    });

    if (res?.error) {
      setErr("Pogrešan email ili lozinka.");
      return;
    }

    // sigurni redirect + osveži da server “vidi” novu sesiju
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <main className="relative mx-auto max-w-md px-4 py-12">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-48 w-[100vw] -translate-x-1/2 blur-3xl bg-gradient-to-r from-purple-500/15 via-cyan-400/15 to-lime-400/15" />
      <h1 className="text-2xl font-bold">Prijava</h1>
      <p className="mt-2 text-white/70 text-sm">Unesi admin kredencijale i bićeš preusmerena na dashboard.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input className="w-full rounded-md border border-border bg-transparent px-3 py-2"
               placeholder="Email" autoComplete="email"
               value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full rounded-md border border-border bg-transparent px-3 py-2"
               placeholder="Lozinka" type="password" autoComplete="current-password"
               value={password} onChange={(e)=>setPassword(e.target.value)} />

        <div className="flex items-center justify-between">
          <button type="button" onClick={() => {
            setEmail("admin@fm3d.local");
            setPassword("super-tajna-lozinka");
          }} className="text-xs opacity-70 hover:opacity-100 underline underline-offset-2">
            Popuni SEED admin kredencijale
          </button>

          <button type="submit" className="rounded-md border border-border px-3 py-2 text-sm hover:border-primary/60">
            Prijava
          </button>
        </div>

        {err && <p className="text-sm text-red-400 mt-2">{err}</p>}
      </form>
    </main>
  );
}
