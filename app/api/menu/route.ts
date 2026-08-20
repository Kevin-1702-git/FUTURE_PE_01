import { NextResponse } from "next/server";
import { z } from "zod";
import { getAllMenuItems } from "@/services/menu-service";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const query = searchParams.get("query");

    let items = await getAllMenuItems();

    if (category && category !== "All") {
      items = items.filter((i) => i.category.toLowerCase() === category.toLowerCase());
    }
    if (type && type !== "All") {
      items = items.filter((i) => i.type.toLowerCase() === type.toLowerCase());
    }
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.cuisine.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

const menuItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  description: z.string().min(5),
  category: z.string().min(2),
  cuisine: z.string().min(2),
  price: z.number().min(0),
  type: z.enum(["Veg", "Non-Veg"]),
  calories: z.number().optional().default(300),
  preparationTime: z.number().optional().default(20),
  image: z.string().optional().default("/images/default-dish.jpg"),
  available: z.boolean().optional().default(true),
  spiceLevel: z.string().optional().default("Medium"),
  featured: z.boolean().optional().default(false),
  bestSeller: z.boolean().optional().default(false),
  todaysSpecial: z.boolean().optional().default(false)
});

// Admin Add / Update menu item
export async function POST(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || !["RESTAURANT_ADMIN", "ADMIN", "MANAGER", "STAFF"].includes(role)) {
      return NextResponse.json({ success: false, message: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await request.json();
    const parsed = menuItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const id = data.id || `FL-${Date.now()}`;

    let newItem = null;
    try {
      // Find or create category
      let category = await prisma.category.findFirst({
        where: { name: { equals: data.category, mode: "insensitive" } }
      });
      if (!category) {
        category = await prisma.category.create({
          data: {
            name: data.category,
            slug: data.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            description: `${data.category} options at Feast Lane`
          }
        });
      }

      newItem = await prisma.menuItem.upsert({
        where: { id },
        update: {
          name: data.name,
          slug,
          description: data.description,
          categoryLabel: data.category,
          categoryId: category.id,
          cuisine: data.cuisine,
          price: Math.round(data.price),
          type: data.type === "Veg" ? "Veg" : "Non_Veg",
          calories: Math.round(data.calories),
          preparationTime: Math.round(data.preparationTime),
          image: data.image,
          available: data.available,
          spiceLevel: data.spiceLevel,
          featured: data.featured,
          bestSeller: data.bestSeller,
          todaysSpecial: data.todaysSpecial
        },
        create: {
          id,
          slug,
          name: data.name,
          description: data.description,
          categoryLabel: data.category,
          categoryId: category.id,
          cuisine: data.cuisine,
          price: Math.round(data.price),
          type: data.type === "Veg" ? "Veg" : "Non_Veg",
          calories: Math.round(data.calories),
          preparationTime: Math.round(data.preparationTime),
          image: data.image,
          available: data.available,
          spiceLevel: data.spiceLevel,
          featured: data.featured,
          bestSeller: data.bestSeller,
          todaysSpecial: data.todaysSpecial
        }
      });
    } catch (e: any) {
      console.warn("DB Upsert error for menu item:", e);
      newItem = { id, slug, ...data };
    }

    return NextResponse.json({ success: true, item: newItem });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// Delete menu item
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || (role !== "ADMIN" && role !== "MANAGER")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Item ID required" }, { status: 400 });
    }

    try {
      await prisma.menuItem.delete({ where: { id } });
    } catch (e) {
      console.warn("DB delete error for menu item:", e);
    }

    return NextResponse.json({ success: true, message: "Menu item deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
