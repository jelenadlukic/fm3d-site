// src/components/AutoHideBanner.tsx
"use client";

import { useEffect, useState } from "react";

export default function AutoHideBanner({
  msg,
  variant = "success", // "success" | "error"
  ms = 3000,
}: {
  msg?: string;
  variant?: "success" | "error";
  ms?: number;
}) {
  const [visible, setVisible] = useState(Boolean(msg));

  useEffect(() => {
    if (!msg) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), ms);
    return () => clearTimeout(t);
  }, [msg, ms]);

  if (!visible || !msg) return null;

  const style =
    variant === "success"
      ? "border-green-500/40 bg-green-500/10"
      : "border-red-500/40 bg-red-500/10";

  return (
    <div className={`rounded-md border ${style} px-3 py-2 text-sm`}>
      {variant === "success" ? "✅" : "⚠️"} {msg}
    </div>
  );
}
