"use client";

import { useEffect, useState } from "react";
import { UtensilsCrossed, CheckCircle2, Clock, Send, Calendar, Users, IndianRupee, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { AdminNav } from "@/components/dashboard/admin-nav";
import { PageHero } from "@/components/layout/page-hero";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";

interface CateringRequest {
  id: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  eventType: string;
  guestCount: number;
  eventDate: string;
  budget?: number;
  foodRequirements?: string;
  notes?: string;
  status: string;
  quotation?: number;
  restaurantResponse?: string;
  createdAt: string;
}

export default function AdminCateringPage() {
  const [requests, setRequests] = useState<CateringRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Quote input form state
  const [quoteAmount, setQuoteAmount] = useState<{ [key: string]: string }>({});
  const [responseNotes, setResponseNotes] = useState<{ [key: string]: string }>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchCatering = async () => {
    try {
      const res = await fetch("/api/catering");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setRequests(data.data || []);
        }
      }
    } catch (e) {
      console.warn("Fetch admin catering error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatering();
  }, []);

  const handleIssueQuote = async (id: string, newStatus = "QUOTED") => {
    const amount = Number(quoteAmount[id]);
    const notes = responseNotes[id] || "";

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid quotation amount.");
      return;
    }

    setUpdatingId(id);
    try {
      const res = await fetch("/api/catering", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          quotation: amount,
          restaurantResponse: notes,
          status: newStatus
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Quotation issued successfully!");
        fetchCatering();
      } else {
        toast.error(data.message || "Failed to update quotation.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/catering", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Catering request status updated to ${status}`);
        fetchCatering();
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-500 text-white">Pending Proposal</Badge>;
      case "REVIEWING":
        return <Badge className="bg-blue-500 text-white font-semibold">Under Review</Badge>;
      case "QUOTED":
        return <Badge className="bg-purple-600 text-white font-bold">Quotation Issued</Badge>;
      case "ACCEPTED":
        return <Badge className="bg-emerald-600 text-white font-bold">Accepted & Confirmed</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-500 text-white">Declined</Badge>;
      case "COMPLETED":
        return <Badge className="bg-emerald-700 text-white">Event Completed</Badge>;
      default:
        return <Badge className="bg-stone-500 text-white">{status}</Badge>;
    }
  };

  return (
    <SiteShell>
      <PageHero
        eyebrow="Event Management"
        title="Catering & Party Requests"
        description="Review incoming event catering proposals, issue custom menu quotations, manage guest requirements, and update event status."
      />
      <section className="section-shell space-y-8 pb-16 md:pb-24">
        <AdminNav />

        {loading ? (
          <div className="py-16 text-center text-stone-500">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-primary" />
            <p className="mt-2 text-sm">Loading catering requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <Card className="p-12 text-center text-stone-500">
            <p className="font-heading text-lg font-bold">No catering requests received yet.</p>
          </Card>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {requests.map((req) => (
              <Card key={req.id} className="p-6 space-y-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4 dark:border-stone-800">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-heading text-xl font-bold text-stone-900 dark:text-white">
                        {req.eventType}
                      </span>
                      {getStatusBadge(req.status)}
                    </div>
                    <p className="mt-1 text-xs text-stone-500">
                      Client: <strong>{req.contactName}</strong> ({req.contactEmail} • {req.contactPhone}) • Submitted: {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm font-semibold">
                    <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-brand-primary" /> {req.guestCount} Guests</span>
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-brand-primary" /> {new Date(req.eventDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="grid gap-4 sm:grid-cols-2 text-sm">
                  {req.foodRequirements && (
                    <div className="rounded-xl bg-stone-50 p-3.5 dark:bg-stone-900">
                      <p className="font-semibold text-xs text-stone-500 uppercase">Food & Menu Preferences:</p>
                      <p className="mt-1 text-stone-800 dark:text-stone-200">{req.foodRequirements}</p>
                    </div>
                  )}
                  <div className="rounded-xl bg-stone-50 p-3.5 dark:bg-stone-900">
                    <p className="font-semibold text-xs text-stone-500 uppercase">Client Budget:</p>
                    <p className="mt-1 text-base font-bold text-brand-primary">
                      {req.budget ? formatCurrency(req.budget) : "Flexible / Not specified"}
                    </p>
                  </div>
                </div>

                {req.notes && (
                  <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded-xl dark:bg-stone-900">
                    <strong>Special Venue Notes:</strong> {req.notes}
                  </div>
                )}

                {/* Issued Quotation or Issue Quote Form */}
                {req.quotation ? (
                  <div className="rounded-xl bg-purple-50 border border-purple-200/60 p-4 text-sm dark:bg-purple-950/20 space-y-1">
                    <p className="font-bold text-purple-700 dark:text-purple-300">
                      Issued Quotation Amount: <span className="text-xl text-brand-primary font-heading ml-1">{formatCurrency(req.quotation)}</span>
                    </p>
                    {req.restaurantResponse && (
                      <p className="text-stone-700 dark:text-stone-300 text-xs">Staff Note: {req.restaurantResponse}</p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-3 dark:bg-amber-950/20 dark:border-amber-900/50">
                    <p className="font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300">Issue Formal Event Quotation (₹)</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        type="number"
                        placeholder="Quote Amount (₹)"
                        value={quoteAmount[req.id] || ""}
                        onChange={(e) => setQuoteAmount({ ...quoteAmount, [req.id]: e.target.value })}
                      />
                      <Input
                        placeholder="Response notes (e.g. Includes live starter counter & dessert bar)"
                        value={responseNotes[req.id] || ""}
                        onChange={(e) => setResponseNotes({ ...responseNotes, [req.id]: e.target.value })}
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleIssueQuote(req.id)}
                      disabled={updatingId === req.id}
                      className="bg-purple-600 hover:bg-purple-700 font-bold text-xs"
                    >
                      {updatingId === req.id ? "Issuing Quote..." : "Issue & Send Proposal Quote"}
                    </Button>
                  </div>
                )}

                {/* Status Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-3 dark:border-stone-800">
                  <span className="text-xs text-stone-500">Update Status:</span>
                  <div className="flex flex-wrap gap-2">
                    {req.status === "PENDING" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(req.id, "REVIEWING")}
                        disabled={updatingId === req.id}
                      >
                        Mark Under Review
                      </Button>
                    )}
                    {req.status !== "ACCEPTED" && req.status !== "COMPLETED" && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(req.id, "ACCEPTED")}
                        disabled={updatingId === req.id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-xs"
                      >
                        ✓ Accept & Confirm Event
                      </Button>
                    )}
                    {req.status === "ACCEPTED" && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(req.id, "COMPLETED")}
                        disabled={updatingId === req.id}
                        className="bg-emerald-700 text-xs"
                      >
                        ✓ Event Completed
                      </Button>
                    )}
                    {req.status !== "REJECTED" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUpdateStatus(req.id, "REJECTED")}
                        disabled={updatingId === req.id}
                        className="text-xs text-red-500"
                      >
                        Decline Proposal
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
