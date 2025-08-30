"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Badge } from "@/components/ui/badge";

type Profile = { full_name: string | null; role: string | null };

function RoleBadge({ role }: { role?: string | null }) {
  if (!role) return null;
  const cls =
    role === "superadmin" ? "bg-purple-600/30 text-purple-200 border-purple-400/30" :
    role === "admin"      ? "bg-cyan-600/30   text-cyan-200   border-cyan-400/30"   :
    role === "teacher"    ? "bg-lime-600/30   text-lime-200   border-lime-400/30"   :
    role === "parent"     ? "bg-amber-600/30  text-amber-200  border-amber-400/30"  :
                            "bg-slate-600/30  text-slate-200  border-slate-400/30";
  return <Badge variant="outline" className={`rounded-md ${cls}`}>{role}</Badge>;
}

export default function UserMenu() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
        const { data } = await supabaseBrowser
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .maybeSingle();
        if (data) setProfile({ full_name: data.full_name, role: data.role });
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="text-xs opacity-60">…</div>;

 

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="hidden sm:inline opacity-80">
        {profile?.full_name || email}
      </span>
      <RoleBadge role={profile?.role ?? undefined} />
      
    </div>
  );
}
