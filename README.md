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

This repo includes `.github/workflows/ci.yml`, which is ready to run on pushes and pull requests. The workflow:

- installs dependencies with `npm ci`
- generates the Prisma client
- starts a temporary PostgreSQL service
- runs `prisma db push`
- runs `npm run lint`
- runs `npm run build`

Because the workflow uses CI-safe placeholder environment values, your real secrets stay in local env files or GitHub repository secrets for your deployment platform.

## Production Deployment

GitHub Actions now validates that the app can build cleanly. For an actual production deploy, connect the repository to your target host such as Vercel, Railway, or Render and add the same environment variables from `.env.example` in that platform.
