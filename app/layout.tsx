import type { Metadata } from "next";

import "@/app/globals.css";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Feast Lane | Premium Multi-Cuisine Restaurant in Chennai",
    template: "%s | Feast Lane"
  },
  description: siteConfig.description,
  openGraph: {
    title: "Feast Lane",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "Feast Lane",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Feast Lane restaurant hero"
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Feast Lane",
    description: siteConfig.description,
    images: [siteConfig.ogImage]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
