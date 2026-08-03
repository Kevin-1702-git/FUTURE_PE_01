import { NextResponse } from "next/server";
import { z } from "zod";

import { calculateOrderSummary } from "@/lib/utils";

const orderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      price: z.number(),
      quantity: z.number().min(1)
    })
  ),
  couponDiscount: z.number().optional().default(0),
  paymentMethod: z.string().min(2)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = orderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const subtotal = parsed.data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const summary = calculateOrderSummary(subtotal, parsed.data.couponDiscount);

  return NextResponse.json({
    success: true,
    message: "Order created successfully",
    order: {
      id: `ORD-${Date.now()}`,
      status: "PENDING",
      paymentMethod: parsed.data.paymentMethod,
      ...summary
    }
  });
}
