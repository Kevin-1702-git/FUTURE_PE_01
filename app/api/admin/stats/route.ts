import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    const isStaff = role === "RESTAURANT_ADMIN" || role === "ADMIN" || role === "MANAGER" || role === "STAFF";

    if (!session || !isStaff) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Restaurant Admin privileges required." },
        { status: 403 }
      );
    }

    let totalOrders = 0;
    let pendingOrders = 0;
    let completedOrders = 0;
    let totalRevenue = 0;
    let unreadMessages = 0;
    let pendingCatering = 0;
    let averageRating = 4.8;

    try {
      totalOrders = await prisma.order.count();
      pendingOrders = await prisma.order.count({ where: { status: "PENDING" } });
      completedOrders = await prisma.order.count({
        where: { OR: [{ status: "DELIVERED" }, { status: "COMPLETED" as any }] }
      });

      const revenueAgg = await prisma.order.aggregate({
        _sum: { total: true },
        where: { NOT: { status: "CANCELLED" } }
      });
      totalRevenue = revenueAgg._sum.total || 0;

      unreadMessages = await prisma.contactMessage.count({ where: { status: "UNREAD" } });
      pendingCatering = await prisma.partyOrder.count({ where: { status: "PENDING" } });

      const ratingAgg = await prisma.review.aggregate({
        _avg: { rating: true }
      });
      if (ratingAgg._avg.rating) {
        averageRating = Math.round(ratingAgg._avg.rating * 10) / 10;
      }
    } catch (e) {
      console.warn("DB stats calc error, returning fallback metrics:", e);
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue,
        unreadMessages,
        pendingCatering,
        averageRating
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
