"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Calendar, Users, IndianRupee, Send, CheckCircle, Clock, FileText } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export function PartyOrderForm() {
  const { data: session } = useSession();

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [eventType, setEventType] = useState("Corporate Event");
  const [guestCount, setGuestCount] = useState(50);
  const [eventDate, setEventDate] = useState("");
  const [budget, setBudget] = useState(25000);
  const [foodRequirements, setFoodRequirements] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cateringRequests, setCateringRequests] = useState<any[]>([]);

  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setContactName(session.user.name);
      if (session.user.email) setContactEmail(session.user.email);
      if ((session.user as any).phone) setContactPhone((session.user as any).phone);
    }
  }, [session]);

  const loadCateringRequests = async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/catering");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCateringRequests(data.data || []);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadCateringRequests();
  }, [session]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactPhone || !eventDate || !eventType) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/catering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName,
          contactEmail,
          contactPhone,
          eventType,
          guestCount: Number(guestCount),
          eventDate,
          budget: Number(budget),
          foodRequirements,
          notes
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("Catering request submitted! Feast Lane event manager will issue a quote shortly.");
        setFoodRequirements("");
        setNotes("");
        loadCateringRequests();
      } else {
        toast.error(data.message || "Unable to submit catering request.");
      }
    } catch (err) {
      toast.error("An error occurred while submitting catering request.");
    } finally {
      setSubmitting(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-500 text-white">Pending Review</Badge>;
      case "REVIEWING":
        return <Badge className="bg-blue-500 text-white">Under Review</Badge>;
      case "QUOTED":
        return <Badge className="bg-purple-600 text-white font-bold">Quotation Issued</Badge>;
      case "ACCEPTED":
        return <Badge className="bg-emerald-600 text-white">Confirmed & Accepted</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-500 text-white">Declined</Badge>;
      case "COMPLETED":
        return <Badge className="bg-emerald-700 text-white">Completed</Badge>;
      default:
        return <Badge className="bg-stone-500 text-white">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-8">
        <h3 className="font-heading text-2xl font-bold mb-6">Request Catering & Party Proposal</h3>
        <form className="grid gap-5 md:grid-cols-2" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Name *</Label>
            <Input
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Full Name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Email Address *</Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Phone Number *</Label>
            <Input
              id="contactPhone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventType">Event Type *</Label>
            <select
              id="eventType"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full h-11 rounded-2xl border border-stone-200 bg-white px-4 text-sm dark:border-white/10 dark:bg-stone-900"
            >
              <option value="Wedding / Engagement">Wedding / Engagement</option>
              <option value="Birthday Party">Birthday Party</option>
              <option value="Corporate Event">Corporate / Office Event</option>
              <option value="Anniversary">Anniversary Celebration</option>
              <option value="Family Gathering">Family Gathering</option>
              <option value="Other Celebration">Other Celebration</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guestCount">Estimated Guest Count *</Label>
            <Input
              id="guestCount"
              type="number"
              min={5}
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventDate">Event Date *</Label>
            <Input
              id="eventDate"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="budget">Estimated Budget (₹)</Label>
            <Input
              id="budget"
              type="number"
              step={1000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              placeholder="e.g. 25000"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="foodRequirements">Food & Cuisine Preferences</Label>
            <Textarea
              id="foodRequirements"
              rows={3}
              value={foodRequirements}
              onChange={(e) => setFoodRequirements(e.target.value)}
              placeholder="e.g. South Indian & North Indian buffet, live parotta counter, mocktails bar, veg/non-veg split..."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Additional Special Notes / Venue Details</Label>
            <Textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Outdoor garden setup, serving timing 7 PM to 10 PM..."
            />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={submitting} className="font-bold gap-2">
              <Send className="h-4 w-4" />
              {submitting ? "Submitting Request..." : "Request Custom Event Proposal"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Submitted Catering Enquiries & Quotes */}
      {cateringRequests.length > 0 && (
        <Card className="p-6 space-y-4">
          <h4 className="font-heading text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-primary" /> Your Event Catering Requests
          </h4>
          <div className="space-y-4">
            {cateringRequests.map((req) => (
              <div key={req.id} className="rounded-2xl border border-stone-100 p-5 space-y-3 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3 dark:border-stone-800">
                  <div>
                    <span className="font-bold text-lg text-stone-900 dark:text-white">{req.eventType}</span>
                    <p className="text-xs text-stone-500">
                      Date: {new Date(req.eventDate).toLocaleDateString()} • {req.guestCount} Guests
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(req.status)}
                  </div>
                </div>

                <div className="text-sm text-stone-600 dark:text-stone-300 space-y-1">
                  {req.foodRequirements && <p><strong>Food Requirements:</strong> {req.foodRequirements}</p>}
                  {req.budget && <p><strong>Estimated Budget:</strong> {formatCurrency(req.budget)}</p>}
                </div>

                {req.quotation && (
                  <div className="mt-3 rounded-xl bg-purple-500/10 border border-purple-500/20 p-4 space-y-2">
                    <p className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-purple-600" /> Restaurant Official Quotation Issued:
                    </p>
                    <p className="text-2xl font-bold text-brand-primary">{formatCurrency(req.quotation)}</p>
                    {req.restaurantResponse && (
                      <p className="text-sm text-stone-700 dark:text-stone-300">{req.restaurantResponse}</p>
                    )}
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
