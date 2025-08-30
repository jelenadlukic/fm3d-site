// next.config.js
const SUPABASE_HOST = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "bjrrqehyiducogxnhsaw.supabase.co";

module.exports = {
  images: {
    remotePatterns: [
      // Supabase Storage (public)
      {
        protocol: "https",
        hostname: SUPABASE_HOST,
        pathname: "/storage/v1/object/public/**",
      },
      // Facebook CDN (primeri: scontent.fbeg5-1.fna.fbcdn.net, itd.)
      { protocol: "https", hostname: "*.fbcdn.net" },
      { protocol: "https", hostname: "scontent.*.fbcdn.net" }, // pokrije različite regione
    ],
  },
};