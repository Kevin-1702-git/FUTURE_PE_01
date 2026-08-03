import { NextResponse } from "next/server";
import { z } from "zod";

import { createReservationReference } from "@/services/reservation-service";

const reservationSchema = z.object({
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(10),
  guestsCount: z.coerce.number().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  specialRequests: z.string().optional()
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = reservationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "Reservation request recorded",
    reservation: {
      id: createReservationReference(),
      status: "PENDING",
      ...parsed.data
    }
  });
}
