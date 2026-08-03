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
import { reservationTimeSlots } from "@/lib/data/content";

const reservationSchema = z.object({
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(10),
  guestsCount: z.coerce.number().min(1).max(20),
  date: z.string().min(1),
  time: z.string().min(1),
  specialRequests: z.string().optional()
});

type ReservationInput = z.infer<typeof reservationSchema>;

export function ReservationForm() {
  const form = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      guestsCount: 2,
      date: "",
      time: reservationTimeSlots[0],
      specialRequests: ""
    }
  });

  async function onSubmit(values: ReservationInput) {
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      toast.error("Unable to submit reservation right now.");
      return;
    }

    toast.success("Reservation request submitted. Confirmation email queued.");
    form.reset();
  }

  return (
    <Card className="p-8">
      <form className="grid gap-5 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="guestName">Guest Name</Label>
          <Input id="guestName" {...form.register("guestName")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guestEmail">Email</Label>
          <Input id="guestEmail" type="email" {...form.register("guestEmail")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guestPhone">Phone</Label>
          <Input id="guestPhone" {...form.register("guestPhone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guestsCount">Guests</Label>
          <Input id="guestsCount" type="number" min={1} max={20} {...form.register("guestsCount")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" {...form.register("date")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <select
            id="time"
            {...form.register("time")}
            className="h-11 w-full rounded-2xl border border-stone-200 bg-white/80 px-4 text-sm dark:border-white/10 dark:bg-white/5"
          >
            {reservationTimeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="specialRequests">Special Requests</Label>
          <Textarea id="specialRequests" {...form.register("specialRequests")} />
        </div>
        <div className="md:col-span-2">
          <Button type="submit" size="lg">
            Book Your Table
          </Button>
        </div>
      </form>
    </Card>
  );
}
