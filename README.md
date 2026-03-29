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

This repo includes:

- `.github/workflows/ci.yml` for CI validation on pushes and pull requests
- `.github/workflows/deploy.yml` for building a deployable standalone artifact on pushes to `main` or `master`

The workflows:

- installs dependencies with `npm ci`
- generates the Prisma client
- starts a temporary PostgreSQL service
- runs `prisma db push`
- runs `npm run lint`
- runs `npm run build`
- uploads a `travel-standalone` artifact containing the Next.js standalone server output

Because the workflow uses CI-safe placeholder environment values, your real secrets stay in local env files or GitHub repository secrets for your deployment platform.

## Production Deployment

This app cannot be deployed to GitHub Pages because it uses API routes, NextAuth, Prisma, and Razorpay. GitHub Actions now builds a standalone server artifact instead. For actual hosting, deploy that artifact or connect the repository to a server-capable host such as Vercel, Railway, or Render and add the same environment variables from `.env.example` in that platform.
