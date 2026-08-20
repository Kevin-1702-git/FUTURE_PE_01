"use client";

import { useEffect, useState } from "react";
import { MessageSquare, CheckCircle2, Clock, Send, Mail, Phone, User, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { AdminNav } from "@/components/dashboard/admin-nav";
import { PageHero } from "@/components/layout/page-hero";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  orderId?: string;
  status: string;
  reply?: string;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [replyingId, setReplyingId] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/contact");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMessages(data.data || []);
        }
      }
    } catch (e) {
      console.warn("Fetch admin messages error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSendReply = async (messageId: string) => {
    const text = replyText[messageId];
    if (!text || !text.trim()) {
      toast.error("Please enter a reply message.");
      return;
    }

    setReplyingId(messageId);
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: messageId,
          reply: text,
          status: "REPLIED"
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Reply sent to customer!");
        setReplyText((prev) => ({ ...prev, [messageId]: "" }));
        fetchMessages();
      } else {
        toast.error(data.message || "Failed to send reply.");
      }
    } catch (err) {
      toast.error("An error occurred while sending reply.");
    } finally {
      setReplyingId(null);
    }
  };

  return (
    <SiteShell>
      <PageHero
        eyebrow="Customer Communication"
        title="Restaurant Messages Inbox"
        description="Receive customer inquiries, support requests, order questions, and post direct staff responses saved in PostgreSQL."
      />
      <section className="section-shell space-y-8 pb-16 md:pb-24">
        <AdminNav />

        {loading ? (
          <div className="py-16 text-center text-stone-500">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-primary" />
            <p className="mt-2 text-sm">Loading customer messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <Card className="p-12 text-center text-stone-500">
            <p className="font-heading text-lg font-bold">No customer messages received yet.</p>
          </Card>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((msg) => (
              <Card key={msg.id} className="p-6 space-y-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4 dark:border-stone-800">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-heading text-lg font-bold text-stone-900 dark:text-white">
                        {msg.subject || "General Enquiry"}
                      </span>
                      {msg.status === "UNREAD" ? (
                        <Badge className="bg-amber-500 text-white">Unread</Badge>
                      ) : msg.status === "REPLIED" ? (
                        <Badge className="bg-emerald-600 text-white">Replied</Badge>
                      ) : (
                        <Badge className="bg-blue-500 text-white">{msg.status}</Badge>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-4 text-xs text-stone-500">
                      <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5" /> {msg.name}</span>
                      <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {msg.email}</span>
                      <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {msg.phone}</span>
                      <span>Received: {new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {msg.orderId && (
                    <Badge className="font-mono text-xs text-brand-primary border border-brand-primary/30">
                      Order #{msg.orderId}
                    </Badge>
                  )}
                </div>

                <div className="rounded-xl bg-stone-50 p-4 text-sm text-stone-700 dark:bg-stone-900 dark:text-stone-300">
                  <p className="font-medium text-stone-900 dark:text-white mb-1">Customer Message:</p>
                  <p className="leading-6">{msg.message}</p>
                </div>

                {msg.reply ? (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200/60 p-4 text-sm text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300 space-y-1">
                    <p className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Sent Staff Reply:
                    </p>
                    <p>{msg.reply}</p>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    <Textarea
                      placeholder="Type your official restaurant reply to this customer..."
                      rows={2}
                      value={replyText[msg.id] || ""}
                      onChange={(e) => setReplyText({ ...replyText, [msg.id]: e.target.value })}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSendReply(msg.id)}
                      disabled={replyingId === msg.id}
                      className="font-bold gap-2"
                    >
                      <Send className="h-3.5 w-3.5" />
                      {replyingId === msg.id ? "Sending..." : "Send Official Reply"}
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
