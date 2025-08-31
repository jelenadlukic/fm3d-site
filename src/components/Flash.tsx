"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

/**
 * Čita ?notice=... ili ?error=... iz URL-a, prikaže baner 3s,
 * zatim očisti query parametre iz URL-a.
 */
export default function Flash() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const notice = sp.get("notice");
  const error = sp.get("error");

  const [open, setOpen] = useState<boolean>(Boolean(notice || error));

  const variant = useMemo<"success" | "error" | "info">(() => {
    if (error) return "error";
    if (notice) return "success";
    return "info";
  }, [notice, error]);

  const text = notice || error || "";

  useEffect(() => {
    if (!text) return;
    setOpen(true);
    const t = setTimeout(() => {
      setOpen(false);
      // očisti query parametre
      router.replace(pathname, { scroll: false });
    }, 3000);
    return () => clearTimeout(t);
  }, [text, pathname, router]);

  if (!open || !text) return null;

  const base =
    "fixed left-1/2 top-4 z-[60] w-[min(92vw,640px)] -translate-x-1/2 rounded-md border px-3 py-2 text-sm shadow-lg";

  const styles =
    variant === "success"
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
      : variant === "error"
      ? "border-red-500/40 bg-red-500/10 text-red-200"
      : "border-cyan-500/40 bg-cyan-500/10 text-cyan-100";

  const Icon =
    variant === "success" ? CheckCircle2 : variant === "error" ? AlertTriangle : Info;

  return (
    <div className={`${base} ${styles}`}>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" />
        <span>{text}</span>
      </div>
    </div>
  );
}
