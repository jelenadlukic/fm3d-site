"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const url = new URL(window.location.href);

      // CASE 1: Magic link vraća tokene u #hash
      if (url.hash) {
        const hashParams = new URLSearchParams(url.hash.slice(1)); // skini "#"
        const access_token = hashParams.get("access_token");
        const refresh_token = hashParams.get("refresh_token");
        if (access_token && refresh_token) {
          await supabaseBrowser.auth.setSession({ access_token, refresh_token });
          router.replace("/");
          return;
        }
      }

      // CASE 2: PKCE/OAuth vraća ?code=...
      const code = url.searchParams.get("code");
      if (code) {
        await supabaseBrowser.auth.exchangeCodeForSession(code);
        router.replace("/");
        return;
      }

      // Fallback
      router.replace("/");
    })();
  }, [router]);

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold">Prijavljujem te…</h1>
      <p className="mt-2 opacity-70">Molim sačekaj sekund.</p>
    </div>
  );
}
