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
        });
        if (!user) return null;
        if (!user.passwordHash || typeof user.passwordHash !== "string") return null;
        const ok = await bcrypt.compare(creds.password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = (user as any).id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) (session.user as any).id = token.id;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // ako NextAuth pokuša na root, šaljemo na dashboard
      try {
        const path = new URL(url, baseUrl).pathname;
        if (path === "/") return `${baseUrl}/dashboard`;
      } catch {}
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  // NEMA Email providera → nema magic linkova
};
