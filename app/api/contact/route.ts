import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  message: z.string().min(10)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "Contact enquiry sent successfully",
    data: parsed.data
  });
}
