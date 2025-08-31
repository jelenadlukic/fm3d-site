// components/back-to-top.tsx
"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={handleClick}
      aria-label="Nazad na vrh"
      className={[
        "fixed bottom-5 right-5 z-[60]",
        "rounded-full border border-white/15 bg-white/10 backdrop-blur",
        "shadow-lg p-3 hover:bg-white/20",
        "transition-opacity duration-300",
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400",
      ].join(" ")}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
