import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Login"
        title="Sign in to track orders, rewards, wishlist, and reservations"
        description="Demo accounts: admin@feastlane.com / admin123 and customer@feastlane.com / customer123"
      />
      <section className="section-shell pb-16 md:pb-24">
        <Card className="mx-auto max-w-xl space-y-5">
          <Input placeholder="Email address" type="email" />
          <Input placeholder="Password" type="password" />
          <Button className="w-full">Login</Button>
          <div className="flex items-center justify-between text-sm text-stone-500">
            <Link href="/forgot-password">Forgot Password?</Link>
            <Link href="/register">Create account</Link>
          </div>
        </Card>
      </section>
    </SiteShell>
  );
}
