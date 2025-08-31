"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

export default function Flash() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const notice = sp.get("notice");
  const error = sp.get("error");

  const [open, setOpen] = useState<boolean>(Boolean(notice || error));
  const [topOffset, setTopOffset] = useState<number>(24); // default 24px ako nema header-a

  const variant = useMemo<"success" | "error" | "info">(() => {
    if (error) return "error";
    if (notice) return "success";
    return "info";
  }, [notice, error]);

  const text = notice || error || "";

  // ⬇️ Izmeri visinu fiksnog header-a i postavi top offset
  useEffect(() => {
    function computeOffset() {
      const header = document.querySelector("header");
      const h = header instanceof HTMLElement ? header.offsetHeight : 0;
      // dodatni razmak 12px ispod headera
      setTopOffset(h ? h + 12 : 24);
    }
    computeOffset();
    // recompute na resize (ako se visina headera promeni na mobilnom)
    window.addEventListener("resize", computeOffset);
    return () => window.removeEventListener("resize", computeOffset);
  }, []);

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
    "fixed left-1/2 z-[70] w-[min(92vw,640px)] -translate-x-1/2 rounded-md border px-3 py-2 text-sm shadow-lg pointer-events-auto";

  const styles =
    variant === "success"
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
      : variant === "error"
      ? "border-red-500/40 bg-red-500/10 text-red-200"
      : "border-cyan-500/40 bg-cyan-500/10 text-cyan-100";

  const Icon =
    variant === "success" ? CheckCircle2 : variant === "error" ? AlertTriangle : Info;

  return (
    <div className={`${base} ${styles}`} style={{ top: topOffset }}>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" />
        <span>{text}</span>
      </div>
    </div>
  );
}
