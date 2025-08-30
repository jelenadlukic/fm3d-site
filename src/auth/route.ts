import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  // Ako Supabase vrati ?code=..., probaj razmenu koda za sesiju
  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (e) {
      // ignoriši - svakako redirektujemo
    }
  }

  // Vrati korisnika na početnu (ili promeni putanju po želji)
  return NextResponse.redirect(new URL("/", url.origin));
}
