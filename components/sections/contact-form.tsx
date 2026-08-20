"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare, Send, CheckCircle2, Clock } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General Support");
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [userMessages, setUserMessages] = useState<any[]>([]);

  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setName(session.user.name);
      if (session.user.email) setEmail(session.user.email);
      if ((session.user as any).phone) setPhone((session.user as any).phone);
    }
  }, [session]);

  const loadUserMessages = async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/contact");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUserMessages(data.data || []);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadUserMessages();
  }, [session]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, orderId, message })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Message sent to Feast Lane management!");
        setMessage("");
        setOrderId("");
        loadUserMessages();
      } else {
        toast.error(data.message || "Message could not be sent.");
      }
    } catch (err) {
      toast.error("An error occurred while sending message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="p-8">
        <h3 className="font-heading text-2xl font-bold mb-4">Send a Message</h3>
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject / Inquiry Type</Label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-11 rounded-2xl border border-stone-200 bg-white px-4 text-sm dark:border-white/10 dark:bg-stone-900"
              >
                <option value="Order Support">Order Inquiry / Support</option>
                <option value="Reservation">Table Reservation Inquiry</option>
                <option value="Catering">Event Catering Inquiry</option>
                <option value="Feedback">Feedback & Suggestions</option>
                <option value="General Support">General Support</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID (Optional)</Label>
              <Input
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. ORD-172400123"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Your Message *</Label>
            <Textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your request or enquiry in detail..."
              required
            />
          </div>

          <Button type="submit" disabled={sending} className="w-full sm:w-auto font-bold gap-2">
            <Send className="h-4 w-4" />
            {sending ? "Sending..." : "Send Message to Feast Lane"}
          </Button>
        </form>
      </Card>

      {/* Sent Messages and Replies */}
      {userMessages.length > 0 && (
        <Card className="p-6 space-y-4">
          <h4 className="font-heading text-xl font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand-primary" /> Your Sent Messages & Replies
          </h4>
          <div className="space-y-4">
            {userMessages.map((msg) => (
              <div key={msg.id} className="rounded-2xl border border-stone-100 p-4 space-y-3 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900 dark:text-white">{msg.subject}</span>
                  <span className="text-xs text-stone-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-300">{msg.message}</p>
                {msg.orderId && (
                  <p className="text-xs text-brand-primary font-mono">Ref Order: #{msg.orderId}</p>
                )}

                {msg.reply ? (
                  <div className="mt-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-sm space-y-1">
                    <p className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Restaurant Response:
                    </p>
                    <p className="text-stone-700 dark:text-stone-300">{msg.reply}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                    <Clock className="h-3.5 w-3.5" /> Pending response from restaurant manager
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
