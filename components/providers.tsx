"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/cart-context";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AppToaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <CartProvider>
          {children}
          <AppToaster />
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
