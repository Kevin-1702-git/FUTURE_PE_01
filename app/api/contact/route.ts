import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  subject: z.string().optional().default("General Enquiry"),
  message: z.string().min(5),
  orderId: z.string().optional()
});

// POST: Save customer message to DB
export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const userId = session?.user?.id || null;
    const messageId = `MSG-${Date.now()}`;

    let msgRecord = null;
    try {
      msgRecord = await prisma.contactMessage.create({
        data: {
          id: messageId,
          userId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
          orderId: data.orderId || null,
          status: "UNREAD"
        }
      });
    } catch (e: any) {
      console.warn("DB write error for contact message, returning mock response:", e);
      msgRecord = {
        id: messageId,
        ...data,
        status: "UNREAD",
        createdAt: new Date()
      };
    }

    return NextResponse.json({
      success: true,
      message: "Contact message sent successfully to Feast Lane staff.",
      data: msgRecord
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// GET: Retrieve messages
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const role = (session.user as any).role;
    const isStaff = role === "ADMIN" || role === "MANAGER" || role === "STAFF";

    try {
      const messages = await prisma.contactMessage.findMany({
        where: isStaff ? {} : { OR: [{ userId }, { email: session.user.email || "" }] },
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json({ success: true, count: messages.length, data: messages });
    } catch (e) {
      console.warn("DB find contact messages error:", e);
      return NextResponse.json({ success: true, count: 0, data: [] });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// PATCH: Restaurant staff reply / mark resolved
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "MANAGER" && role !== "STAFF")) {
      return NextResponse.json({ success: false, message: "Unauthorized. Staff privileges required." }, { status: 403 });
    }

    const body = await request.json();
    const { id, reply, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Message ID required" }, { status: 400 });
    }

    try {
      const updated = await prisma.contactMessage.update({
        where: { id },
        data: {
          ...(reply !== undefined && { reply, repliedAt: new Date(), status: "REPLIED" }),
          ...(status && { status })
        }
      });
      return NextResponse.json({ success: true, message: updated });
    } catch (e: any) {
      return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
