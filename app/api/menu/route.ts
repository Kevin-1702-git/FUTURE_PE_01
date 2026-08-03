import { NextResponse } from "next/server";

import { getAllMenuItems } from "@/services/menu-service";

export async function GET() {
  return NextResponse.json({
    success: true,
    count: getAllMenuItems().length,
    data: getAllMenuItems()
  });
}
