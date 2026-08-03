import fs from "node:fs";
import path from "node:path";

const specPath = path.join(process.cwd(), "feast-lane-website-spec.md");
const outputTsPath = path.join(process.cwd(), "lib", "data", "menu-items.ts");
const outputJsonPath = path.join(process.cwd(), "prisma", "menu-items.json");
const outputSqlPath = path.join(process.cwd(), "prisma", "seed.sql");

const markdown = fs.readFileSync(specPath, "utf8");
const lines = markdown.split(/\r?\n/);
const rows = lines.filter((line) => line.startsWith("|") && !line.includes("---"));

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const cuisineMap = {
  Appetizers: "Global",
  Soups: "Global",
  Salads: "Global",
  Pizza: "Italian",
  Burgers: "American",
  Sandwiches: "Continental",
  Pasta: "Italian",
  Italian: "Italian",
  Chinese: "Chinese",
  Japanese: "Japanese",
  Mexican: "Mexican",
  Indian: "Indian",
  "South Indian": "South Indian",
  "North Indian": "North Indian",
  Seafood: "Coastal",
  "Grill & BBQ": "Grill",
  Rice: "Asian",
  Biryani: "Indian",
  Bread: "Indian",
  Desserts: "Dessert",
  "Ice Cream": "Dessert",
  Cakes: "Dessert",
  Coffee: "Cafe",
  Tea: "Cafe",
  Milkshakes: "Beverage",
  Smoothies: "Beverage",
  "Fresh Juice": "Beverage",
  Mocktails: "Beverage",
  "Soft Drinks": "Beverage",
  "Kids Menu": "Kids",
  "Family Combos": "Combo",
  "Party Packs": "Party"
};

const spiceMap = {
  Appetizers: "Medium",
  Soups: "Mild",
  Salads: "Mild",
  Pizza: "Medium",
  Burgers: "Medium",
  Sandwiches: "Mild",
  Pasta: "Mild",
  Italian: "Mild",
  Chinese: "Hot",
  Japanese: "Mild",
  Mexican: "Hot",
  Indian: "Medium",
  "South Indian": "Hot",
  "North Indian": "Medium",
  Seafood: "Medium",
  "Grill & BBQ": "Medium",
  Rice: "Mild",
  Biryani: "Hot",
  Bread: "Mild",
  Desserts: "Mild",
  "Ice Cream": "Mild",
  Cakes: "Mild",
  Coffee: "Mild",
  Tea: "Mild",
  Milkshakes: "Mild",
  Smoothies: "Mild",
  "Fresh Juice": "Mild",
  Mocktails: "Mild",
  "Soft Drinks": "Mild",
  "Kids Menu": "Mild",
  "Family Combos": "Medium",
  "Party Packs": "Medium"
};

const calorieBase = {
  Appetizers: 280,
  Soups: 140,
  Salads: 190,
  Pizza: 420,
  Burgers: 520,
  Sandwiches: 360,
  Pasta: 480,
  Italian: 460,
  Chinese: 410,
  Japanese: 330,
  Mexican: 390,
  Indian: 440,
  "South Indian": 320,
  "North Indian": 430,
  Seafood: 360,
  "Grill & BBQ": 410,
  Rice: 350,
  Biryani: 560,
  Bread: 110,
  Desserts: 300,
  "Ice Cream": 240,
  Cakes: 320,
  Coffee: 140,
  Tea: 60,
  Milkshakes: 420,
  Smoothies: 260,
  "Fresh Juice": 150,
  Mocktails: 180,
  "Soft Drinks": 120,
  "Kids Menu": 380,
  "Family Combos": 1600,
  "Party Packs": 2800
};

const prepBase = {
  Appetizers: 15,
  Soups: 12,
  Salads: 10,
  Pizza: 22,
  Burgers: 18,
  Sandwiches: 14,
  Pasta: 20,
  Italian: 22,
  Chinese: 18,
  Japanese: 20,
  Mexican: 18,
  Indian: 24,
  "South Indian": 18,
  "North Indian": 24,
  Seafood: 25,
  "Grill & BBQ": 26,
  Rice: 18,
  Biryani: 30,
  Bread: 8,
  Desserts: 12,
  "Ice Cream": 5,
  Cakes: 8,
  Coffee: 7,
  Tea: 6,
  Milkshakes: 8,
  Smoothies: 7,
  "Fresh Juice": 6,
  Mocktails: 7,
  "Soft Drinks": 4,
  "Kids Menu": 14,
  "Family Combos": 35,
  "Party Packs": 55
};

const items = rows.slice(1).map((line, index) => {
  const cells = line
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());

  const [name, category, priceRaw, type, description] = cells;
  const price = Number(priceRaw);
  const base = calorieBase[category] ?? 250;
  const prep = prepBase[category] ?? 15;
  const calories = base + ((index % 7) * 17 + (type === "Non-Veg" ? 45 : 0));
  const prepMinutes = prep + (index % 4) * 3;
  const slug = slugify(name);
  const image = "/images/menu-placeholder.svg";

  return {
    id: `FL-${String(index + 1).padStart(3, "0")}`,
    slug,
    name,
    description,
    category,
    cuisine: cuisineMap[category] ?? "Global",
    price,
    type,
    calories,
    preparationTime: prepMinutes,
    image,
    available: true,
    rating: Number((4.2 + ((index % 5) * 0.15)).toFixed(1)),
    spiceLevel: spiceMap[category] ?? "Medium",
    featured: index < 12,
    bestSeller: index % 9 === 0,
    todaysSpecial: index % 17 === 0
  };
});

fs.mkdirSync(path.dirname(outputTsPath), { recursive: true });

const tsFile = `import { MenuItem } from "@/types";\n\nexport const menuItems: MenuItem[] = ${JSON.stringify(
  items,
  null,
  2
)};\n`;

fs.writeFileSync(outputTsPath, tsFile);
fs.writeFileSync(outputJsonPath, JSON.stringify(items, null, 2));

const sqlRows = items
  .map((item) => {
    const description = item.description.replace(/'/g, "''");
    const image = item.image.replace(/'/g, "''");
    const type = item.type === "Non-Veg" ? "Non_Veg" : "Veg";
    return `('${item.id}','${item.slug}','${item.name.replace(/'/g, "''")}','${description}','${item.category}','${item.cuisine}',${item.price},'${type}',${item.calories},${item.preparationTime},'${image}',${item.available},${item.rating},'${item.spiceLevel}',${item.featured},${item.bestSeller},${item.todaysSpecial})`;
  })
  .join(",\n");

const sqlFile = `INSERT INTO "MenuItem" ("id","slug","name","description","categoryLabel","cuisine","price","type","calories","preparationTime","image","available","rating","spiceLevel","featured","bestSeller","todaysSpecial") VALUES\n${sqlRows};\n`;

fs.writeFileSync(outputSqlPath, sqlFile);
console.log(`Generated ${items.length} menu items.`);
