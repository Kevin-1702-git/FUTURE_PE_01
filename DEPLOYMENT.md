# Deployment Guide

## Vercel + Neon

1. Create a Neon PostgreSQL database and copy the connection string into `DATABASE_URL`.
2. Add all variables from `.env.example` to the Vercel project.
3. Run:

```bash
npm install
npm run generate:menu
npx prisma generate
npx prisma migrate deploy
```

4. Set the build command to:

```bash
npm run generate:menu && npx prisma generate && next build
```

5. Deploy to Vercel.

## Docker

```bash
docker compose up --build
```

## Production Notes

- Replace demo authentication with persisted credentials or email auth backed by the database.
- Wire Nodemailer, Razorpay, Cloudinary, and Google Maps credentials before go-live.
- Add rate limiting and CSRF middleware at the edge for public POST endpoints.
