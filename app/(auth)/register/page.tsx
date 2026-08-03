import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Register"
        title="Create your Feast Lane account"
        description="Save addresses, reorder favorites, collect loyalty rewards, and manage reservations with a personalized dashboard."
      />
      <section className="section-shell pb-16 md:pb-24">
        <Card className="mx-auto max-w-xl space-y-5">
          <Input placeholder="Full name" />
          <Input placeholder="Email address" type="email" />
          <Input placeholder="Phone number" />
          <Input placeholder="Password" type="password" />
          <Button className="w-full">Create Account</Button>
          <p className="text-sm text-stone-500">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </Card>
      </section>
    </SiteShell>
  );
}
