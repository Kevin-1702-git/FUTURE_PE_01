import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
      phone?: string;
      restaurantId?: string;
    };
  }

  interface User {
    role?: string;
    phone?: string;
    restaurantId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    phone?: string;
    restaurantId?: string;
  }
}
