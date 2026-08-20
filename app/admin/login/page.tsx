"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ShieldCheck, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

import { PageHero } from "@/components/layout/page-hero";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@feastlane.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false
      });

      if (res?.error) {
        toast.error("Invalid email or staff credentials.");
      } else {
        toast.success("Welcome back, Restaurant Admin!");
        router.refresh();
        router.push("/admin/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred during admin authentication.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow="Restaurant Management"
        title="Feast Lane Admin Portal Sign In"
        description="Authorized restaurant staff, managers, and restaurant admins control center for order fulfillment, menu management, and communications."
      />
      <section className="section-shell pb-16 md:pb-24">
        <Card className="mx-auto max-w-xl p-8 border-2 border-brand-primary/20 shadow-xl">
          <div className="flex items-center gap-3 mb-6 border-b border-stone-100 pb-4 dark:border-stone-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold">Restaurant Staff Login</h2>
              <p className="text-xs text-stone-500">Sign in with your assigned Restaurant Admin credentials</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@feastlane.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full h-12 font-bold text-base shadow-md" disabled={loading}>
              {loading ? "Authenticating Staff..." : "Sign In to Restaurant Dashboard"}
            </Button>

            <div className="rounded-xl bg-amber-50 p-4 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
              <p className="font-bold mb-1 flex items-center gap-1">
                <UserCheck className="h-4 w-4" /> Demo Restaurant Admin Account:
              </p>
              <p>Email: <strong>admin@feastlane.com</strong> • Password: <strong>admin123</strong></p>
            </div>

            <p className="text-center text-xs text-stone-500 pt-2">
              Are you a restaurant customer?{" "}
              <Link href="/login" className="font-semibold text-brand-primary hover:underline">
                Go to Customer Login
              </Link>
            </p>
          </form>
        </Card>
      </section>
    </SiteShell>
  );
}
