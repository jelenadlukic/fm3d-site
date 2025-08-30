import Link from "next/link";
import { Menu } from "lucide-react";
import UserMenu from "@/components/user-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NavLinks = () => (
  <nav className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 text-sm">
    <Link href="/o-projektu" className="hover:text-primary transition">O projektu</Link>
    <Link href="/konkurs" className="hover:text-primary transition">Konkurs</Link>
    <Link href="/ucesnici" className="hover:text-primary transition">Učesnici</Link>
    <Link href="/portfolio" className="hover:text-primary transition">Radovi</Link>
    <Link href="/vesti" className="hover:text-primary transition">Vesti</Link>
    <Link href="/kontakt" className="hover:text-primary transition">Kontakt</Link>
    <Link href="/login" className="hover:text-primary transition">LOGIN</Link>
  </nav>
);

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[rgba(5,6,10,0.7)] backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-black tracking-tight text-lg">
          <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-lime-300 bg-clip-text text-transparent">
            FM3D
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
            <NavLinks />
            <UserMenu />
        </div>

        {/* Mobile: full-screen overlay meni (Sheet ima svoj X već) */}
        <div className="md:hidden">
          <UserMenu />
          <Sheet>
            <SheetTrigger
              aria-label="Otvori meni"
              className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm hover:border-primary/60"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-screen h-screen sm:max-w-none p-0 bg-[rgba(5,6,10,0.95)]"
            >
              <div className="flex items-center justify-between px-4 h-14 border-b border-border">
                <SheetHeader className="p-0">
                  <SheetTitle className="text-base font-black bg-gradient-to-r from-purple-400 via-cyan-300 to-lime-300 bg-clip-text text-transparent">
                    FM3D
                  </SheetTitle>
                </SheetHeader>
                {/* default X iz shadcn ostaje u gornjem desnom uglu */}
              </div>

              <div className="px-6 py-8">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
