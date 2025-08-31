// src/components/SmartImage.tsx
import Image, { ImageProps } from "next/image";

export function SmartImage({ src, alt, ...rest }: ImageProps) {
  if (!src) return null;

  try {
    const url = new URL(src as string);
    const allowedHost =
      process.env.NEXT_PUBLIC_SUPABASE_URL
        ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
        : "bjrrqehyiducogxnhsaw.supabase.co";

    // Dozvoli Next/Image za poznate hostove (Supabase Storage)
    if (url.hostname === allowedHost && url.pathname.startsWith("/storage/v1/object/")) {
      return <Image src={src} alt={alt} {...rest} />;
    }
  } catch {
    // ako nije validan URL, pada na <img> ispod
  }

  // Fallback – bez optimizacije, ali nikad ne puca
  return <img src={src as string} alt={alt as string} {...(rest as any)} />;
}
