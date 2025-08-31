import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: "SUPERADMIN" | "STUDENT" | "PARENT";
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    role?: "SUPERADMIN" | "STUDENT" | "PARENT";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "SUPERADMIN" | "STUDENT" | "PARENT";
  }
}
