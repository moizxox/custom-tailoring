import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        const identifier = (credentials.identifier as string).trim();
        const password = (credentials.password as string).trim();
        if (!identifier || !password) return null;

        try {
          const admin = await prisma.admin.findFirst({
            where: {
              OR: [
                { email: { equals: identifier, mode: "insensitive" } },
                { username: { equals: identifier, mode: "insensitive" } },
              ],
            },
          });

          if (!admin) return null;

          const passwordMatch = await bcrypt.compare(password, admin.password);
          if (!passwordMatch) return null;

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name ?? admin.username,
            role: admin.role,
            username: admin.username,
          };
        } catch (error) {
          console.error("[auth] credentials lookup failed:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "admin";
        token.username = (user as { username?: string }).username;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { username?: string }).username = token.username as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
});
