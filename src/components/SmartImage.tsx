import Image, { ImageProps } from "next/image";

type Props = Omit<ImageProps, "src"> & { src: string };

function isAllowedHost(url: string) {
  try {
    const u = new URL(url);
    const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : "";
    return (
      u.protocol === "https:" &&
      (
        u.hostname.endsWith(".fbcdn.net") ||          // Facebook CDN
        u.hostname === supabaseHost                    // tvoj Supabase
      )
    );
  } catch {
    return false;
  }
}

export function SmartImage({ src, alt, ...rest }: Props) {
  // Lokalni fajl iz `public/`
  if (src.startsWith("/")) {
    return <Image src={src} alt={alt} {...rest} />;
  }
  // Dozvoljeni eksterni hostovi → koristi Next/Image
  if (isAllowedHost(src)) {
    return <Image src={src} alt={alt} {...rest} />;
  }
  // Ostalo → klasičan <img> (bez Next optimizacije, ali i bez greške)
   
  return <img src={src} alt={alt} className={(rest as any).className} />;
}
