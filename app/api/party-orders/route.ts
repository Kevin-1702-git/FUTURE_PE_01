import { NextResponse } from "next/server";
import { z } from "zod";

const partySchema = z.object({
  guestName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  eventType: z.string().min(2),
  guestCount: z.coerce.number().min(10),
  eventDate: z.string().min(1),
  budget: z.coerce.number().optional(),
  notes: z.string().optional()
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = partySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "Party order enquiry received",
    enquiry: {
      id: `PARTY-${Date.now()}`,
      status: "ENQUIRY",
      ...parsed.data
    }
  });
}
