// src/lib/supabaseBrowser.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !anon) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

// Public (anon) klijent — bezbedan za klijentski kod
export const supabasePublic = createClient(url, anon);

// Alias da ne menjaš postojeće import-e (ako negde piše supabaseBrowser)
export { supabasePublic as supabaseBrowser };
