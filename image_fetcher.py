import os
import re
import csv
import time
from pathlib import Path

import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("PEXELS_API_KEY")
if not API_KEY:
    raise SystemExit(
        "Missing PEXELS_API_KEY. Add your NEW Pexels API key to the .env file."
    )

BASE_DIR = Path(__file__).resolve().parent
IMAGE_DIR = BASE_DIR / "food_images"
CSV_FILE = BASE_DIR / "food_images.csv"

HEADERS = {"Authorization": API_KEY}
SEARCH_URL = "https://api.pexels.com/v1/search"

# The 224 Feast Lane menu items supplied by the project owner.
MENU = {
    "Appetizers": [
        "Crispy Corn Pepper Toss", "Paneer Tikka Skewers", "Stuffed Mushroom Caps",
        "Veg Spring Rolls", "Chicken Satay Sticks", "Fish Finger Basket", "Loaded Nachos Supreme"
    ],
    "Soups": [
        "Tomato Basil Soup", "Sweet Corn Soup", "Hot and Sour Veg Soup",
        "Cream of Mushroom Soup", "Chicken Clear Soup", "Hot and Sour Chicken Soup", "Seafood Laksa Soup"
    ],
    "Salads": [
        "Garden Green Salad", "Greek Feta Salad", "Quinoa Roasted Veg Salad",
        "Caesar Salad", "Chicken Caesar Salad", "Asian Sesame Chicken Salad", "Prawn Avocado Salad"
    ],
    "Pizza": [
        "Margherita Classica", "Farmhouse Delight", "Truffle Paneer Tikka Pizza",
        "Four Cheese Pizza", "Pepperoni Inferno", "BBQ Chicken Pizza", "Seafood Marinara Pizza"
    ],
    "Burgers": [
        "Classic Veg Burger", "Paneer Crunch Burger", "Mushroom Melt Burger",
        "Mexican Bean Burger", "Chicken Cheese Burger", "Crispy Chicken Burger", "Lamb Gourmet Burger"
    ],
    "Sandwiches": [
        "Veg Club Sandwich", "Grilled Corn Cheese Sandwich", "Pesto Veg Panini",
        "Bombay Masala Sandwich", "Chicken Mayo Sandwich", "Peri Peri Chicken Panini", "Tuna Melt Sandwich"
    ],
    "Pasta": [
        "Arrabbiata Penne", "Alfredo Fettuccine", "Pesto Primavera Pasta",
        "Baked Mac and Cheese", "Chicken Alfredo Pasta", "Spaghetti Meatball Marinara", "Seafood Aglio Olio"
    ],
    "Italian": [
        "Risotto Funghi", "Spinach Ricotta Ravioli", "Veg Lasagna al Forno",
        "Gnocchi Pomodoro", "Chicken Lasagna", "Chicken Parmigiana", "Seafood Risotto"
    ],
    "Chinese": [
        "Veg Hakka Noodles", "Veg Fried Rice", "Paneer Chilli Dry",
        "Gobi Manchurian", "Chicken Schezwan Noodles", "Chicken Fried Rice", "Chilli Garlic Prawns"
    ],
    "Japanese": [
        "Veg Sushi Roll", "Avocado Inari Pocket", "Vegetable Tempura",
        "Tofu Teriyaki Bowl", "Chicken Katsu Curry", "Teriyaki Chicken Bowl", "Salmon Sushi Roll"
    ],
    "Mexican": [
        "Veg Quesadilla", "Bean Burrito Bowl", "Mexican Corn Cups",
        "Loaded Veg Tacos", "Chicken Quesadilla", "Chipotle Chicken Burrito", "Prawn Taco Trio"
    ],
    "Indian": [
        "Paneer Butter Masala", "Dal Makhani", "Veg Kadai Masala",
        "Malai Kofta", "Butter Chicken", "Chicken Tikka Masala", "Mutton Rogan Josh"
    ],
    "South Indian": [
        "Idli Sambar", "Ghee Roast Dosa", "Masala Uttapam", "Pongal with Vada",
        "Chicken Chettinad", "Madurai Mutton Sukka", "Meen Kuzhambu"
    ],
    "North Indian": [
        "Paneer Tikka Masala", "Chole Bhature", "Aloo Jeera", "Navratan Korma",
        "Amritsari Fish Fry", "Murgh Lababdar", "Mutton Korma"
    ],
    "Seafood": [
        "Garlic Butter Prawns", "Fish Tikka", "Calamari Rings", "Crab Pepper Fry",
        "Grilled Lemon Fish", "Malabar Prawn Curry", "Seafood Platter"
    ],
    "Grill & BBQ": [
        "Paneer Malai Tikka", "Tandoori Broccoli", "Stuffed Grilled Potato",
        "Smoky Veg Skewer Platter", "Tandoori Chicken", "BBQ Chicken Wings", "Lamb Seekh Kebab"
    ],
    "Rice": [
        "Jeera Rice", "Veg Pulao", "Paneer Fried Rice", "Curd Rice",
        "Egg Fried Rice", "Chicken Pulao", "Prawn Fried Rice"
    ],
    "Biryani": [
        "Veg Dum Biryani", "Paneer Biryani", "Mushroom Biryani",
        "Hyderabadi Veg Biryani", "Hyderabadi Chicken Biryani", "Mutton Biryani", "Prawn Biryani"
    ],
    "Bread": [
        "Tandoori Roti", "Butter Naan", "Garlic Naan", "Cheese Naan",
        "Lachha Paratha", "Kulcha", "Roomali Roti"
    ],
    "Desserts": [
        "Gulab Jamun", "Rasmalai", "Brownie Sundae", "Tiramisu Cup",
        "Kunafa Delight", "Churros with Chocolate Dip", "Baked Cheesecake Slice"
    ],
    "Ice Cream": [
        "Vanilla Bean Scoop", "Belgian Chocolate Scoop", "Strawberry Cream Scoop",
        "Butterscotch Crunch Scoop", "Pistachio Kulfi Scoop", "Mango Sorbet Scoop", "Sundae Royal"
    ],
    "Cakes": [
        "Black Forest Pastry", "Red Velvet Slice", "Triple Chocolate Truffle",
        "Blueberry Cheesecake Slice", "Caramel Almond Cake", "Mango Mousse Cake", "Opera Cake Slice"
    ],
    "Coffee": [
        "Espresso Shot", "Americano", "Cappuccino", "Cafe Latte",
        "Mocha", "Cold Coffee Classic", "Hazelnut Frappe"
    ],
    "Tea": [
        "Masala Chai", "Ginger Tea", "Lemon Tea", "Green Tea",
        "Elaichi Tea", "Kashmiri Kahwa", "Iced Peach Tea"
    ],
    "Milkshakes": [
        "Chocolate Thick Shake", "Vanilla Oreo Shake", "Strawberry Shake",
        "Butterscotch Shake", "Cold Coffee Shake", "Mango Almond Shake", "KitKat Crunch Shake"
    ],
    "Smoothies": [
        "Berry Blast Smoothie", "Mango Yogurt Smoothie", "Banana Peanut Smoothie",
        "Kiwi Mint Smoothie", "Pineapple Coconut Smoothie", "Avocado Honey Smoothie", "Detox Green Smoothie"
    ],
    "Fresh Juice": [
        "Orange Juice", "Watermelon Juice", "Sweet Lime Juice", "Pineapple Juice",
        "Pomegranate Juice", "Carrot Beetroot Juice", "Mixed Fruit Juice"
    ],
    "Mocktails": [
        "Virgin Mojito", "Blue Lagoon", "Watermelon Mint Cooler", "Mango Passion Fizz",
        "Cucumber Basil Spritzer", "Berry Ginger Smash", "Pina Colada Mocktail"
    ],
    "Soft Drinks": [
        "Mineral Water", "Sparkling Water", "Cola", "Lemon Soda",
        "Orange Fizz", "Ginger Ale", "Tonic Lime"
    ],
    "Kids Menu": [
        "Mini Veg Burger Meal", "Cheesy Pasta Bowl", "Crispy Potato Smiles",
        "Mini Cheese Pizza", "Chicken Popcorn Cup", "Mini Chicken Burger Meal", "Fish Nugget Box"
    ],
    "Family Combos": [
        "Veg Family Feast", "South Indian Family Combo", "Italian Family Combo",
        "North Indian Family Combo", "Chicken Meal Combo", "Seafood Family Combo", "Mixed Grill Family Combo"
    ],
    "Party Packs": [
        "Veg Party Starter Pack", "Veg Celebration Meal Pack", "South Indian Breakfast Pack",
        "Premium Veg Catering Pack", "Chicken Party Bucket", "Biryani Celebration Pack", "Grand Event Mixed Pack"
    ],
}

def slugify(text):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", text.lower())).strip("-")

def search_photo(query):
    # Try the exact item first, then progressively broader searches.
    queries = [query, query.replace("Classica", ""), query.replace("Delight", "")]
    for q in queries:
        q = q.strip()
        response = requests.get(
            SEARCH_URL,
            headers=HEADERS,
            params={"query": q, "per_page": 1, "orientation": "landscape"},
            timeout=30,
        )
        if response.status_code == 200:
            photos = response.json().get("photos", [])
            if photos:
                return photos[0]
        elif response.status_code == 429:
            print("Pexels rate limit reached. Try again later.")
            return None
        elif response.status_code in (401, 403):
            raise SystemExit("Pexels API key is invalid or unauthorized.")
    return None

def download_image(url, path):
    response = requests.get(url, timeout=60)
    response.raise_for_status()
    path.write_bytes(response.content)

def main():
    IMAGE_DIR.mkdir(exist_ok=True)

    rows = []
    total = sum(len(items) for items in MENU.values())
    count = 0

    print(f"Fetching images for {total} Feast Lane items...\n")

    for category, items in MENU.items():
        category_dir = IMAGE_DIR / slugify(category)
        category_dir.mkdir(parents=True, exist_ok=True)

        for item in items:
            count += 1
            filename = f"{slugify(item)}.jpg"
            path = category_dir / filename
            print(f"[{count}/{total}] {category} -> {item}")

            if path.exists():
                print("  Already downloaded; skipping.")
                rows.append({
                    "name": item,
                    "category": category,
                    "filename": str(path.relative_to(IMAGE_DIR)).replace("\\", "/"),
                    "image_url": "",
                    "pexels_url": "",
                    "status": "already_exists",
                })
                continue

            photo = search_photo(item)
            if not photo:
                print("  No matching image found.")
                rows.append({
                    "name": item,
                    "category": category,
                    "filename": "",
                    "image_url": "",
                    "pexels_url": "",
                    "status": "not_found",
                })
                continue

            image_url = photo["src"]["large"]
            download_image(image_url, path)

            rows.append({
                "name": item,
                "category": category,
                "filename": str(path.relative_to(IMAGE_DIR)).replace("\\", "/"),
                "image_url": image_url,
                "pexels_url": photo.get("url", ""),
                "status": "downloaded",
            })

            # Be polite to the API.
            time.sleep(0.2)

    with CSV_FILE.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["name", "category", "filename", "image_url", "pexels_url", "status"],
        )
        writer.writeheader()
        writer.writerows(rows)

    downloaded = sum(r["status"] in ("downloaded", "already_exists") for r in rows)
    print(f"\nDone! {downloaded}/{total} images are available.")
    print(f"Images: {IMAGE_DIR}")
    print(f"CSV:    {CSV_FILE}")

if __name__ == "__main__":
    main()
