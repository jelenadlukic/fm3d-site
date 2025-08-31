// src/lib/supabaseAdmin.ts
import { createClient } from "@supabase/supabase-js";

// Možeš koristiti isti URL iz NEXT_PUBLIC_ varijable
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !serviceRole) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY"
  );
}

// Admin klijent — KORISTI SAMO NA SERVERU (API/Server Actions)
export const supabaseAdmin = createClient(url, serviceRole);
