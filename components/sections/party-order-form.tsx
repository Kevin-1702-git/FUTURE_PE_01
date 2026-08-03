"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const partySchema = z.object({
  guestName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  eventType: z.string().min(2),
  guestCount: z.coerce.number().min(10),
  eventDate: z.string().min(1),
  budget: z.coerce.number().min(1000).optional(),
  notes: z.string().optional()
});

type PartyInput = z.infer<typeof partySchema>;

export function PartyOrderForm() {
  const form = useForm<PartyInput>({
    resolver: zodResolver(partySchema),
    defaultValues: {
      guestName: "",
      email: "",
      phone: "",
      eventType: "Birthday Party",
      guestCount: 25,
      eventDate: "",
      budget: 10000,
      notes: ""
    }
  });

  async function onSubmit(values: PartyInput) {
    const response = await fetch("/api/party-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      toast.error("Unable to submit party enquiry.");
      return;
    }

    toast.success("Party order enquiry submitted.");
    form.reset();
  }

  return (
    <Card className="p-8">
      <form className="grid gap-5 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="guestName">Contact Name</Label>
          <Input id="guestName" {...form.register("guestName")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...form.register("email")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...form.register("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventType">Event Type</Label>
          <Input id="eventType" {...form.register("eventType")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guestCount">Guest Count</Label>
          <Input id="guestCount" type="number" {...form.register("guestCount")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventDate">Event Date</Label>
          <Input id="eventDate" type="date" {...form.register("eventDate")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="budget">Estimated Budget</Label>
          <Input id="budget" type="number" {...form.register("budget")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...form.register("notes")} />
        </div>
        <div className="md:col-span-2">
          <Button type="submit">Request Event Proposal</Button>
        </div>
      </form>
    </Card>
  );
}
