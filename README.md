# Travel Sphere

Travel Sphere is a Next.js travel booking platform for browsing tour packages, placing bookings, and managing payments.

## Local Setup

1. Copy `.env.example` to `.env.local` and fill in your real credentials.
2. Install dependencies:

```bash
npm ci
```

3. Generate the Prisma client and push the schema:

```bash
npx prisma generate
npx prisma db push
```

4. Seed sample packages if needed:

```bash
npm run seed
```

5. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## GitHub Actions

This repo includes `.github/workflows/ci.yml`, which validates the same build flow Vercel will use. The workflow:

- installs dependencies with `npm ci`
- starts a temporary PostgreSQL service
- runs `npm run lint`
- runs `npm run vercel-build`

Because the workflow uses CI-safe placeholder environment values, your real secrets stay in local env files or in Vercel project settings.

## Vercel Deployment

This app should be deployed on Vercel, not GitHub Pages.

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Add all environment variables from `.env.example`.
4. Set `NEXTAUTH_URL` to your production Vercel domain, for example `https://your-project.vercel.app`.
5. Trigger the first deployment.

This repo is already configured for that flow:

- `vercel.json` tells Vercel to use `npm run vercel-build`
- `npm run vercel-build` runs Prisma generate, `prisma migrate deploy`, and `next build`
- `prisma/migrations` now contains the initial migration Vercel can apply to a fresh PostgreSQL database

For Preview deployments, use a separate preview database if you do not want preview builds to touch production data.
