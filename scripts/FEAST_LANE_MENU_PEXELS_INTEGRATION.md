# Feast Lane — Expanded Menu + Pexels Integration

## What was changed

- Expanded `menu-items.json` from 224 to 320 menu items.
- Kept the exact field structure already used by `seed.ts`.
- Added 96 new dishes across existing Feast Lane categories.
- Created `seed-expanded.sql` with all 320 MenuItem rows.
- Created `fetch-pexels-images.mjs` to search Pexels and download food photos into `public/images/...`.
- The existing `image` values remain local `/images/...` paths, so the current frontend does not need to be rewritten.
- Pexels photographer/source metadata is stored separately in `pexels-attribution.json`.

## Files to copy into Feast Lane

1. `menu-items-expanded.json` → replace your current `menu-items.json` (or rename it).
2. `fetch-pexels-images.mjs` → `scripts/fetch-pexels-images.mjs`.
3. `seed-expanded.sql` → optional SQL seed if you use SQL instead of Prisma.
4. `FEAST_LANE_MENU_PEXELS_INTEGRATION.md` → project documentation.

## Recommended Prisma workflow

Your current `seed.ts` already imports `menu-items.json` and upserts every menu item, mapping the JSON fields into `MenuItem`. Therefore, replacing the JSON file is enough for the new menu to be included when the existing Prisma seed runs.

After replacing it:

```bash
npx prisma generate
npx prisma db seed
```

Use your existing project seed command if `package.json` defines a custom seed command.

## Pexels

Create `.env.local`:

```env
PEXELS_API_KEY=your_real_pexels_api_key
```

Then:

```bash
node scripts/fetch-pexels-images.mjs
```

The script searches:

```text
<food name> <category> food
```

and downloads the first suitable Pexels result into the same path referenced by the menu item, for example:

```text
public/images/pizza/bbq-chicken-pizza.jpg
```

## Important

Do not put the Pexels API key in client-side React/Next.js code. Keep it server-side in `.env.local`.

The script also stores photographer/source information in `pexels-attribution.json` so the project can display or document attribution where required.

## If you use `next/image`

Because the images are downloaded into `public/images`, you can keep using paths such as:

```text
/images/pizza/bbq-chicken-pizza.jpg
```

No remote image-domain configuration is needed.
