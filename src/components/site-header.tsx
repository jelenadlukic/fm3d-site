"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import UserMenu from "@/components/user-menu";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose,
} from "@/components/ui/sheet";


// shared link
const NavItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="
      relative rounded-md px-1.5 py-0.5
      transition-colors duration-300
      hover:text-transparent hover:bg-clip-text
      hover:bg-gradient-to-r hover:from-purple-400 hover:via-cyan-300 hover:to-lime-300
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
    "
  >
    {children}
  </Link>
);


/** DESKTOP LINKS */
const NavLinksDesktop = ({ isAuth }: { isAuth: boolean }) => (
  <nav className="flex items-center gap-6 text-[17px] lg:text-[18px]">
    <NavItem href="/pocetna">Početna</NavItem>
    <NavItem href="/o-projektu">O projektu</NavItem>
    <NavItem href="/konkurs">Konkurs</NavItem>
    <NavItem href="/ucesnici">Učesnici</NavItem>
    <NavItem href="/portfolio">Radovi</NavItem>
    <NavItem href="/vesti">Vesti</NavItem>
    <NavItem href="/kontakt">Kontakt</NavItem>

    {!isAuth ? (
      <NavItem href="/login">LOGIN</NavItem>
    ) : (
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="
          group relative rounded-md px-1.5 py-0.5
          transition-colors duration-200 hover:text-primary hover:bg-white/5
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
        "
      >
        Odjava
        <span
          className="
            pointer-events-none absolute inset-x-1 -bottom-[2px] h-[2px]
            w-0 rounded-full
            bg-gradient-to-r from-purple-400 via-cyan-300 to-lime-300
            transition-all duration-300 ease-out
            group-hover:w-[calc(100%-0.75rem)]
          "
        />
      </button>
    )}
  </nav>
);

/** MOBILE LINKS — zatvaraju sheet + isti hover */
const NavLinksMobile = ({ isAuth }: { isAuth: boolean }) => (
  <nav className="flex flex-col items-start gap-4 text-[20px] leading-tight">
    {[
      ["/pocetna","Početna"],["/o-projektu","O projektu"],["/konkurs","Konkurs"],
      ["/ucesnici","Učesnici"],["/portfolio","Radovi"],["/vesti","Vesti"],["/kontakt","Kontakt"],
    ].map(([href,label]) => (
      <SheetClose asChild key={href}>
        <NavItem href={href as string}>{label}</NavItem>
      </SheetClose>
    ))}

    {!isAuth ? (
      <SheetClose asChild>
        <NavItem href="/login">LOGIN</NavItem>
      </SheetClose>
    ) : (
      <SheetClose asChild>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="
            group relative rounded-md px-1.5 py-0.5
            transition-colors duration-200 hover:text-primary hover:bg-white/5
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40
          "
        >
          Odjava
          <span
            className="
              pointer-events-none absolute inset-x-1 -bottom-[2px] h-[2px]
              w-0 rounded-full
              bg-gradient-to-r from-purple-400 via-cyan-300 to-lime-300
              transition-all duration-300 ease-out
              group-hover:w-[calc(100%-0.75rem)]
            "
          />
        </button>
      </SheetClose>
    )}
  </nav>
);



export default function SiteHeader() {
  const { data: session } = useSession();
  const isAuth = !!session?.user;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-[rgba(5,6,10,0.7)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-black tracking-tight text-xl lg:text-2xl">
          <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-lime-300 bg-clip-text text-transparent">FM3D</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <NavLinksDesktop isAuth={isAuth} />
          <UserMenu />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <UserMenu />
          <Sheet>
            <SheetTrigger aria-label="Otvori meni" className="inline-flex items-center rounded-md border border-border px-3 py-2 text-[16px] hover:border-primary/60">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-screen h-screen sm:max-w-none p-0 bg-[rgba(5,6,10,0.95)]">
              <div className="flex items-center justify-between px-4 h-16 border-b border-border">
                <SheetHeader className="p-0">
                  <SheetTitle className="text-lg font-black bg-gradient-to-r from-purple-400 via-cyan-300 to-lime-300 bg-clip-text text-transparent">FM3D</SheetTitle>
                </SheetHeader>
              </div>
              <div className="px-6 py-8">
                <NavLinksMobile isAuth={isAuth} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
