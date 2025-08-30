"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import Link from "next/link";

type Profile = { full_name: string | null; role: string | null };

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabaseBrowser
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .maybeSingle();
      setProfile(data ?? null);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="mx-auto max-w-6xl p-6">Učitavam…</div>;

  const role = profile?.role ?? "guest";
  const isAdmin = role === "admin" || role === "superadmin";

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <h1 className="text-2xl font-bold">Zabranjen pristup</h1>
        <p className="opacity-75 mt-2">Ova stranica je za administratore.</p>
        <Link href="/" className="mt-4 inline-flex rounded-md border px-3 py-1.5 text-sm">Nazad na početnu</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold">FM3D Admin</h1>
      <p className="opacity-75 mt-2">Dobrodošla, {profile?.full_name || "admin"}.</p>

      {/* starter „wow“ kartice – kasnije ćemo ih vezati na prave tabele */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border p-4">
          <h2 className="font-semibold">Radovi (works)</h2>
          <p className="text-sm opacity-70">Dodaj/objavi radove učenika.</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <h2 className="font-semibold">Konkursi & prijave</h2>
          <p className="text-sm opacity-70">Objavi konkurs, pregledaj prijave.</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <h2 className="font-semibold">Vesti & resursi</h2>
          <p className="text-sm opacity-70">Piši objave i tutorijale.</p>
        </div>
      </div>
    </div>
  );
}
