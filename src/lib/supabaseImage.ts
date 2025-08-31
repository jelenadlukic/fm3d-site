import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { BUCKET } from "@/lib/bucket";

const TTL = Number(process.env.SIGNED_URL_TTL || 3600);

/** Server-side signed URL za Supabase Storage putanju. */
export async function signedUrl(
  path: string,
  bucket = BUCKET,
  expiresIn = TTL
) {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);
  if (error || !data?.signedUrl)
    throw error || new Error("Signed URL nije generisan");
  return data.signedUrl;
}
