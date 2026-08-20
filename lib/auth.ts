import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const fallbackUsers = [
  {
    id: "user-admin",
    name: "Aman Admin",
    email: "admin@feastlane.com",
    phone: "+91 98765 43210",
    role: "RESTAURANT_ADMIN",
    restaurantId: "rest-feastlane-main",
    passwordHash: "$2a$10$ACaWN.bJ632ZW3vmuJF.9.RkmVWMLnEV2Bpwt5lzr.3DLgjAtAvki" // admin123
  },
  {
    id: "user-customer",
    name: "Riya Customer",
    email: "customer@feastlane.com",
    phone: "+91 98765 12345",
    role: "CUSTOMER",
    restaurantId: undefined,
    passwordHash: "$2a$10$hFd.wTVp9OGjp8q75fPHm.7gIdCeUcqQKMKozfZjbkemdFtg41OIm" // customer123
  }
];

export const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "development-secret-key-feastlane-12345",
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const normalizedEmail = email.toLowerCase().trim();

        let dbUser = null;
        try {
          dbUser = await prisma.user.findFirst({
            where: { email: { equals: normalizedEmail, mode: "insensitive" } }
          });
        } catch (e) {
          console.warn("Database lookup failed in auth, using fallback accounts if matched:", e);
        }

        if (dbUser && dbUser.passwordHash) {
          const matches = await bcrypt.compare(password, dbUser.passwordHash);
          if (matches) {
            return {
              id: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              phone: dbUser.phone ?? undefined,
              role: dbUser.role,
              restaurantId: (dbUser as any).restaurantId || "rest-feastlane-main"
            };
          }
        }

        // Fallback check if DB user not present or DB unavailable
        const fallback = fallbackUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
        if (fallback) {
          const matches = await bcrypt.compare(password, fallback.passwordHash);
          if (matches) {
            return {
              id: fallback.id,
              name: fallback.name,
              email: fallback.email,
              phone: fallback.phone,
              role: fallback.role,
              restaurantId: fallback.restaurantId
            };
          }
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.phone = (user as any).phone;
        token.restaurantId = (user as any).restaurantId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        (session.user as any).role = (token.role as string | undefined) ?? "CUSTOMER";
        (session.user as any).phone = (token.phone as string | undefined) ?? "";
        (session.user as any).restaurantId = (token.restaurantId as string | undefined) ?? "rest-feastlane-main";
      }
      return session;
    }
  }
};
