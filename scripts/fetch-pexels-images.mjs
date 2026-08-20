import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

// Try loading dotenv if present
try {
  const dotenv = await import("dotenv");
  dotenv.config({ path: ".env.local" });
  dotenv.config({ path: ".env" });
} catch (e) {
  // dotenv not installed or failed, fallback to process.env
}

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

const MENU_JSON_PATH = path.resolve("prisma/menu-items.json");
const MENU_TS_PATH = path.resolve("lib/data/menu-items.ts");
const PUBLIC_DIR = path.resolve("public");
const CREDITS_PATH = path.resolve("public/images/pexels-credits.json");

if (!fs.existsSync(MENU_JSON_PATH)) {
  console.error("Error: prisma/menu-items.json not found.");
  process.exit(1);
}

const menuItems = JSON.parse(fs.readFileSync(MENU_JSON_PATH, "utf-8"));
let credits = {};
if (fs.existsSync(CREDITS_PATH)) {
  try {
    credits = JSON.parse(fs.readFileSync(CREDITS_PATH, "utf-8"));
  } catch (e) {}
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const request = protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}, status code: ${response.statusCode}`));
      }
      const fileStream = fs.createWriteStream(destPath);
      response.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close();
        resolve(true);
      });
      fileStream.on("error", (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    });
    request.on("error", reject);
  });
}

async function searchPexels(query) {
  if (!PEXELS_API_KEY) {
    throw new Error("PEXELS_API_KEY is not defined in environment variables.");
  }
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=square`;
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          Authorization: PEXELS_API_KEY
        }
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode !== 200) {
            return reject(new Error(`Pexels API error ${res.statusCode}: ${data}`));
          }
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.photos || []);
          } catch (err) {
            reject(err);
          }
        });
      }
    );
    req.on("error", reject);
  });
}

async function run() {
  console.log("Starting Pexels food image fetch process...");
  if (!PEXELS_API_KEY) {
    console.warn("WARNING: PEXELS_API_KEY is missing in environment. Using existing local image paths.");
    return;
  }

  let updatedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const item of menuItems) {
    const categorySlug = slugify(item.category);
    const itemSlug = item.slug || slugify(item.name);
    const relativeDir = `images/${categorySlug}`;
    const targetDir = path.join(PUBLIC_DIR, relativeDir);
    const targetFile = path.join(targetDir, `${itemSlug}.jpg`);
    const publicPath = `/${relativeDir}/${itemSlug}.jpg`;

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 1000) {
      item.image = publicPath;
      skippedCount++;
      continue;
    }

    const searchQuery = `${item.name} food ${item.category}`;
    console.log(`Searching Pexels for [${item.id}] "${item.name}"...`);

    try {
      const photos = await searchPexels(searchQuery);
      if (photos && photos.length > 0) {
        const photo = photos[0];
        const imageUrl = photo.src.large || photo.src.medium || photo.src.original;

        await downloadFile(imageUrl, targetFile);

        item.image = publicPath;
        credits[publicPath] = {
          photographer: photo.photographer,
          photographer_url: photo.photographer_url,
          pexels_url: photo.url,
          photo_id: photo.id
        };
        updatedCount++;
        console.log(`✓ Downloaded image for ${item.name} -> ${publicPath}`);

        // Rate limiting buffer
        await new Promise((r) => setTimeout(r, 400));
      } else {
        console.warn(`! No suitable Pexels photo found for "${item.name}". Keeping fallback image.`);
        failedCount++;
      }
    } catch (err) {
      console.error(`X Error processing "${item.name}":`, err.message);
      failedCount++;
    }
  }

  fs.writeFileSync(MENU_JSON_PATH, JSON.stringify(menuItems, null, 2));

  const tsContent = 'import { MenuItem } from "@/types";\n\nexport const menuItems: MenuItem[] = ' + JSON.stringify(menuItems, null, 2) + ';\n';
  fs.writeFileSync(MENU_TS_PATH, tsContent);

  if (fs.existsSync(path.dirname(CREDITS_PATH))) {
    fs.writeFileSync(CREDITS_PATH, JSON.stringify(credits, null, 2));
  }

  console.log(`
Pexels Image Sync Completed!
- Updated: ${updatedCount}
- Preserved Existing: ${skippedCount}
- Fallback/Failed: ${failedCount}
Total Items: ${menuItems.length}
`);
}

run();
