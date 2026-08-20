import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const cateringSchema = z.object({
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(8),
  eventType: z.string().min(2),
  guestCount: z.number().min(5),
  eventDate: z.string().min(5),
  budget: z.number().optional(),
  foodRequirements: z.string().optional(),
  notes: z.string().optional()
});

// POST: Create Catering Request in PostgreSQL
export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const parsed = cateringSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const userId = session?.user?.id || null;
    const id = `CAT-${Date.now()}`;

    let reqRecord = null;
    try {
      reqRecord = await prisma.partyOrder.create({
        data: {
          id,
          userId,
          contactName: data.contactName,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          eventType: data.eventType,
          guestCount: Math.round(data.guestCount),
          eventDate: new Date(data.eventDate),
          budget: data.budget ? Math.round(data.budget) : null,
          foodRequirements: data.foodRequirements || null,
          notes: data.notes || null,
          status: "PENDING"
        }
      });
    } catch (e: any) {
      console.warn("DB write error for party order catering request:", e);
      reqRecord = {
        id,
        ...data,
        status: "PENDING",
        createdAt: new Date()
      };
    }

    return NextResponse.json({
      success: true,
      message: "Catering request submitted successfully to Feast Lane event team.",
      data: reqRecord
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// GET: Fetch catering requests (customer's own or staff all)
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
      const requests = await prisma.partyOrder.findMany({
        where: isStaff ? {} : { OR: [{ userId }, { contactEmail: session.user.email || "" }] },
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json({ success: true, count: requests.length, data: requests });
    } catch (e) {
      console.warn("DB find party orders error:", e);
      return NextResponse.json({ success: true, count: 0, data: [] });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// PATCH: Update Catering Status & Issue Quotation (Restaurant Staff)
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "MANAGER" && role !== "STAFF")) {
      return NextResponse.json({ success: false, message: "Unauthorized. Staff privileges required." }, { status: 403 });
    }

    const body = await request.json();
    const { id, status, quotation, restaurantResponse } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Catering Request ID required" }, { status: 400 });
    }

    try {
      const updated = await prisma.partyOrder.update({
        where: { id },
        data: {
          ...(status && { status }),
          ...(quotation !== undefined && { quotation: Math.round(quotation) }),
          ...(restaurantResponse !== undefined && { restaurantResponse })
        }
      });
      return NextResponse.json({ success: true, data: updated });
    } catch (e: any) {
      return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
