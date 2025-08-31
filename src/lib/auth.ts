// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "Email i lozinka",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Lozinka", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: creds.email },
          select: {
            id: true,
            email: true,
            name: true,
            passwordHash: true,
            role: true,
          },
        });
        if (!user || !user.passwordHash) return null;

        const ok = await bcrypt.compare(creds.password, user.passwordHash);
        if (!ok) return null;

        // ⬇⬇ VAŽNO: vratimo i rolu
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
          role: user.role, // <—
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // na loginu upiši id i rolu u token
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role; // <—
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token?.id) (session.user as any).id = token.id;
        if (token?.role) (session.user as any).role = token.role; // <—
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Posle prijave NextAuth često koristi baseUrl kao polazni redirect.
      // Ako je cilj "naša" domena, usmeri na /profil.
      if (url.startsWith(baseUrl)) {
        try {
          const path = new URL(url).pathname;
          // Sve tipične destinacije nakon sign-in / login vraćamo na /profil
          if (
            path === "/" ||
            path === "/login" ||
            path.startsWith("/api/auth/signin") ||
            path.startsWith("/dashboard") // ako negde ostane stari link
          ) {
            return `${baseUrl}/profil`;
          }
          // inače propusti originalni interni URL
          return url;
        } catch {
          return `${baseUrl}/profil`;
        }
      }
      // spoljašnje domene – bezbedno vrati na root naše aplikacije
      return baseUrl;
    },
  },
};
