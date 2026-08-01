import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";
import { getPrisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: {
    signIn: `${ADMIN_BASE_PATH}/login`,
    error: `${ADMIN_BASE_PATH}/login`,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";
        if (!email || !password) {
          throw new Error("Email and password are required.");
        }

        const limited = rateLimit(`admin-login:${email}`, 8, 15 * 60_000);
        if (!limited.ok) {
          throw new Error("Too many login attempts. Try again later.");
        }

        const prisma = getPrisma();
        if (!prisma) {
          throw new Error("Database is not configured.");
        }

        const user = await prisma.adminUser.findUnique({ where: { email } });
        if (!user) {
          throw new Error("Invalid email or password.");
        }

        const ok = await compare(password, user.passwordHash);
        if (!ok) {
          throw new Error("Invalid email or password.");
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role ?? "admin";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
