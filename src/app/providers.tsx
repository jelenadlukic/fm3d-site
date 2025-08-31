"use client";
import { SessionProvider } from "next-auth/react"; // ili izbaci ako ne koristiš NextAuth
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  // Ako koristiš samo Supabase, može i samo: return <>{children}</>;
  return <SessionProvider>{children}</SessionProvider>;
}
