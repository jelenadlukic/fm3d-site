import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "FM3D — Future Makers 3D Skills for Tomorrow",
  description: "Zvanični sajt projekta FM3D: portfolio učenika, vesti, konkursi i resursi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr" className="dark">
      <body className="antialiased bg-background text-foreground">
        {/* Dekorativni glow sloj (ne hvata klikove) */}
        <div className="pointer-events-none fixed inset-0 -z-10
          bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.16),transparent_35%),
              radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.14),transparent_35%),
              radial-gradient(circle_at_50%_80%,rgba(163,230,53,0.10),transparent_35%)]" />
        <SiteHeader />
        <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
        <footer className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-10 text-sm opacity-80">
            © {new Date().getFullYear()} FM3D — Future Makers 3D Skills for Tomorrow
          </div>
        </footer>
      </body>
    </html>
  );
}
