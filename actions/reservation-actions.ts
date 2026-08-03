"use server";

import { z } from "zod";

const schema = z.object({
  guestName: z.string().min(2),
  guestEmail: z.string().email()
});

export async function submitReservationAction(input: FormData) {
  const parsed = schema.safeParse({
    guestName: input.get("guestName"),
    guestEmail: input.get("guestEmail")
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() };
  }

  return { success: true, message: "Reservation action validated" };
}
