import { PageHero } from "@/components/layout/page-hero";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Forgot Password"
        title="Reset your Feast Lane account password"
        description="A production deployment can connect this flow to Nodemailer for secure password reset emails."
      />
      <section className="section-shell pb-16 md:pb-24">
        <Card className="mx-auto max-w-xl space-y-5">
          <Input placeholder="Email address" type="email" />
          <Button className="w-full">Send Reset Link</Button>
        </Card>
      </section>
    </SiteShell>
  );
}
