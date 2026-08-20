"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

import { PageHero } from "@/components/layout/page-hero";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        toast.error("Invalid email or password.");
      } else {
        toast.success("Logged in successfully!");
        router.refresh();
        router.push("/customer/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow="Customer Sign In"
        title="Sign in to your Feast Lane Account"
        description="Track your orders, view saved delivery addresses, apply promo coupons, and earn reward points."
      />
      <section className="section-shell pb-16 md:pb-24">
        <Card className="mx-auto max-w-xl p-8 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="customer@feastlane.com"
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
            <Button type="submit" className="w-full h-11 font-bold" disabled={loading}>
              {loading ? "Signing in..." : "Login to Customer Account"}
            </Button>

            <div className="rounded-xl bg-stone-50 p-4 text-xs text-stone-600 dark:bg-stone-900 dark:text-stone-400">
              <p className="font-bold mb-1 text-stone-800 dark:text-stone-200">Demo Customer Credentials:</p>
              <p>Email: <strong>customer@feastlane.com</strong> • Password: <strong>customer123</strong></p>
            </div>

            <div className="flex items-center justify-between text-sm text-stone-500 pt-2">
              <Link href="/forgot-password" className="hover:underline">
                Forgot Password?
              </Link>
              <Link href="/register" className="font-semibold text-brand-primary hover:underline">
                Create new account
              </Link>
            </div>

            <div className="border-t border-stone-100 pt-4 dark:border-stone-800 text-center text-xs text-stone-500">
              Are you restaurant staff?{" "}
              <Link href="/admin/login" className="font-bold text-amber-600 dark:text-amber-400 hover:underline">
                Restaurant Admin Login →
              </Link>
            </div>
          </form>
        </Card>
      </section>
    </SiteShell>
  );
}
