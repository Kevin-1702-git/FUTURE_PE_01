import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="section-shell flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <p className="text-sm uppercase tracking-[0.24em] text-brand-primary">404</p>
      <h1 className="font-heading text-5xl">The table you requested is not available.</h1>
      <p className="max-w-2xl text-stone-600 dark:text-stone-300">
        The page could not be found. Head back to the menu or return home to keep exploring Feast Lane.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Back Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/menu">View Menu</Link>
        </Button>
      </div>
    </div>
  );
}
