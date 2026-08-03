import { PrismaClient, Role, FoodType } from "@prisma/client";
import menuItems from "./menu-items.json";

const prisma = new PrismaClient();

async function main() {
  const categoryNames = [...new Set(menuItems.map((item) => item.category))];

  for (const categoryName of categoryNames) {
    await prisma.category.upsert({
      where: {
        slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      },
      update: {},
      create: {
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: `${categoryName} selections at Feast Lane`
      }
    });
  }

  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((category) => [category.name, category.id]));

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        description: item.description,
        categoryId: categoryMap.get(item.category),
        categoryLabel: item.category,
        cuisine: item.cuisine,
        price: item.price,
        type: item.type === "Veg" ? FoodType.Veg : FoodType.Non_Veg,
        calories: item.calories,
        preparationTime: item.preparationTime,
        image: item.image,
        available: item.available,
        rating: item.rating,
        spiceLevel: item.spiceLevel,
        featured: item.featured,
        bestSeller: item.bestSeller,
        todaysSpecial: item.todaysSpecial
      },
      create: {
        id: item.id,
        slug: item.slug,
        name: item.name,
        description: item.description,
        categoryId: categoryMap.get(item.category),
        categoryLabel: item.category,
        cuisine: item.cuisine,
        price: item.price,
        type: item.type === "Veg" ? FoodType.Veg : FoodType.Non_Veg,
        calories: item.calories,
        preparationTime: item.preparationTime,
        image: item.image,
        available: item.available,
        rating: item.rating,
        spiceLevel: item.spiceLevel,
        featured: item.featured,
        bestSeller: item.bestSeller,
        todaysSpecial: item.todaysSpecial
      }
    });
  }

  const passwordHash = "$2a$10$Ta2.RXeTQFzjH5Rj5shHpuQ1b9r8jvzXpG9Pb7xNL0Vhqo0Q5uY0a";

  await prisma.user.upsert({
    where: { email: "admin@feastlane.com" },
    update: {},
    create: {
      name: "Aman Admin",
      email: "admin@feastlane.com",
      role: Role.ADMIN,
      passwordHash
    }
  });

  await prisma.user.upsert({
    where: { email: "customer@feastlane.com" },
    update: {},
    create: {
      name: "Riya Customer",
      email: "customer@feastlane.com",
      role: Role.CUSTOMER,
      passwordHash
    }
  });

  await prisma.coupon.createMany({
    data: [
      {
        code: "FAMILY20",
        title: "Weekend Family Feast",
        description: "20 percent off on family combos",
        discountType: "PERCENTAGE",
        discountValue: 20,
        minOrderValue: 1200
      },
      {
        code: "STUDENT10",
        title: "Student Saver",
        description: "10 percent off on selected meals",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderValue: 400
      }
    ],
    skipDuplicates: true
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
