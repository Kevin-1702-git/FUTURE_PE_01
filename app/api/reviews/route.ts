import { NextResponse } from "next/server";

import { testimonials } from "@/lib/site";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: testimonials
  });
}
