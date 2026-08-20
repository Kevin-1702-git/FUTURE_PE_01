import fs from 'fs';
import path from 'path';

const menuItemsPath = path.resolve('prisma/menu-items.json');
const menuItemsTsPath = path.resolve('lib/data/menu-items.ts');

const items = JSON.parse(fs.readFileSync(menuItemsPath, 'utf8'));

const newItems = [
  // Parotta Category
  {
    id: "FL-298",
    slug: "malabar-layered-parotta",
    name: "Malabar Layered Parotta",
    description: "Flaky, multi-layered golden parotta served with spicy veg or chicken kurma.",
    category: "Parotta",
    cuisine: "South Indian",
    price: 149,
    type: "Veg",
    calories: 340,
    preparationTime: 15,
    image: "/images/parotta/malabar-layered-parotta.jpg",
    available: true,
    rating: 4.8,
    spiceLevel: "Medium",
    featured: true,
    bestSeller: true,
    todaysSpecial: true
  },
  {
    id: "FL-299",
    slug: "chicken-kothu-parotta",
    name: "Chicken Kothu Parotta",
    description: "Shredded flaky parotta tossed on a hot griddle with spiced chicken, eggs, and onions.",
    category: "Parotta",
    cuisine: "South Indian",
    price: 249,
    type: "Non-Veg",
    calories: 520,
    preparationTime: 20,
    image: "/images/parotta/chicken-kothu-parotta.jpg",
    available: true,
    rating: 4.9,
    spiceLevel: "High",
    featured: true,
    bestSeller: true,
    todaysSpecial: false
  },
  {
    id: "FL-300",
    slug: "ceylon-egg-parotta",
    name: "Ceylon Egg Parotta",
    description: "Square-folded thin dough stuffed with spiced minced egg, onions, and green chilies.",
    category: "Parotta",
    cuisine: "South Indian",
    price: 199,
    type: "Non-Veg",
    calories: 410,
    preparationTime: 18,
    image: "/images/parotta/ceylon-egg-parotta.jpg",
    available: true,
    rating: 4.6,
    spiceLevel: "Medium",
    featured: false,
    bestSeller: false,
    todaysSpecial: false
  },
  {
    id: "FL-301",
    slug: "chilli-paneer-parotta-roll",
    name: "Chilli Paneer Parotta Roll",
    description: "Soft parotta rolled with wok-tossed chili cottage cheese and mint chutney.",
    category: "Parotta",
    cuisine: "South Indian",
    price: 219,
    type: "Veg",
    calories: 460,
    preparationTime: 15,
    image: "/images/parotta/chilli-paneer-parotta-roll.jpg",
    available: true,
    rating: 4.5,
    spiceLevel: "High",
    featured: false,
    bestSeller: false,
    todaysSpecial: false
  },
  {
    id: "FL-302",
    slug: "coin-parotta-with-salna",
    name: "Coin Parotta with Salna",
    description: "Bite-sized mini coin parottas served with rich aromatic street-style salna gravy.",
    category: "Parotta",
    cuisine: "South Indian",
    price: 179,
    type: "Veg",
    calories: 380,
    preparationTime: 15,
    image: "/images/parotta/coin-parotta-with-salna.jpg",
    available: true,
    rating: 4.7,
    spiceLevel: "Medium",
    featured: true,
    bestSeller: false,
    todaysSpecial: false
  },
  {
    id: "FL-303",
    slug: "mutton-chuka-stuffed-parotta",
    name: "Mutton Chukka Stuffed Parotta",
    description: "Crispy pan-fried parotta stuffed with spicy dry roasted Madurai mutton chukka.",
    category: "Parotta",
    cuisine: "South Indian",
    price: 329,
    type: "Non-Veg",
    calories: 590,
    preparationTime: 22,
    image: "/images/parotta/mutton-chuka-stuffed-parotta.jpg",
    available: true,
    rating: 4.9,
    spiceLevel: "High",
    featured: true,
    bestSeller: true,
    todaysSpecial: true
  },

  // Additional Biryani & Indian items
  {
    id: "FL-304",
    slug: "hyderabadi-dum-chicken-biryani",
    name: "Hyderabadi Dum Chicken Biryani",
    description: "Long-grain basmati rice slow-cooked with marinated chicken, saffron, and aromatic spices.",
    category: "Biryani",
    cuisine: "Indian",
    price: 349,
    type: "Non-Veg",
    calories: 680,
    preparationTime: 25,
    image: "/images/biryani/hyderabadi-dum-chicken-biryani.jpg",
    available: true,
    rating: 4.9,
    spiceLevel: "High",
    featured: true,
    bestSeller: true,
    todaysSpecial: true
  },
  {
    id: "FL-305",
    slug: "paneer-tikka-dum-biryani",
    name: "Paneer Tikka Dum Biryani",
    description: "Char-grilled marinated paneer cubes layered with fragrant basmati rice and herbs.",
    category: "Biryani",
    cuisine: "Indian",
    price: 299,
    type: "Veg",
    calories: 540,
    preparationTime: 20,
    image: "/images/biryani/paneer-tikka-dum-biryani.jpg",
    available: true,
    rating: 4.7,
    spiceLevel: "Medium",
    featured: false,
    bestSeller: true,
    todaysSpecial: false
  },
  {
    id: "FL-306",
    slug: "shahi-malai-kofta",
    name: "Shahi Malai Kofta",
    description: "Crispy cottage cheese dumplings simmered in a creamy cashew and tomato sauce.",
    category: "North Indian",
    cuisine: "North Indian",
    price: 319,
    type: "Veg",
    calories: 480,
    preparationTime: 20,
    image: "/images/north-indian/shahi-malai-kofta.jpg",
    available: true,
    rating: 4.8,
    spiceLevel: "Mild",
    featured: true,
    bestSeller: false,
    todaysSpecial: false
  },
  {
    id: "FL-307",
    slug: "punjabi-dal-makhani-bowl",
    name: "Punjabi Dal Makhani Bowl",
    description: "Black lentils slow-cooked overnight with butter, cream, and subtle whole spices.",
    category: "North Indian",
    cuisine: "North Indian",
    price: 269,
    type: "Veg",
    calories: 410,
    preparationTime: 18,
    image: "/images/north-indian/punjabi-dal-makhani-bowl.jpg",
    available: true,
    rating: 4.8,
    spiceLevel: "Mild",
    featured: true,
    bestSeller: true,
    todaysSpecial: false
  },

  // Additional Combos & Party Packs
  {
    id: "FL-308",
    slug: "royal-feast-family-combo",
    name: "Royal Feast Family Combo",
    description: "Includes 2 Biryanis, 1 Butter Chicken, 4 Naans, Starters, and 2 Desserts for 4-5 people.",
    category: "Family Combos",
    cuisine: "Indian",
    price: 1299,
    type: "Non-Veg",
    calories: 2100,
    preparationTime: 35,
    image: "/images/family-combos/royal-feast-family-combo.jpg",
    available: true,
    rating: 4.9,
    spiceLevel: "Medium",
    featured: true,
    bestSeller: true,
    todaysSpecial: true
  },
  {
    id: "FL-309",
    slug: "ultimate-party-snack-pack",
    name: "Ultimate Party Snack Pack",
    description: "Assorted platter of Paneer Tikka, Veg Spring Rolls, Loaded Nachos, and Cheese Balls.",
    category: "Party Packs",
    cuisine: "Global",
    price: 999,
    type: "Veg",
    calories: 1650,
    preparationTime: 30,
    image: "/images/party-packs/ultimate-party-snack-pack.jpg",
    available: true,
    rating: 4.8,
    spiceLevel: "Medium",
    featured: true,
    bestSeller: false,
    todaysSpecial: false
  }
];

// Deduplicate by ID
const existingIds = new Set(items.map(i => i.id));
for (const item of newItems) {
  if (!existingIds.has(item.id)) {
    items.push(item);
  }
}

fs.writeFileSync(menuItemsPath, JSON.stringify(items, null, 2));

const tsContent = 'import { MenuItem } from "@/types";\n\nexport const menuItems: MenuItem[] = ' + JSON.stringify(items, null, 2) + ';\n';
fs.writeFileSync(menuItemsTsPath, tsContent);

console.log(`Successfully updated menu-items.json and menu-items.ts with ${items.length} total items.`);
