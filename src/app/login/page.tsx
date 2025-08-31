"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Učitaj sačuvan email (ako postoji)
  useEffect(() => {
    const saved = localStorage.getItem("fm3d_login_email");
    if (saved) {
      setEmail(saved);
      setRememberEmail(true);
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    // Zapamti/obriši email u localStorage (lozinku ne čuvamo — sigurnost)
    if (rememberEmail) localStorage.setItem("fm3d_login_email", email);
    else localStorage.removeItem("fm3d_login_email");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,       // ⬅️ pusti NextAuth da redirektuje
      callbackUrl: "/profil"// ⬅️ fallback; auth redirect callback ide na /profil
    });

    if (res?.error) {
      setErr("Pogrešan email ili lozinka.");
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <main className="relative mx-auto max-w-md px-4 py-12">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-48 w-[100vw] -translate-x-1/2 blur-3xl bg-gradient-to-r from-purple-500/15 via-cyan-400/15 to-lime-400/15" />

      <h1 className="text-2xl font-bold">Prijava</h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm text-white/70" htmlFor="email">Email</label>
          <input
            id="email"
            className="w-full rounded-md border border-border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400/40"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>

        {/* Lozinka + okce */}
        <div className="space-y-1">
          <label className="text-sm text-white/70" htmlFor="password">Lozinka</label>
          <div className="relative">
            <input
              id="password"
              className="w-full rounded-md border border-border bg-transparent px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="••••••••"
              type={showPass ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              aria-label={showPass ? "Sakrij lozinku" : "Prikaži lozinku"}
              className="absolute inset-y-0 right-2 grid place-items-center px-1 opacity-80 hover:opacity-100"
              tabIndex={0}
            >
              {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Zapamti me (čuvamo samo email) */}
        <label className="mt-2 flex select-none items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            className="peer hidden"
            checked={rememberEmail}
            onChange={(e) => setRememberEmail(e.target.checked)}
          />
          <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-white/30 peer-checked:bg-cyan-400/80 peer-checked:text-black transition">
            {rememberEmail ? <Check className="h-4 w-4" /> : null}
          </span>
          Zapamti me (email)
        </label>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              setEmail("admin@fm3d.local");
              setPassword("super-tajna-lozinka");
            }}
            className="text-xs opacity-70 hover:opacity-100 underline underline-offset-2"
          >
            Popuni SEED admin kredencijale
          </button>

          <button
            type="submit"
            className="rounded-md border border-border px-3 py-2 text-sm hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]"
          >
            Prijava
          </button>
        </div>

        {err && <p className="text-sm text-red-400 mt-2">{err}</p>}
      </form>
    </main>
  );
}
